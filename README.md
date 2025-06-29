from pathlib import Path

# Define the README.md content
readme_content = """# 💸 P2P Digital Wallet – Full Stack Project

This is a full-stack peer-to-peer (P2P) digital wallet application. It allows users to:

- View their balance
- See their transaction history
- Send money securely to other users

The project uses a **Python Flask** backend with **GraphQL** and a **Next.js React** frontend styled with **Tamagui**, all structured in a monorepo.

---


---

## 🧪 Features

✅ View user's current balance (calculated from transactions)  
✅ Send money to other users (with proper validation)  
✅ View full transaction history  
✅ UI feedback for loading, success, and error states  
✅ Apollo GraphQL client and server integration  
✅ Responsive and clean UI built with Tamagui  

---

## 🚀 How to Run the Project Locally

You'll need **two terminal windows** to run both backend and frontend servers.

---

### 1️⃣ Backend Setup (Flask + GraphQL)

#### Requirements

- Python 3.11+
- Poetry

#### Steps

```bash
cd backend
poetry shell
poetry install
poetry run python -m backend.cli  # Seeds the database from users.csv

# Run the backend server
FLASK_APP=backend.app FLASK_ENV=development poetry run flask run --port 8000

GraphQL endpoint: http://localhost:8000/graphql

2️⃣ Frontend Setup (Next.js + Tamagui)
Requirements
Node.js 20+

Yarn

Steps

corepack enable
yarn install
yarn web

Frontend app: http://localhost:3000

⚙️ Technologies Used
Backend:

Python 3.11

Flask

Graphene (GraphQL)

SQLAlchemy

SQLite

Poetry

Frontend:

React

Next.js

Tamagui (UI toolkit)

Apollo Client (GraphQL)

Yarn Workspaces

Dev Tools:

Monorepo structure

Expo-compatible packages

Custom UI components in /packages/ui

Always show details

Copy
from pathlib import Path

# Define the README.md content
readme_content = """# 💸 P2P Digital Wallet – Full Stack Project

This is a full-stack peer-to-peer (P2P) digital wallet application. It allows users to:

- View their balance
- See their transaction history
- Send money securely to other users

The project uses a **Python Flask** backend with **GraphQL** and a **Next.js React** frontend styled with **Tamagui**, all structured in a monorepo.

---

## 📁 Project Structure

.
├── backend/ # Flask backend with GraphQL and SQLite
├── apps/
│ └── next/ # Frontend app using Next.js, Tamagui, Apollo
├── data/
│ └── users.csv # Seed data for users
├── packages/ # Shared UI and logic

yaml
Always show details

Copy

---


## 🧪 Features

✅ View user's current balance (calculated from transactions)  
✅ Send money to other users (with proper validation)  
✅ View full transaction history  
✅ UI feedback for loading, success, and error states  
✅ Apollo GraphQL client and server integration  
✅ Responsive and clean UI built with Tamagui  

---


## 🚀 How to Run the Project Locally

You'll need **two terminal windows** to run both backend and frontend servers.

---


### 1️⃣ Backend Setup (Flask + GraphQL)

#### Requirements

- Python 3.11+
- Poetry

#### Steps

```bash
cd backend
poetry shell
poetry install
poetry run python -m backend.cli  # Seeds the database from users.csv

# Run the backend server
FLASK_APP=backend.app FLASK_ENV=development poetry run flask run --port 8000
```
GraphQL endpoint: http://localhost:8000/graphql


2️⃣ Frontend Setup (Next.js + Tamagui)
Requirements
Node.js 20+

Yarn

Steps
```bash
Always show details

Copy
corepack enable
yarn install
yarn web
```

Frontend app: http://localhost:3000

⚙️ Technologies Used
Backend:

Python 3.11

Flask

Graphene (GraphQL)

SQLAlchemy

SQLite

Poetry

Frontend:

React

Next.js

Tamagui (UI toolkit)

Apollo Client (GraphQL)

Yarn Workspaces

Dev Tools:

Monorepo structure

Expo-compatible packages

Custom UI components in /packages/ui

🧠 Implementation Highlights
The user's currentBalance is calculated from:
initial_balance + incoming_transactions - outgoing_transactions

The sendMoney mutation:

Validates that both users exist

Checks for sufficient balance

Fails gracefully with a descriptive error message

Creates one atomic transaction

Pagination in transaction history using after cursor

Apollo Client handles cache updates and optimistic UI

💬 Notes
The app assumes user ID 1 is the "logged-in" user for simplicity.

The backend seed command (poetry run python -m backend.cli) must be run before using the app.

Tamagui components ensure a responsive and modern UI.

👩‍💻 Author
Built by Paula Magdy
Full-Stack Developer

Feel free to reach out for any feedback or questions!