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
## **Q2(a): Test Case Execution and Results**

The following test cases were executed for the Email Phishing Detection and Automated Mitigation system. The results, along with supporting evidence (screenshots), are documented below.

---

### **Test Case 1: Login with Invalid Credentials**

- **Test Case ID:** TC-01  
- **Status:** Fail  

**Evidence:**  
<p>
    <img width="1504" height="863" alt="Screenshot 2026-04-19 175433" src="https://github.com/user-attachments/assets/838dd4cb-7718-454b-8e17-ef151b10491a" />
   <img width="1503" height="861" alt="Screenshot 2026-04-19 175444" src="https://github.com/user-attachments/assets/4d74a1cc-3d87-4260-85a7-1d5c7235194d" />
</p>


**Observation:**  
The system refreshes the login page without displaying any error message when incorrect credentials are entered.

---

### **Test Case 2: Scan Emails Normally**

- **Test Case ID:** TC-02  
- **Status:** Pass  

**Evidence:**  
<p>
    <img width="1511" height="930" alt="WhatsApp Image 2026-04-19 at 6 08 18 PM (1)" src="https://github.com/user-attachments/assets/83c7ae12-0329-44ab-82ad-c75261860d94" />
    <img width="1600" height="900" alt="WhatsApp Image 2026-04-19 at 6 08 18 PM (4)" src="https://github.com/user-attachments/assets/7f9d8425-6476-4457-97a7-44826fdf96db" />
  
</p>

**Observation:**  
Emails are successfully fetched and displayed when the "Scan Email" button is clicked.

---

### **Test Case 3: Prevent Multiple Scan Requests**

- **Test Case ID:** TC-03  
- **Status:** Fail  

**Evidence:**  
<p>
  <img width="1600" height="900" alt="WhatsApp Image 2026-04-19 at 6 08 17 PM (1)" src="https://github.com/user-attachments/assets/07b883f6-2011-452c-aa05-4cc9a7e3179a" />
</p>


**Observation:**  
Multiple API requests are triggered when the "Scan Email" button is clicked repeatedly in quick succession, indicating lack of request control.

---

### **Test Case 4: Detect Phishing Email**

- **Test Case ID:** TC-04  
- **Status:** Pass  

**Evidence:**  
<p>
<img width="1600" height="900" alt="WhatsApp Image 2026-04-19 at 6 08 18 PM (4)" src="https://github.com/user-attachments/assets/7f9d8425-6476-4457-97a7-44826fdf96db" />
  
</p>

**Observation:**  
The system correctly identifies and classifies phishing emails.

---

### **Test Case 5: Move Phishing Email to Spam**

- **Test Case ID:** TC-05  
- **Status:** Pass  

**Evidence:**  
<p>
<img width="1687" height="781" alt="Screenshot 2026-04-19 190254" src="https://github.com/user-attachments/assets/f7e8f829-604b-4e15-bd53-c8f4d6cc7759" />
  
</p>

**Observation:**  
Detected phishing emails are successfully moved to the spam folder.

---

### **Test Case 6: Notification Display Update**

- **Test Case ID:** TC-06  
- **Status:** Fail  

**Evidence:**  
<p>
<img width="1600" height="900" alt="WhatsApp Image 2026-04-19 at 6 08 18 PM (5)" src="https://github.com/user-attachments/assets/0ff65ecc-81d0-4e7a-9a90-d3f84a36af0c" /> 
</p>

**Observation:**  
New phishing notifications are not displayed in real-time and require a manual refresh to become visible.

---

### **Test Case 7: Limit Emails to 10**

- **Test Case ID:** TC-07  
- **Status:** Pass  

**Evidence:**  
<p>
<img width="1103" height="914" alt="WhatsApp Image 2026-04-19 at 6 08 18 PM (3)" src="https://github.com/user-attachments/assets/f70ff3a3-2bbf-4a9c-9884-b7c3656c72df" />

</p>

**Observation:**  
The system correctly limits the number of stored/displayed emails to a maximum of 10.

---

### **Test Case 8: Handle Safe Email**

- **Test Case ID:** TC-08  
- **Status:** Pass  

**Evidence:** 
<p>
<img width="1103" height="914" alt="WhatsApp Image 2026-04-19 at 6 08 18 PM (3)" src="https://github.com/user-attachments/assets/f70ff3a3-2bbf-4a9c-9884-b7c3656c72df" />

</p>

**Observation:**  
Safe emails are handled correctly and no unnecessary actions are performed.

---

## **Summary of Results**

- **Total Test Cases Executed:** 8  
- **Passed:** 5  
- **Failed:** 3  

The failed test cases highlight issues related to login error handling, multiple API request triggering, and delayed notification updates, which should be addressed to improve system reliability and user experience.
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


