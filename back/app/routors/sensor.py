import models
from . import _schemas
from typing import Union, List
from sqlalchemy.orm import Session
from .auth import get_current_user
from sqlalchemy.exc import SQLAlchemyError
from fastapi import status, APIRouter, Depends, HTTPException

router = APIRouter(prefix='/sensor', tags=['Sensor'], dependencies=[Depends(get_current_user)])

@router.get('/all', response_model=List[_schemas.Sensor_respones])
def get_all_sensor(db: Session = Depends(models.get_db)):
    return db.query(models.Sensor).all()

@router.get('/{id}', response_model=Union[_schemas.Sensor_respones, _schemas.Detail])
def get_sensor_by_id(id: int, db: Session = Depends(models.get_db)):
    sensor = db.query(models.Sensor).filter(models.Sensor.id == id).one_or_none()   
    if not sensor:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sensor could not be found in the database.")
    return sensor

@router.get('/group/{id}', response_model=Union[List[_schemas.Sensor_respones], _schemas.Detail])
def get_sensor_by_group(id: int, db: Session = Depends(models.get_db)):
    group: models.Group = db.query(models.Group).filter(models.Group.id == id).one_or_none()
    if not group:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Group could not be found in the database.")    
    return group.sensor

@router.post("/create", response_model=Union[List[_schemas.Sensor_respones], _schemas.Detail])
def create_sensor(req: List[_schemas.Sensor_Create], db: Session = Depends(models.get_db)):
    try:
        for sensorData in req:       
            new_sensor = models.Sensor(name=sensorData.name.lower(), unit=sensorData.unit, group_id=sensorData.group_id)
            db.add(new_sensor)           
        db.commit()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.__context__))
    return {'detail': 'Success create sensor'}

@router.put("/{id}/update", response_model=Union[_schemas.Sensor_respones, _schemas.Detail])
def update_sensor(id: int, req: _schemas.Sensor_Create, db: Session = Depends(models.get_db)):
    sensor = db.query(models.Sensor).filter(models.Sensor.id == id)
    if not sensor.one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sensor could not be found in the database.")
    try:
        sensor.update({'name': req.name.lower(), 'unit': req.unit, 'group_id': req.group_id})
        db.commit()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.__context__))
    return {'detail': 'Success update sensor'}

@router.delete("/{id}/drop", response_model=_schemas.Detail)
def drop_sensor(id: int, db: Session = Depends(models.get_db)):
    sensor = db.query(models.Sensor).filter(models.Sensor.id == id).one_or_none()
    if not sensor:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sensor could not be found in the database.")
    db.delete(sensor)
    db.commit()
    return {'detail': 'success drop sensor'}