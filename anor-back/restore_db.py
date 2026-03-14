from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, engine  # Sening loyihangdagi engine
import json

# 1. Render bazasiga ulanish (Engine loyihangda .env dan olyapti)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def restore():
    # 2. Eski ma'lumotlaringni och (JSON formatida deb hisoblaymiz)
    try:
        with open("old_database_backup.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        
        print("📂 Fayl o'qildi. Yuklash boshlandi...")

        # 3. Ma'lumotlarni bazaga urish (Masalan: mahsulotlar)
        # BU YERDA SENING MODELING NOMI BO'LISHI KERAK (masalan Product)
        from models import Product, Category 

        for item in data['products']:
            new_prod = Product(**item)
            db.add(new_prod)
        
        db.commit()
        print("✅ Hamma narsa Render bazasiga ko'chirildi!")

    except Exception as e:
        print(f"❌ Xatolik: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    restore()