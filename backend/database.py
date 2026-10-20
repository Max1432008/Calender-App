

from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DB_PFAD = BASE_DIR / "blog.db"
print(DB_PFAD)


DATABASE_URL = f"sqlite:///{DB_PFAD}"
print("DATABASE_URL:", DATABASE_URL)