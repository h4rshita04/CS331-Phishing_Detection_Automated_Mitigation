# Part I — UI Choice & Justification

## Chosen UI: Direct Manipulation Interface

For our Phishing Detection System, we chose a **Direct Manipulation Interface** implemented
as a **React.js web application**.

---

## What is a Direct Manipulation Interface?

A Direct Manipulation Interface is a type of UI where users interact with **visible graphical
objects** directly — clicking buttons, navigating pages, and receiving immediate visual feedback
— rather than typing commands or selecting from text menus.

- Visual representation of all system objects and actions
- Physical actions (clicks, navigation) instead of typed syntax
- Immediate, visible feedback after every interaction

---

## Justification

### 1. Users Are Non-Technical

Our system targets **everyday email users** with no technical background. A direct manipulation
interface requires zero command knowledge — the entire workflow of registering, connecting Gmail,
scanning emails, and viewing results is handled through simple button clicks and page navigation.
Any user who can use Gmail or a modern website can immediately use our system without training.

### 2. Visual Communication of Risk

Phishing detection requires **instant, clear communication of threat levels**. Our interface
uses color-coded cards:

- **Red** — Phishing
- **Yellow** — Suspicious
- **Green** — Safe

Alongside numeric risk scores (0–100), a user can identify dangerous emails at a glance without
reading through text output. This level of visual clarity is only possible with a direct
manipulation interface.

### 3. Gmail OAuth Requires Direct Manipulation

Connecting Gmail uses **Google OAuth 2.0**, which is entirely browser-based. It requires
redirecting the user to Google's login page and automatically returning them to our app.
A direct manipulation interface handles this with a single button click. No other interface
type — CLI, menu-based, or form-based — can support browser redirects natively without
requiring the user to manually copy and paste authorization codes.

### 4. Multi-Step Non-Linear Workflow

Our system involves multiple steps across different functional areas:
```
Login / Register → Connect Gmail → Run Scan → View Alerts
```

Users need to move freely between these areas at any point. A direct manipulation interface
with page-based navigation and a persistent header supports this naturally. Menu-based or
command-line interfaces force rigid linear navigation which does not match how users actually
think and work.

### 5. User Trust

Our system asks users to grant access to their Gmail inbox — a sensitive action that requires
trust. A clean, professional graphical interface with a proper login page and Google OAuth
button builds that trust immediately. A terminal menu or command prompt would undermine
confidence in a security-sensitive application.

---
## Why Not Other Interface Types

| Interface Type | Reason for Rejection |
|---|---|
| **Command Language (CLI)** | Requires technical expertise, cannot handle OAuth redirects, displays raw text output only |
| **Menu-Based Interface** | Incompatible with OAuth flow, forces linear navigation, cannot display visual risk results |
| **Form-Based Interface** | Designed for data entry only, cannot display dynamic ML scan results visually |
| **Voice Interface** | Privacy risk for security data, cannot display email content, incompatible with OAuth |

---

## Conclusion

A **Direct Manipulation Interface** is the most appropriate UI for this system because :
1. Accessibility for non-technical users
2. Visual risk communication through color-coded results
3. Gmail OAuth compatibility via browser-based redirects
4. Flexible multi-step non-linear navigation
