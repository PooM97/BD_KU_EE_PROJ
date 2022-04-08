import models
from typing import Union, List
from . import _schemas
from sqlalchemy.orm import Session
from routors.auth import get_current_user
from sqlalchemy.exc import SQLAlchemyError
from fastapi import status, APIRouter, Depends, HTTPException

router = APIRouter(prefix='/group', tags=['Group'], dependencies=[Depends(get_current_user)])

@router.get('/all', response_model=List[_schemas.Group_Respones])
def get_all_group(db: Session = Depends(models.get_db)):
    groups = db.query(models.Group).all()    
    return groups

@router.get('/{id}', response_model=Union[_schemas.Group_Respones, _schemas.Detail])
def get_group(id: int, db: Session = Depends(models.get_db)):
    group = db.query(models.Group).filter(models.Group.id == id).one_or_none()
    if not group:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Group could not be found in the database.")
    return group

@router.post("/create", response_model=Union[_schemas.Group_Respones, _schemas.Detail])
def create_group(req: _schemas.Group_Create, db: Session = Depends(models.get_db)):
    new_group = models.Group(name=req.name)
    try:
        db.add(new_group)
        db.commit()
        db.refresh(new_group)
    except SQLAlchemyError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.__context__))
    return new_group

@router.put('/{id}/update', response_model=_schemas.Detail)
def update_group(id: int, req: _schemas.Group_Create, db: Session = Depends(models.get_db)):
    group = db.query(models.Group).filter(models.Group.id == id)
    if not group.one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Group could not be found in the database.")
    try:
        group.update({'name': req.name})
        db.commit()              
    except SQLAlchemyError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.__context__))    
    return {'detail': 'success update group'}

@router.delete("/{id}/drop", response_model=_schemas.Detail)
def drop_group(id: int, db: Session = Depends(models.get_db)):
    group = db.query(models.Group).filter(models.Group.id == id).one_or_none()
    if not group:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Group could not be found in the database.")
    db.delete(group)
    db.commit()
    return {'detail': 'Success drop group'}
