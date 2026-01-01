import requests
from bs4 import BeautifulSoup
import json
import time
import re
import os
def get_safe_text(element):
    """Helper to safely extract text from an element."""
    if element:
        return element.get_text(strip=True)
    return "N/A"

def extract_section_content(soup, header_texts):
    """Finds a header and returns the text content immediately following it."""
    if isinstance(header_texts, str):
        header_texts = [header_texts]
        
    for text in header_texts:
        # Search for headers (h3, h4, h5, strong, b) containing the text
        header = soup.find(['h4', 'h3', 'h5', 'strong', 'b'], string=lambda t: t and text.lower() in t.lower())
        if header:
            content = []
            # Gather text from siblings until the next header
            for sibling in header.find_next_siblings():
                if sibling.name in ['h4', 'h3', 'h5', 'strong', 'b'] and sibling.get_text(strip=True):
                    break
                text_val = get_safe_text(sibling)
                if text_val:
                    content.append(text_val)
            full_text = "\n".join(content).strip()
            if full_text:
                return full_text
    return "N/A"

def scrape_event_details(event_url, headers):
    """Visits the event detail page to scrape specific info."""
    details = {k: "N/A" for k in ['image_url', 'about_event', 'departments', 'events_list', 
                                  'contact_details', 'important_dates', 'registration_fees', 
                                  'venue_address', 'google_map_link', 'register_url', 
                                  'location', 'category']}
    
    if not event_url:
        return details

    try:
        response = requests.get(event_url, headers=headers)
        if response.status_code != 200:
            return details
        
        soup = BeautifulSoup(response.content, 'html.parser')
        base_url = "https://www.knowafest.com"

        # 1. Image URL
        img_tag = soup.select_one('div.col-lg-10 img.img-fluid')
        if not img_tag:
            img_tag = soup.select_one('.container img[src*="uploads"]')
        
        if img_tag and img_tag.has_attr('src'):
            src = img_tag['src']
            details['image_url'] = base_url + src if not src.startswith('http') else src

        # 2. Main Content Sections
        details['about_event'] = extract_section_content(soup, ["About Event", "About"])
        details['events_list'] = extract_section_content(soup, ["Events", "Event Details"])
        details['contact_details'] = extract_section_content(soup, ["Contact Details", "Contact"])
        details['important_dates'] = extract_section_content(soup, ["Last Dates", "Important Dates", "Deadlines"])
        details['registration_fees'] = extract_section_content(soup, ["Registration Fees", "Fees"])
        details['venue_address'] = extract_section_content(soup, ["How to reach", "Address", "Venue", "Event Sponsors"])

        # 3. Departments
        dept_header = soup.find(lambda tag: tag.name in ['h4', 'h3'] and "Departments" in (tag.string or ""))
        if dept_header:
            dept_links = [get_safe_text(s) for s in dept_header.find_next_siblings('a')]
            details['departments'] = ", ".join(dept_links)

        # 4. Google Maps
        iframe = soup.find('iframe', src=re.compile(r'(google\.com/maps|maps\.google\.com)'))
        if iframe:
            details['google_map_link'] = iframe['src']
        else:
            map_link = soup.find('a', href=re.compile(r'(goo\.gl/maps|maps\.google\.com)'))
            if map_link:
                details['google_map_link'] = map_link['href']

        # 5. Sidebar Info
        sidebar = soup.select_one('.js-sticky-block')
        if sidebar:
            reg_btn = sidebar.find('a', class_='btn-primary')
            if reg_btn and reg_btn.has_attr('href'):
                details['register_url'] = reg_btn['href']
            
            for dt in sidebar.find_all('dt'):
                key = get_safe_text(dt).lower()
                dd = dt.find_next_sibling('dd')
                val = get_safe_text(dd)
                if "location" in key: details['location'] = val
                elif "category" in key: details['category'] = val

    except Exception as e:
        print(f"Error details: {e}")

    return details

def scrape_upcoming_fests():
    list_url = "https://www.knowafest.com/explore/upcomingfests"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    print("--- Fetching Listing Page ---")
    response = requests.get(list_url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # --- MAJOR FIX: Find rows with the 'onclick' attribute ---
    rows = soup.find_all('tr', attrs={'onclick': True})
    
    if not rows:
        print("No event rows found.")
        return

    print(f"Found {len(rows)} events. Processing...")

    # Use absolute path relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_file = os.path.join(script_dir, 'knowafest_complete_data.json')

    # --- Load Existing Data ---
    existing_events = []
    existing_urls = set()
    if os.path.exists(output_file):
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                existing_events = json.load(f)
                for e in existing_events:
                    if e.get('event_url'):
                        existing_urls.add(e['event_url'])
            print(f"Loaded {len(existing_events)} existing events.")
        except Exception as e:
            print(f"Error loading existing data: {e}")

    new_events = []
    
    for row in rows:
        event = {}
        cols = row.find_all('td')
        
        # 1. Basic Info
        event['fest_starts'] = get_safe_text(cols[0])
        event['fest_name'] = get_safe_text(cols[1]).replace("Read More", "").strip()
        event['fest_type'] = get_safe_text(cols[2])
        event['organiser'] = get_safe_text(cols[3])
        event['fest_ends'] = get_safe_text(cols[-1])

        # 2. Extract URL from 'onclick' attribute
        # Format is: window.open('events/2025/...')
        onclick_text = row['onclick']
        match = re.search(r"window\.open\('([^']+)'", onclick_text)
        
        if match:
            relative_url = match.group(1).strip()
            # Construct full URL
            if relative_url.startswith("http"):
                event['event_url'] = relative_url
            else:
                event['event_url'] = "https://www.knowafest.com/explore/" + relative_url
        else:
            event['event_url'] = None

        # --- DUPLICATE CHECK ---
        if event['event_url'] in existing_urls:
            print(f" [Skip] Already exists: {event['fest_name']}")
            continue
        
        # 3. Scrape Details
        if event['event_url']:
            print(f" > Scraping New Event: {event['fest_name']}")
            details = scrape_event_details(event['event_url'], headers)
            event.update(details)
            time.sleep(0.5)
            new_events.append(event)
            # Add to set to prevent duplicate in same run
            existing_urls.add(event['event_url'])
        else:
            print(f" ! No URL found for: {event['fest_name']}")

    if new_events:
        print(f"New events found: {len(new_events)}")
        # Combine and Save
        all_events = existing_events + new_events
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(all_events, f, indent=4, ensure_ascii=False)
        print(f"Updated database. Total events: {len(all_events)}")
    else:
        print("No new events found. Database is up to date.")

if __name__ == "__main__":
    scrape_upcoming_fests()