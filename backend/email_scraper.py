import os
import io
import json
import time
import logging
import fitz  # PyMuPDF
from datetime import datetime, date, timedelta
from dateutil.relativedelta import relativedelta
from dotenv import load_dotenv, find_dotenv
from PIL import Image, ImageEnhance, ImageOps
from pyzbar.pyzbar import decode
from imap_tools import MailBox, OR, AND, A
from google import genai
from google.genai import types

# --- 1. CONFIGURATION ---

load_dotenv(find_dotenv())

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


# File Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOWNLOAD_FOLDER = os.path.join(BASE_DIR, "event_posters")
EVENTS_JSON_FILE = os.path.join(BASE_DIR, "all_events.json")
PROCESSED_LOG_FILE = os.path.join(BASE_DIR, "processed_emails.json")
USAGE_LOG_FILE = os.path.join(BASE_DIR, "model_usage.json")

# POSITIVE KEYWORDS (We want these)
SEARCH_KEYWORDS = [
    "Event", "Workshop", "Hackathon", "Register", "Conference", 
    "Symposium", "Webinar", "Session", "Invitation", "Fest", 
    "Coding", "Challenge", "Competition", "Meetup", "Bootcamp"
]

# NEGATIVE KEYWORDS (We strictly ignore these)
IGNORE_KEYWORDS = [
    "Time Table", "Arrear", "Exam Schedule", "Circular", 
    "Course Registration", "Fee Payment", "Holiday", "Reschedule",
    "Hall Ticket", "Bus Route", "Disciplinary"
]

# MODEL CONFIGURATION
MODELS_CONFIG = {
    "gemini-2.5-flash":      {"rpm": 5,  "rpd": 1400, "priority": 1},
    "gemini-2.5-flash-lite": {"rpm": 10, "rpd": 1400, "priority": 2},
    "gemini-1.5-flash":      {"rpm": 10, "rpd": 1400, "priority": 3},
}

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
client = genai.Client(api_key=GEMINI_API_KEY)

if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

# --- 2. QUOTA SYSTEM (Unchanged) ---

class QuotaManager:
    def __init__(self, filename):
        self.filename = filename
        self.usage = self._load_usage()

    def _load_usage(self):
        if os.path.exists(self.filename):
            try:
                with open(self.filename, 'r') as f:
                    data = json.load(f)
                    if data.get("date") != str(date.today()):
                        return {"date": str(date.today()), "models": {}}
                    return data
            except: pass
        return {"date": str(date.today()), "models": {}}

    def _save_usage(self):
        with open(self.filename, 'w') as f:
            json.dump(self.usage, f, indent=2)

    def can_use_model(self, model_name):
        limit = MODELS_CONFIG.get(model_name, {}).get("rpd", 1000)
        current = self.usage["models"].get(model_name, 0)
        if current >= limit:
            logging.warning(f"  [!] Daily limit reached for {model_name}. Skipping.")
            return False
        return True

    def increment_usage(self, model_name):
        current = self.usage["models"].get(model_name, 0)
        self.usage["models"][model_name] = current + 1
        self._save_usage()

quota_manager = QuotaManager(USAGE_LOG_FILE)

# --- 3. DATA HELPERS ---

def load_processed_uids():
    if os.path.exists(PROCESSED_LOG_FILE):
        try:
            with open(PROCESSED_LOG_FILE, 'r') as f: return set(json.load(f))
        except: return set()
    return set()

def save_processed_uid(uid):
    uids = load_processed_uids()
    uids.add(uid)
    with open(PROCESSED_LOG_FILE, 'w') as f: json.dump(list(uids), f)

def append_event_to_json(event_data):
    events = []
    if os.path.exists(EVENTS_JSON_FILE):
        try:
            with open(EVENTS_JSON_FILE, 'r') as f: events = json.load(f)
        except: events = []
    events.append(event_data)
    with open(EVENTS_JSON_FILE, 'w') as f: json.dump(events, f, indent=2)

# --- 4. IMAGE PROCESSING ---

def pdf_to_image_bytes(pdf_bytes):
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        if doc.page_count < 1: return None
        page = doc.load_page(0) 
        # Increased DPI to 300 for better Text/QR recognition
        pix = page.get_pixmap(dpi=300) 
        return pix.tobytes("jpg")
    except Exception as e:
        logging.error(f"PDF Error: {e}")
        return None

def decode_qr_from_image(image_bytes):
    """
    Enhanced QR Decoder: Converts to Grayscale & Enhances Contrast
    to fix issues with detection on colored posters.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        
        # 1. Try Original
        decoded = decode(img)
        if decoded: return decoded[0].data.decode('utf-8')

        # 2. Try Enhanced (Grayscale + Contrast)
        gray_img = img.convert('L')
        enhancer = ImageEnhance.Contrast(gray_img)
        enhanced_img = enhancer.enhance(2.0)
        
        decoded = decode(enhanced_img)
        if decoded: return decoded[0].data.decode('utf-8')
        
        # 3. Try Inverted (Negative) - NEW FIX
        # Many artistic QR codes are white-on-dark.
        inverted_img = ImageOps.invert(img.convert('RGB'))
        decoded = decode(inverted_img)
        if decoded: return decoded[0].data.decode('utf-8')
        
    except Exception as e:
        # Suppress zbar assertions/warnings
        pass
    return None

def extract_event_details(image_bytes, qr_link_context):
    """
    Strict AI Extraction: explicitly asks to ignore non-events.
    """
    prompt = f"""
    Analyze this image carefully.
    
    STEP 1: CLASSIFICATION
    Is this strictly a "Student Event" (Hackathon, Workshop, Symposium, Fest, Competition)?
    - If it is a Time Table, Exam Schedule, Arrear Exam, Course Registration, or Administrative Notice: RETURN JSON with "is_event": false.
    
    STEP 2: EXTRACTION (Only if Step 1 is True)
    - If "is_event": true, extract the details below.
    - LINK LOGIC: 
      1. Use the QR Link provided below if available.
      2. If NO QR Link, look for a written URL/Link text in the image (e.g. bit.ly/..., forms.gle/...) and use that.
      3. If neither, set "registration_link": "None".

    CONTEXT: Scanned QR Code Link: "{qr_link_context if qr_link_context else 'None'}"
    
    REQUIRED JSON FORMAT:
    {{
        "is_event": true/false,
        "event_title": "String",
        "venue": "String",
        "start_date": "String (YYYY-MM-DD HH:MM)",
        "end_date": "String",
        "registration_fee": "String",
        "team_size": "String",
        "category": "String",
        "registration_link": "String",
        "organizer": "String"
    }}
    """
    
    sorted_models = sorted(MODELS_CONFIG.keys(), key=lambda k: MODELS_CONFIG[k]['priority'])
    
    for model_name in sorted_models:
        if not quota_manager.can_use_model(model_name): continue

        try:
            rpm = MODELS_CONFIG[model_name]["rpm"]
            sleep_time = (60 / rpm) + 2
            logging.info(f"    [..] Using {model_name} (Waiting {sleep_time:.1f}s)...")
            time.sleep(sleep_time)

            response = client.models.generate_content(
                model=model_name,
                contents=[prompt, types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")],
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            
            quota_manager.increment_usage(model_name)
            return json.loads(response.text)

        except Exception as e:
            logging.warning(f"    [x] Failed {model_name}: {e}")
            continue

    logging.error("    [X] All models failed.")
    return None

# --- 5. MAIN LOGIC ---

def process_emails():
    processed_uids = load_processed_uids()
    
    # --- USER INPUT FOR DATE ---
    try:
        months_input = input("How many months back should I search? (Default: 1): ")
        months_back = int(months_input) if months_input.strip() else 1
    except ValueError:
        months_back = 1
        
    cutoff_date = date.today() - relativedelta(months=months_back)
    logging.info(f"--- STARTING SCAN ---")
    logging.info(f"Scanning from: {cutoff_date} to Today")
    logging.info(f"Connecting to {EMAIL_USER}...")
    
    try:
        with MailBox('imap.gmail.com').login(EMAIL_USER, EMAIL_PASS) as mailbox:
            
            criteria = AND(
                OR(subject=SEARCH_KEYWORDS, text=SEARCH_KEYWORDS),
                date_gte=cutoff_date
            )
            logging.info(f"Criteria built. Fetching UIDs (Date >= {cutoff_date})...")
            
            # OPTIMIZATION: Fetch UIDs first, filter locally, then fetch content
            search_uids = mailbox.uids(criteria)
            new_uids = [u for u in search_uids if u not in processed_uids]
            
            logging.info(f"Found {len(search_uids)} emails. New: {len(new_uids)} (Skipped: {len(search_uids) - len(new_uids)})")
            
            email_count = 0
            if new_uids:
                # Fetch only the new UIDs
                # Note: imap_tools fetch(uids=...) expects a list of UIDs
                for msg in mailbox.fetch(A(uid=new_uids), reverse=True):
                    email_count += 1
                    
                    # No need to check processed_uids again, but safe to keep logic consistent if needed
                    # logging.info(f"Processing ({msg.date.date()}): {msg.subject[:40]}...")
                    # ... processing logic continues below ...
                    
                    # --- STEP 1: SUBJECT FILTERING (Python Side) ---
                    subject_lower = msg.subject.lower()
                    if any(bad_word.lower() in subject_lower for bad_word in IGNORE_KEYWORDS):
                        logging.info(f"  [SKIP] Ignored Circular/Exam: {msg.subject[:40]}...")
                        save_processed_uid(msg.uid)
                        continue

                    logging.info(f"Processing ({msg.date.date()}): {msg.subject[:40]}...")
                    poster_found = False
                    
                    for att in msg.attachments:
                        image_bytes = None
                        
                        if "image" in att.content_type:
                            image_bytes = att.payload
                        elif "pdf" in att.content_type:
                            image_bytes = pdf_to_image_bytes(att.payload)
                        
                        if image_bytes:
                            poster_found = True
                            logging.info(f"  > Analyzing Visual: {att.filename}")
                            
                            # A. Decode QR (Enhanced)
                            qr_link = decode_qr_from_image(image_bytes)
                            if qr_link: logging.info(f"  > QR Detected: {qr_link}")
                            
                            # B. AI Analysis
                            details = extract_event_details(image_bytes, qr_link)
                            
                            if details:
                                # C. CHECK IF IT IS ACTUALLY AN EVENT
                                if details.get("is_event") is False:
                                    logging.info("  > [AI Decision] Not a student event. Discarding.")
                                    break # Skip this attachment/email

                                # D. Save if it IS an event
                                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                                filename = f"{timestamp}_{msg.uid}.jpg"
                                local_path = os.path.join(DOWNLOAD_FOLDER, filename)
                                
                                with open(local_path, "wb") as f:
                                    f.write(image_bytes)
                                
                                # Clean up the JSON (remove the flag)
                                del details["is_event"]
                                
                                details['image_url'] = f"./{DOWNLOAD_FOLDER}/{filename}"
                                details['email_subject'] = msg.subject
                                details['email_date'] = str(msg.date)
                                
                                append_event_to_json(details)
                                logging.info(f"  > SAVED EVENT to {EVENTS_JSON_FILE}")
                                
                                save_processed_uid(msg.uid)
                                break 
                    
                    if not poster_found:
                        save_processed_uid(msg.uid)

            if email_count == 0:
                logging.warning("No emails found matching criteria in INBOX.")
            else:
                logging.info(f"Finished. Total emails scanned: {email_count}")

    except Exception as e:
        logging.error(f"Critical Error: {e}")

if __name__ == "__main__":
    process_emails()