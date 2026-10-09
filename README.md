# Whistle-Drop Backend

An anonymous incident reporting system featuring unguessable cryptographic tracking codes, role-based moderator triage, and finite state machine (FSM) status controls.

---

## Features

- **Zero-PII Anonymous Intake:** Reports are filed without requiring user credentials, email, or identifying records.
- **Unguessable Identifiers:** Each report generates a crypto-random case identifier (`WD-XXXX-XXXX-XXXX`) used exclusively by the submitter to track status updates.
- **State Machine Workflow:** Enforces valid lifecycle transitions to avoid illegal status jumps:
## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Bearer token middleware for moderation routes

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster URI

### Installation

1. Clone the repository and install dependencies:
 ```bash
 git clone [https://github.com/](https://github.com/)<your-username>/whistle-drop-backend.git
 cd whistle-drop-backend
 npm install