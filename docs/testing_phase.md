# Test Plan

## 1. Objective of Testing

The objective of testing is to verify that the phishing detection system correctly scans emails, classifies them based on risk, performs appropriate mitigation actions (such as moving phishing emails to spam), and generates notifications for the user.

---

## 2. Scope

The following modules are included in testing:

- Email Scanning Module (Gmail API integration)
- Risk Classification Module (phishing detection)
- Mitigation Module (move to spam)
- Notification Module
- Database Operations (DAL functions)
- Frontend Notification Display

---

## 3. Types of Testing

### Unit Testing
Testing individual functions such as `save_email()` and `create_notification()`.

### Integration Testing
Testing interaction between modules (e.g., scanning → classification → database → notification).

### System Testing
Testing the complete workflow from scanning emails to displaying results in the UI.

### Functional Testing (Black Box)
Verifying correct output for given inputs without knowledge of internal code.

### White Box Testing
Testing internal logic such as conditions and loops in the scanning function.

---

## 4. Tools Used

- Backend: FastAPI (API testing via Swagger UI)
- Database: SQLite (`sentinelphish.db`)
- Frontend: React UI
- Testing Method: Manual testing using API calls and UI interaction

---

## 5. Entry Criteria

- Backend server is running successfully
- Database is created and migrated
- Gmail account is connected
- Risk engine is functional

---

## 6. Exit Criteria

- All test cases executed
- All critical functionalities working correctly
- No high-severity defects remain
- Notifications and mitigation actions verified

---

# Test Cases 

---

### Test Case 1

- **Test Case ID:** TC-01  
- **Description:** Login with invalid credentials  
- **Input Data:** Incorrect email/password  
- **Expected Output:** Error message displayed  
- **Actual Output:** Page refreshes without error message  
- **Status:** Fail  

---

### Test Case 2

- **Test Case ID:** TC-02  
- **Description:** Scan emails normally  
- **Input Data:** Click "Scan Email"  
- **Expected Output:** Emails fetched and displayed  
- **Actual Output:** Emails displayed correctly  
- **Status:** Pass  

---

### Test Case 3

- **Test Case ID:** TC-03  
- **Description:** Prevent multiple scan requests  
- **Input Data:** Rapidly click "Scan Email" button  
- **Expected Output:** Only one API request triggered  
- **Actual Output:** Multiple API requests triggered  
- **Status:** Fail  

---

### Test Case 4

- **Test Case ID:** TC-04  
- **Description:** Detect phishing email  
- **Input Data:** Phishing email content  
- **Expected Output:** Classified as phishing  
- **Actual Output:** Classified correctly  
- **Status:** Pass  

---

### Test Case 5

- **Test Case ID:** TC-05  
- **Description:** Move phishing email to spam  
- **Input Data:** Phishing email  
- **Expected Output:** Email moved to spam  
- **Actual Output:** Email moved successfully  
- **Status:** Pass  

---

### Test Case 6

- **Test Case ID:** TC-06  
- **Description:** Notification display update  
- **Input Data:** New phishing email scanned  
- **Expected Output:** Notification visible immediately  
- **Actual Output:** Notification not visible until refresh  
- **Status:** Fail  

---

### Test Case 7

- **Test Case ID:** TC-07  
- **Description:** Limit emails to 10  
- **Input Data:** More than 10 emails  
- **Expected Output:** Only 10 stored  
- **Actual Output:** Works correctly  
- **Status:** Pass  

---

### Test Case 8

- **Test Case ID:** TC-08  
- **Description:** Handle safe email  
- **Input Data:** Safe email  
- **Expected Output:** No action taken  
- **Actual Output:** No action performed  
- **Status:** Pass  

---
# Q2 (b): Defect Analysis

---

## Bug 1

- **Bug ID:** BUG-01  
- **Description:** Login page refreshes instead of showing error for invalid credentials  

- **Steps to Reproduce:**
  1. Enter incorrect login credentials  
  2. Submit form  

- **Expected Result:** Error message should be displayed  
- **Actual Result:** Page refreshes without error  

- **Severity:** High  

- **Suggested Fix:**  
  Handle login failure response properly and display error message in UI instead of refreshing page
  <p>
    <img width="1504" height="863" alt="Screenshot 2026-04-19 175433" src="https://github.com/user-attachments/assets/838dd4cb-7718-454b-8e17-ef151b10491a" />
   <img width="1503" height="861" alt="Screenshot 2026-04-19 175444" src="https://github.com/user-attachments/assets/4d74a1cc-3d87-4260-85a7-1d5c7235194d" />
</p>
  
---

## Bug 2

- **Bug ID:** BUG-02  
- **Description:** Multiple API calls triggered when scan button is clicked rapidly  

- **Steps to Reproduce:**
  1. Click "Scan Email" multiple times quickly  
  2. Observe API calls  

- **Expected Result:** Only one request should be processed  
- **Actual Result:** Multiple requests are sent  

- **Severity:** Medium  

- **Suggested Fix:**  
  Disable button after first click or implement debouncing
  
 <img width="1920" height="1080" alt="Screenshot 2026-04-19 171500" src="https://github.com/user-attachments/assets/1f68ba7a-23c8-4ef8-95be-ec275142afc9" />

---

## Bug 3

- **Bug ID:** BUG-03  
- **Description:** Notifications not updated in real-time  

- **Steps to Reproduce:**
  1. Scan emails  
  2. Generate phishing notification  
  3. Open notification panel  

- **Expected Result:** New notification should appear immediately  
- **Actual Result:** Requires page refresh  

- **Severity:** Medium  

- **Suggested Fix:**  
  Use polling (`setInterval`) or WebSocket-based updates to fetch notifications dynamically
 <img width="1920" height="1080" alt="Screenshot 2026-04-19 180221" src="https://github.com/user-attachments/assets/3fe1d8ec-d409-4338-ba64-f767e9e7c2e5" />

<img width="1920" height="1080" alt="Screenshot 2026-04-19 180234" src="https://github.com/user-attachments/assets/d7b68d88-3407-4879-972d-ddd2ae7b88f1" />


