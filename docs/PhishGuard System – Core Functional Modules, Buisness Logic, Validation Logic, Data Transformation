# PhishGuard System – Core Functional Modules, Buisness Logic, Validation Logic, Data Transformation

## 1. Introduction

The PhishGuard system is designed using a **layered architecture**, ensuring clear separation of concerns, scalability, and maintainability.

The system is divided into three primary layers:

- **Presentation Layer (UI)** – Handles user interaction
- **Business Logic Layer** – Core processing and decision-making
- **Data / External Services Layer** – Database and third-party integrations (e.g., Gmail API)

The **Business Logic Layer** is the heart of the system. It processes emails, applies phishing detection techniques, assigns risk scores, and triggers mitigation actions.

---

## 2. Core Functional Modules (Business Logic Layer)

### 2.1 Authentication Module

**Purpose:**
Handles user identity and secure access.

**Responsibilities:**
- User registration and login
- Password hashing (e.g., bcrypt)
- Token-based authentication (JWT)
- Session validation

**Why it exists:**
Ensures that only authorized users can access sensitive features like email analysis.

---

### 2.2 Email Fetching Module

**Purpose:**
Retrieves user emails from external services.

**Responsibilities:**
- Connects to Gmail via OAuth 2.0
- Uses Gmail API to fetch emails
- Extracts:
  - Subject
  - Sender
  - Body content

**Why it exists:**
The system cannot analyze phishing emails without first retrieving them from the user's inbox.

---

### 2.3 Phishing Detection Module

**Purpose:**
Determines whether an email is malicious or safe.

**Techniques Used:**
- Machine Learning model (probability-based classification)
- Rule-based detection:
  - Suspicious keywords (e.g., "urgent", "verify now")
  - Malicious links
  - Sender spoofing

**Output:**
- Classification: Safe / Suspicious / Phishing

**Why it exists:**
This is the **core intelligence** of the system.

---

### 2.4 Risk Scoring Engine

**Purpose:**
Quantifies the level of threat.

**Output:**
- Risk Score (0–100)

**Factors considered:**
- ML prediction probability
- Suspicious keywords
- Malicious URLs
- Sender authenticity

**Example:**
- 0–30 → Safe
- 31–70 → Suspicious
- 71–100 → Phishing

**Why it exists:**
Provides a **measurable and interpretable threat level** instead of a simple yes/no decision.

---

### 2.5 Mitigation Module

**Purpose:**
Takes action based on detected threats.

**Actions:**
- Move phishing emails to spam
- Flag suspicious emails

**Why it exists:**
Detection alone is not enough — the system must **act** to protect the user.

---

### 2.6 Alert & Notification Module

**Purpose:**
Communicates threats to the user.

**Responsibilities:**
- Display warnings on UI
- Show:
  - Risk score
  - Email classification
- Improve user awareness

**Why it exists:**
Ensures users are informed and can make safe decisions.

---

## 3. Interaction with Presentation Layer

The **Presentation Layer (React UI)** interacts with the backend via API calls.

### Step-by-Step Flow:

1. User logs in via UI  
2. User clicks **"Scan Emails"**  
3. UI sends request to backend API  
4. Controller receives request  
5. Email Fetching Module retrieves emails  
6. Phishing Detection Module analyzes emails  
7. Risk Scoring Engine assigns scores  
8. Mitigation Module decides action  
9. Response sent back to UI  
10. UI displays:
    - Risk Score
    - Status (Safe / Suspicious / Phishing)

---

## 4. System Architecture Diagram

```mermaid
flowchart TD

A[Presentation Layer - React UI] --> B[API / Controller Layer]

B --> C[Business Logic Layer]

C --> C1[Authentication Module]
C --> C2[Email Fetching Module]
C --> C3[Phishing Detection Module]
C --> C4[Risk Scoring Engine]
C --> C5[Mitigation Module]
C --> C6[Notification Module]

C --> D[Data & External Services]

D --> D1[PostgreSQL Database]
D --> D2[Gmail API]
