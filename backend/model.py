from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask_login import UserMixin

import os
from dotenv import load_dotenv

load_dotenv()

HOST = os.getenv('HOST')
USER = os.getenv('USER_NAME')
PASSWORD = os.getenv('PASSWORD')
DATABASE = os.getenv('DATABASE')
PORT = os.getenv('PORT')

# HOST='localhost'
# USER='user'
# PASSWORD ='supersecretpassword'
# DATABASE ='highscore'
# PORT = 3306

# mysql+pymysql://USERNAME:PASSWORD@HOST:PORT/DBNAME
print("Loading Model")
print(f"mysql+pymysql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}")
engine = create_engine(f"mysql+pymysql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}")



Session = sessionmaker(bind=engine)
session = Session()


Base = declarative_base()

class User (Base, UserMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    email = Column(String(120))
    password_hash = Column(String(128))
    high_scores = relationship('HighScore', back_populates='user_rel')
    def get_id(self):
        return str(self.id)

class HighScore (Base):
    __tablename__ = 'highscore'

    id = Column(Integer, primary_key=True)
    user = Column(Integer, ForeignKey('users.id'), nullable=False)
    date = Column(Date())
    score = Column(Integer())    
    user_rel = relationship('User', back_populates='high_scores')

try:
    connection = engine.connect()
    print("Connection successful!")
    connection.close()
except Exception as e:
    print("Connection failed:", e)

Base.metadata.create_all(engine)
 