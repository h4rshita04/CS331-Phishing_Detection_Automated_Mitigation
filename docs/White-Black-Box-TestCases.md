

## White Box Testing Test Cases

### Test Case 1: Existing Email Check
- **Objective:** To verify that already scanned emails are not processed again.
- **Input:** Email with an existing `gmail_id` present in the database.
- **Execution Steps:**
  - Trigger the email scanning API.
  - Include an email that is already stored in the database.
- **Expected Result:** The system should skip processing the email and directly return stored details.
- **Actual Result:** The email was not reprocessed and existing data was returned.
- **Status:** Passed

---

### Test Case 2: Phishing Detection Condition
- **Objective:** To verify correct execution of phishing detection logic.
- **Input:** Email categorized as “phishing” by the risk engine.
- **Execution Steps:**
  - Scan an email identified as phishing.
  - Observe system behavior.
- **Expected Result:** The email should be moved to spam and a notification should be generated.
- **Actual Result:** Email was moved to spam and notification was successfully created.
- **Status:** Passed

---

### Test Case 3: Risk Score Threshold Condition
- **Objective:** To verify that emails with high risk scores are treated as phishing.
- **Input:** Email with `risk_score > 35`.
- **Execution Steps:**
  - Scan an email with a high risk score.
  - Check classification and action taken.
- **Expected Result:** The email should be treated as phishing and moved to spam.
- **Actual Result:** Email was correctly classified and moved to spam.
- **Status:** Passed

---

### Test Case 4: Notification Creation Logic
- **Objective:** To verify that notifications are generated for phishing emails.
- **Input:** Email identified as phishing.
- **Execution Steps:**
  - Scan a phishing email.
  - Check notification table in the database.
- **Expected Result:** A new notification entry should be created with subject, sender, and action.
- **Actual Result:** Notification entry was successfully inserted into the database.
- **Status:** Passed

---

### Test Case 5: Database Cleanup Logic
- **Objective:** To verify that only the latest 10 emails are retained in the database.
- **Input:** More than 10 emails in the inbox.
- **Execution Steps:**
  - Perform scanning of emails.
  - Check database contents after scan.
- **Expected Result:** Only the latest 10 emails should be present in the database.
- **Actual Result:** Older emails were removed and only the latest 10 emails remained.
- **Status:** Passed

---

## Black Box Testing Test Cases

### Test Case 1: Email Scan API Functionality
- **Objective:** To verify that the scan API retrieves emails correctly.
- **Input:** User initiates scan request from frontend.
- **Execution Steps:**
  - Click on “Scan Emails” button.
  - Observe displayed results.
- **Expected Result:** Latest emails should be fetched and displayed.
- **Actual Result:** Emails were successfully retrieved and displayed.
- **Status:** Passed

---

### Test Case 2: Phishing Email Handling
- **Objective:** To verify system behavior when a phishing email is detected.
- **Input:** Email containing phishing characteristics.
- **Execution Steps:**
  - Scan inbox containing phishing email.
  - Observe system response.
- **Expected Result:** Email should be moved to spam and notification generated.
- **Actual Result:** Email was moved to spam and notification appeared.
- **Status:** Passed

---

### Test Case 3: Notification Display in UI
- **Objective:** To verify that notifications are correctly displayed in the frontend.
- **Input:** Existing notifications in database.
- **Execution Steps:**
  - Click on notification bell icon.
  - Observe dropdown content.
- **Expected Result:** Notifications should be displayed with subject, sender, and action.
- **Actual Result:** Notifications were displayed correctly in the UI.
- **Status:** Passed

---

### Test Case 4: Mark Notification as Read
- **Objective:** To verify functionality of marking notifications as read.
- **Input:** Unread notification.
- **Execution Steps:**
  - Click on a notification.
  - Check unread count.
- **Expected Result:** Notification should be marked as read and unread count should decrease.
- **Actual Result:** Notification was marked as read and count was updated correctly.
- **Status:** Passed

---

### Test Case 5: Handling of Safe Emails
- **Objective:** To verify behavior for non-phishing emails.
- **Input:** Email categorized as “safe”.
- **Execution Steps:**
  - Scan a safe email.
  - Observe system response.
- **Expected Result:** Email should not be moved to spam and no notification should be generated.
- **Actual Result:** Email remained in inbox and no notification was created.
- **Status:** Passed
