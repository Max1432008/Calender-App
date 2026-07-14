# models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, create_engine
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime, timezone

# Basis-Klasse für Tabellen
Base = declarative_base()

# Engine erstellen
engine = create_engine("sqlite:///blog.db", echo=True)

# --- Models ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    name = Column(String(50), unique=True, nullable=False)

    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    color_theme = Column(String(20), default="dark")
    profil_cover = Column(Text)

    # Beziehung zu Events

    events = relationship("Event", back_populates="user")


class Event(Base):
    __tablename__ = "Event"
    id = Column(Integer, primary_key=True)

    title = Column(String(200), nullable=False)
    place = Column(String(200), nullable=False)     #Standort wo das standfindet
    #* Speicherung der Zeit (mit berücksitigung von mehreren Tagen)
    hole_day = Column(String(200), nullable=False)
    day_start = Column(DateTime(200), nullable=False)
    day_end = Column(DateTime(200), nullable=False)
    time_start = Column(DateTime(200), nullable=False)
    time_end = Column(DateTime(200), nullable=False)
    #
    content = Column(Text, nullable=False)
    #

    calender_typ_id = Column(Integer, ForeignKey("Calender_typ.id"))
    calender_typ = relationship("Calender_typ", back_populates="events")

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="events")




class Calender_typ(Base):
    __tablename__ = "Calender_typ"
    id = Column(Integer, primary_key=True)
    titel = Column(String(200), nullable=False)
    color = Column(String(7), nullable=False)   # echte Spalte, z.B. "#4e8ef7"

    events = relationship("Event", back_populates="calender_typ")





# Session erstellen
Session = sessionmaker(bind=engine)
session = Session()

# Tabellen erstellen
Base.metadata.create_all(engine)

