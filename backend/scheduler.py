import logging
import os
import sys
import time
import subprocess
from datetime import datetime

# Configure logging
log_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scheduler.log')
logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def run_job():
    logging.info("--- Starting Scheduled Scraping Job ---")
    print(f"[{datetime.now()}] --- Starting Scheduled Scraping Job ---")
    script_dir = os.path.dirname(os.path.abspath(__file__))
    scraper_path = os.path.join(script_dir, 'upcoming_scraper.py')
    bridge_path = os.path.join(script_dir, 'knowafest_frontend_bridge.py')

    try:
        # Run Scraper
        logging.info("Running Scraper...")
        result = subprocess.run([sys.executable, scraper_path], capture_output=True, text=True)
        logging.info(f"Scraper Output: {result.stdout}")
        if result.stderr:
            logging.error(f"Scraper Error: {result.stderr}")
        
        # Run Bridge
        logging.info("Running Frontend Bridge...")
        result = subprocess.run([sys.executable, bridge_path], capture_output=True, text=True)
        logging.info(f"Bridge Output: {result.stdout}")
        if result.stderr:
            logging.error(f"Bridge Error: {result.stderr}")
            
        logging.info("--- Job Completed ---")
        
    except Exception as e:
        logging.error(f"Job failed exception: {e}")

def main():
    logging.info("Scheduler started. Waiting for 18:00 daily.")
    print(f"[{datetime.now()}] Scheduler started. Waiting for 18:00 daily.")
    
    last_run_date = None
    
    while True:
        now = datetime.now()
        
        # Check if it's 18:00 (6 PM)
        if now.hour == 18 and now.minute == 0:
             # Ensure we haven't run already today
             if last_run_date != now.date():
                run_job()
                last_run_date = now.date()
                # Sleep long enough to pass the minute
                time.sleep(60)
        
        # Check every 30 seconds
        time.sleep(30)

if __name__ == "__main__":
    # Allow running immediately for testing
    if len(sys.argv) > 1 and sys.argv[1] == 'test':
        print("Running in TEST mode (immediate execution)...")
        run_job()
    else:
        main()
