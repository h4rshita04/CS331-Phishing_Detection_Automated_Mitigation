from app.models.email import Email


# Check if email already exists (IMPORTANT: no re-scan)
def get_email_by_gmail_id(db, gmail_id):
    return db.query(Email).filter(Email.gmail_id == gmail_id).first()


# Save email after processing
def save_email(db, email_data):
    email = Email(**email_data)
    db.add(email)
    db.commit()
    db.refresh(email)
    return email

def delete_emails_not_in_list(db, valid_ids):
    from app.models.email import Email
    db.query(Email).filter(~Email.gmail_id.in_(valid_ids)).delete(synchronize_session=False)
    db.commit()