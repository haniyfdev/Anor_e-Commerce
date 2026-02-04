# 🌾 Anor — Agricultural Marketplace API

Anor — dehqonchilik va chorvachilik mahsulotlarini sotib olish va sotish uchun e-Commerce API.

---

## 🚀 Features

- JWT Authentication
- Role-based Access (Admin/User)
- Product CRUD
- Category CRUD (Admin only)
- Product Images Upload (max 5)
- Pagination & filtering
- PostgreSQL + SQLAlchemy + Alembic
- Pydantic v2 validation
- Uvicorn server

---

## 🛠 Tech Stack

| Layer      | Used                   |
|------------|------------------------|
| Backend    | FastAPI                |
| Auth       | JWT (`python-jose`)    |
| DB         | PostgreSQL             |
| ORM        | SQLAlchemy             |
| Migrations | Alembic                |
| Validation | Pydantic v2            |
| Password hashing | passlib (bcrypt) |

---

## 📦 Installation

```bash
git clone https://github.com/haniyf_dev/anor-backend.git
cd anor-backend
pip install -r requirements.txt
