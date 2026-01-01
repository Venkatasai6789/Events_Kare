import json
import os
import re
from datetime import datetime

def parse_fee(fee_text):
    if not fee_text or fee_text.strip() == "N/A" or fee_text.strip() == "":
        return "Check Link"
    
    fee_lower = fee_text.lower()
    
    # 1. Explicit Currency Formats (Rs. 500, INR 500, ₹500, $100, ₹2,500)
    # Modified to accept commas in the number part
    match_currency = re.search(r'(?:Rs\.?|INR|₹|\$)\s*([\d,]+)', fee_text, re.IGNORECASE)
    if match_currency:
        return f"₹{match_currency.group(1)}"

    # 2. Suffix Style (500/-)
    match_suffix = re.search(r'(\d+)/-', fee_text)
    if match_suffix:
        return f"₹{match_suffix.group(1)}"

    # 3. Contextual Numbers (e.g., "150 for online", "Fee 200")
    # Looking for 3-4 digit numbers that are likely prices
    match_context = re.search(r'\b(\d{2,4})\b', fee_text)
    if match_context:
        # Simple heuristic: if we find a number, assume it's the price if no other format matched
        # But avoid years like 2026
        amt = int(match_context.group(1))
        if amt < 2025: # simplistic filter for years
            return f"₹{amt}"

    # 4. Check for Free patterns
    if 'free' in fee_lower or 'no registration fee' in fee_lower:
        return "Free"
        
    return "Paid" # Fallback

def parse_date(date_str):
    # Formats: "02 Jan 2026" -> "2026-01-02"
    if not date_str or date_str == "N/A":
        return ""
    try:
        dt = datetime.strptime(date_str, "%d %b %Y")
        return dt.strftime("%Y-%m-%d")
    except ValueError:
        return date_str

def main():
    # Paths relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Assuming script is in backend/ and repo root is parent
    root_dir = os.path.dirname(script_dir)
    
    input_path = os.path.join(script_dir, "knowafest_complete_data.json")
    output_path = os.path.join(root_dir, "frontend", "data", "external_events.json")

    print(f"Reading from: {input_path}")
    
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Input file not found!")
        return

    transformed_events = []
    
    for idx, item in enumerate(data):
        # Create ID: ext-{timestamp}-{index} or just ext-{index}
        # Using index for stability
        event_id = f"ext-{idx+1}"
        
        parsed_fee = parse_fee(item.get("registration_fees", ""))
        
            
        # Data Cleaning & Extraction
        description = item.get("about_event", "")
        # Remove "Events" prefix if it exists (common in this scraper data)
        if description.startswith("Events"):
            description = description[6:].strip()
            
        # Extract Departments
        departments = []
        dept_str = item.get("departments", "")
        if dept_str:
            # Split by comma, strip whitespace, and filter empty
            departments = [d.strip() for d in dept_str.split(',') if d.strip()]
            
        # Extract Contact Info
        contact_info = item.get("contact_details", "")
        if not contact_info or contact_info == "N/A":
             contact_info = "Please check the official registration link for contact details."
        
        # Extract Venue
        venue_address = item.get("venue_address", "")
        
        # Attempt to find timings in description or contact info
        start_time = "09:00"
        end_time = "17:00"
        
        # Regex to look for time patterns like "9.30 AM to 4.30 PM"
        time_match = re.search(r'(\d{1,2}(?::|\.)\d{2}\s*(?:AM|PM))\s*(?:to|-)\s*(\d{1,2}(?::|\.)\d{2}\s*(?:AM|PM))', description + " " + contact_info, re.IGNORECASE)
        if time_match:
            start_time = time_match.group(1).replace(".", ":")
            end_time = time_match.group(2).replace(".", ":")

        # Extract Google Map Link
        google_map_link = item.get("google_map_link", "")
        if not google_map_link or google_map_link == "N/A":
            # Try to find in venue address
            # Expanded regex to catch goo.gl/maps as well
            map_match = re.search(r'(https?://(?:maps\.app\.goo\.gl|www\.google\.com/maps|goo\.gl/maps)\S+)', venue_address)
            if map_match:
                google_map_link = map_match.group(1)
                # Remove the link from the address text
                venue_address = venue_address.replace(google_map_link, "")
                # Remove common prefixes like "Google Map link:"
                venue_address = re.sub(r'Google Map link:?', '', venue_address, flags=re.IGNORECASE)
                venue_address = venue_address.strip()
            else:
                google_map_link = ""
        
        # Clean up any leftover messy characters or newlines in venue
        venue_address = re.sub(r'\s+', ' ', venue_address).strip()
        
        # Extract Deadline (Important Dates)
        deadline = item.get("important_dates", "")
        if deadline == "N/A":
            deadline = ""

        event = {
            "id": event_id,
            "title": item.get("fest_name", "Untitled Event"),
            "subtitle": item.get("fest_type", ""),
            "startDate": parse_date(item.get("fest_starts", "")),
            "endDate": parse_date(item.get("fest_ends", "")),
            "startTime": start_time,
            "endTime": end_time,
            "location": item.get("location") or item.get("venue_address", "Unknown Location"),
            "venueAddress": venue_address,
            "category": item.get("category", "Workshop"),
            "type": "External",
            "image": item.get("image_url", ""),
            "organizer": item.get("organiser", "").replace("\n", ", ").replace(",,", ",").strip(),
            "description": description,
            "departments": departments,
            "contactInfo": contact_info,
            "registrationFees": item.get("registration_fees", "N/A"), # Full text
            "feeShort": parsed_fee,
            "feeDetails": item.get("registration_fees", ""), # Duplicate for explicit use in details
            "deadline": deadline,
            "venueMapUrl": google_map_link,
            "registrationUrl": item.get("register_url", "#"),
            "registered": 0,
            "maxCapacity": 100,
            "status": "Upcoming",
            "seatsRemaining": 100
        }
        
        transformed_events.append(event)

    # Ensure output dir exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(transformed_events, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully wrote {len(transformed_events)} events to {output_path}")

if __name__ == "__main__":
    main()
