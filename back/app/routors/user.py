import models
from . import _schemas
from ._hashing import Hash
from sqlalchemy.orm import Session
from .auth import get_current_user
from sqlalchemy.exc import SQLAlchemyError
from fastapi import status, APIRouter, Depends, HTTPException
from typing import List

router = APIRouter(prefix='/user', tags=['User'], dependencies=[Depends(get_current_user)])

@router.get('/all', response_model=List[_schemas.User_base])
def get_all_users(
    db: Session = Depends(models.get_db)
):
    user = db.query(models.User).filter().all()
    return user

@router.get('/me', response_model=_schemas.User_base)
def me(
    db: Session = Depends(models.get_db),
    current_user: _schemas.User_request = Depends(get_current_user),
):
    user = db.query(models.User).filter(models.User.username == current_user.username).one()    
    return user

@router.post('/create', response_model=_schemas.User_base)
def create(
    req: _schemas.User_request, 
    db: Session = Depends(models.get_db)    
):
    new_user = models.User(
                username=req.username,
                password=Hash.bcryte(req.password)          
            )
    try:
        db.add(new_user)
        db.commit()    
        db.refresh(new_user)    
    except SQLAlchemyError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e.__context__))
    return new_user
    
@router.put('/update', response_model=_schemas.Detail)
def update(
    req: _schemas.User_request,
    db: Session = Depends(models.get_db),
    current_user: _schemas.User_id = Depends(get_current_user)
):
    user = db.query(models.User).filter(models.User.id == current_user.id)
    try:
        user.update({'username': req.username, 'password': Hash.bcryte(req.password)})
    except SQLAlchemyError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e.__context__))
    except:
        user.update({'username': req.username})
    db.commit()
    return {'detail': 'success update user'}

@router.delete('/delete', response_model=_schemas.Detail)
def delete(
    req: _schemas.User_base,    
    db: Session = Depends(models.get_db)
):
    user = db.query(models.User).filter(models.User.username == req.username).one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username could not be found in the database.")
    db.delete(user)
    db.commit()
    return {'detail': 'success delete user'}