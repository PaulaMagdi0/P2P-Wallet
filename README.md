# 💸 P2P Digital Wallet – Full Stack Project

This is a full-stack peer-to-peer (P2P) digital wallet application that allows users to:

- 💰 View their balance  
- 📜 See transaction history  
- 💸 Send money securely to other users

The project features a **Python Flask** backend with **GraphQL**, and a **Next.js React** frontend styled with **Tamagui**, all structured within a monorepo.

---

## 📁 Project Structure

```
.
├── backend/         # Flask backend with GraphQL and SQLite
├── apps/
│   └── next/        # Frontend app using Next.js, Tamagui, Apollo
├── data/
│   └── users.csv    # Seed data for users
├── packages/        # Shared UI and logic
```

---

## 🧪 Features

✅ View user's current balance (calculated from transactions)  
✅ Send money to other users (with validation)  
✅ View full transaction history  
✅ UI feedback for loading, success, and error states  
✅ Apollo GraphQL client and server integration  
✅ Responsive and clean UI built with Tamagui  

---

## 🚀 Getting Started Locally

You'll need **two terminal windows** to run both the backend and frontend servers.

---

### 🔧 Backend Setup (Flask + GraphQL)

#### Requirements

- Python `3.11+`  
- [Poetry](https://python-poetry.org/)

#### Steps

```bash
cd backend
poetry shell
poetry install

# Seed the database with initial users
poetry run python -m backend.cli

# Run the backend server
FLASK_APP=backend.app FLASK_ENV=development poetry run flask run --port 8000
```

➡️ **GraphQL Endpoint**: `http://localhost:8000/graphql`

---

### 🎨 Frontend Setup (Next.js + Tamagui)

#### Requirements

- Node.js `20+`  
- Yarn (via Corepack)

#### Steps

```bash
corepack enable
yarn install
yarn web
```

➡️ **Frontend App**: `http://localhost:3000`

---

## ⚙️ Technologies Used

### 🔙 Backend:

- Python 3.11  
- Flask  
- Graphene (GraphQL)  
- SQLAlchemy  
- SQLite  
- Poetry  

### 🔜 Frontend:

- React  
- Next.js  
- Tamagui (UI toolkit)  
- Apollo Client  
- Yarn Workspaces  

### 🧰 Dev Tools:

- Monorepo structure  
- Expo-compatible packages  
- Custom UI components in `/packages/ui`

---

## 🧠 Implementation Highlights

- 💡 `currentBalance` is calculated as:

  ```
  initial_balance + incoming_transactions - outgoing_transactions
  ```

- 🔁 `sendMoney` mutation:
  - Validates that both users exist
  - Checks for sufficient balance
  - Fails gracefully with a descriptive error
  - Creates one atomic transaction

- 📜 Transactions use **cursor-based pagination**  
- ⚡ Apollo Client handles:
  - Cache updates  
  - Optimistic UI  

---

## 💬 Notes

- For simplicity, the app assumes user ID `1` is the logged-in user.  
- You **must seed** the database by running:

  ```bash
  poetry run python -m backend.cli
  ```

- Tamagui ensures a **responsive and modern UI** across devices.

---

## 👩‍💻 Author

Built with ❤️ by **Paula Magdy**  
_Full-Stack Developer_

> Feel free to reach out for any feedback or questions!
