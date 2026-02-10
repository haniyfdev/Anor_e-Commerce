import psycopg2

# Render'dagi External Database URL
DB_URL = "postgresql://haniyfdev:490Zxjr55U4jgbu0RtjgXeSV5ppJhTt5@dpg-d65cdf56ubrc7390vfcg-a.frankfurt-postgres.render.com/anor_db"

def fix_all_images():
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        print("🚀 Ma'lumotlar bazasini yangilash boshlandi...")

        # 1. Mahsulot rasmlarini to'g'irlash
        cur.execute("""
            UPDATE product_images 
            SET image_url = REPLACE(image_url, 'https://anor-e-commerce.onrender.com', 'https://anor-e-commerce.onrender.com')
            WHERE image_url LIKE 'https://anor-e-commerce.onrender.com%';
        """)
        print(f"✅ Product Images: {cur.rowcount} ta link yangilandi.")

        # 2. Avatar rasmlarini to'g'irlash
        cur.execute("""
            UPDATE avatar_images 
            SET image_url = REPLACE(image_url, 'https://anor-e-commerce.onrender.com', 'https://anor-e-commerce.onrender.com')
            WHERE image_url LIKE 'https://anor-e-commerce.onrender.com%';
        """)
        print(f"✅ Avatar Images: {cur.rowcount} ta link yangilandi.")

        conn.commit()
        print("🏁 G'alaba! Endi hamma rasmlar internetda ko'rinadi.")

    except Exception as e:
        print(f"❌ Xatolik: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    fix_all_images()