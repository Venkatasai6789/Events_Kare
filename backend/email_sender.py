from __future__ import annotations

import os
import smtplib
from email.message import EmailMessage
from typing import Optional


def send_email(
    *,
    to_email: str,
    subject: str,
    body_text: str,
    body_html: Optional[str] = None,
) -> dict:
    """Send an email (best-effort).

    Returns:
        {"sent": bool, "provider": "smtp"|"dummy", "error": str|None}

    Notes:
    - If SMTP config is missing, this becomes a dummy sender that logs to stdout.
    - SMTP defaults are compatible with Gmail (TLS on 587).
    """

    smtp_host = os.getenv("EMAIL_SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("EMAIL_SMTP_PORT", "587"))
    smtp_user = os.getenv("EMAIL_SMTP_USER") or os.getenv("EMAIL_USER")
    smtp_pass = os.getenv("EMAIL_SMTP_PASS") or os.getenv("EMAIL_PASS")
    mail_from = os.getenv("EMAIL_FROM") or smtp_user

    if not (smtp_user and smtp_pass and mail_from and smtp_host and smtp_port):
        # Dummy mode: still satisfies "trigger email" for dev/demo without secrets.
        print("[email_sender] Dummy mode (missing SMTP config)")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(body_text)
        if body_html:
            print("--- HTML ---")
            print(body_html)
        return {"sent": False, "provider": "dummy", "error": "SMTP not configured"}

    msg = EmailMessage()
    msg["From"] = mail_from
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body_text)
    if body_html:
        msg.add_alternative(body_html, subtype="html")

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        return {"sent": True, "provider": "smtp", "error": None}
    except Exception as exc:
        # Don't raise; calling routes should not crash on email failure.
        return {"sent": False, "provider": "smtp", "error": str(exc)}
