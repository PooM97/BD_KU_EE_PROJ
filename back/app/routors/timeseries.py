import models
import pandas as pd
from . import _schemas
from database import pool
from typing import Dict
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import status, APIRouter, Depends, HTTPException

router = APIRouter(prefix='/ts', tags=['Timeseries'])

@router.post("/post", response_model= _schemas.Detail)
def post_sensor_data(req: _schemas.Reading_base, db: Session = Depends(models.get_db)):
    try:
        for sensor_id in req.data:
            new_data = models.Reading(sensor_id, req.timestamp, req.data[sensor_id])
            db.add(new_data)
        db.commit()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.__context__))
    return {'detail': 'Success in post data'}

@router.post("/period/sensor/{sensor_id}", response_model=Dict)
def get_data_by_sensor(sensor_id:int, req: _schemas.Datetime, order='DESC', db: Session = Depends(models.get_db)):
    sensor: models.Sensor = db.query(models.Sensor).filter(models.Sensor.id == sensor_id).one_or_none()
    if not sensor:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sensor could not be found in the database.")  
    query = f"""
        SELECT reading.timestamp AS timestamp, reading.value AS {sensor.name}
        FROM reading
        WHERE reading.sensor_id = '{sensor_id}' AND reading.timestamp >= '{req.start}' AND reading.timestamp <= '{req.end}'
        ORDER BY timestamp {order};
        """
    df = pd.read_sql(query, pool)
    return df.to_dict()

@router.get("/limit/sensor/{sensor_id}", response_model=Dict)
def get_data_by_sensor_limit(sensor_id: int, limit: int, db: Session = Depends(models.get_db)):
    sensor: models.Sensor = db.query(models.Sensor).filter(models.Sensor.id == sensor_id).one_or_none()
    if not sensor:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sensor could not be found in the database.")
    query = f"""
        SELECT reading.timestamp AS timestamp, reading.value AS {sensor.name} 
        FROM reading
        WHERE reading.sensor_id = '{sensor_id}'
        ORDER BY timestamp DESC
        LIMIT {limit};
        """
    df = pd.read_sql(query, pool)        
    return df.to_dict()

@router.post("/period/group/{group_id}", response_model=Dict)
def get_data_by_group(group_id: int, req: _schemas.Datetime, order='DESC', db: Session = Depends(models.get_db)): 
    group: models.Group = db.query(models.Group).filter(models.Group.id == group_id).one_or_none()
    if not group:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Group could not be found in the database.")  
    for sensor in group.sensor:        
        query = f"""
            SELECT reading.timestamp AS timestamp, reading.value AS {sensor.name}
            FROM reading
            WHERE reading.sensor_id = '{sensor.id}' AND reading.timestamp >= '{req.start}' AND reading.timestamp <= '{req.end}'
            ORDER BY timestamp {order}; 
            """
        try:
            df = df.join(pd.read_sql(query, pool).set_index('timestamp'), on='timestamp')
        except:
            df = pd.read_sql(query, pool)
    return df.to_dict()

@router.get("/limit/group/{group_id}", response_model=Dict)
def get_data_by_group(group_id: int, limit, db: Session = Depends(models.get_db)):
    group: models.Group = db.query(models.Group).filter(models.Group.name == group_id).one_or_none()
    if not group:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Group could not be found in the database.")  
    for sensor in group.sensor:        
        query = f"""
            SELECT reading.timestamp AS timestamp, reading.value AS {sensor.name}
            FROM reading
            WHERE reading.sensor_id = '{sensor.id}'
            ORDER BY timestamp DESC
            LIMIT {limit};
            """
        try:
            df = df.join(pd.read_sql(query, pool).set_index('timestamp'), on='timestamp', )
        except:
            df = pd.read_sql(query, pool)   
    return df.to_dict()