from models import Base, engine
Base.metadata.create_all(engine)
print("Datenbank erstellt!")