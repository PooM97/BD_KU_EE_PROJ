from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float,\
    UniqueConstraint, PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from database import Session

Base = declarative_base()

# Dependency
def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, index=True, primary_key=True)
    username = Column(String, unique=True)
    password = Column(String, nullable=False)

class Group(Base):
    __tablename__ = "group"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(45), unique=True)   

    sensor = relationship('Sensor', back_populates="group", cascade='all,delete')

class Sensor(Base):
    __tablename__ = "sensor"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(45))
    unit = Column(String(45))
    group_id =  Column(Integer, ForeignKey('group.id'))

    group = relationship('Group', back_populates="sensor")
    reading = relationship('Reading', back_populates="sensor", cascade='all,delete')
    __table_args__ = (UniqueConstraint(group_id, name),{},)

class Reading(Base):
    __tablename__ = "reading"
    sensor_id = Column(Integer, ForeignKey('sensor.id'))
    timestamp = Column(DateTime, nullable=False)
    value = Column(Float, nullable=False)

    sensor = relationship('Sensor', back_populates="reading")
    __table_args__ = (PrimaryKeyConstraint(sensor_id, timestamp),{},)

    def __init__(self, sensor_id, timestamp, value):
        self.sensor_id = sensor_id
        self.timestamp = timestamp
        self.value = value