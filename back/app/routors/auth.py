from datetime import timedelta
import models
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError
from sqlalchemy.orm import Session
from . import _schemas
from ._hashing import Hash

ACCESS_TOKEN_EXPIRE_DAYS = 1
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def credentials_exception(detail: str):
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )

def get_current_user(token: str=Depends(oauth2_scheme), db: Session=Depends(models.get_db)):
    try:
        username = Hash.de_token(token)
        if username is None:
            raise credentials_exception('Could not validate credentials')
        token_data = _schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception('Could not validate credentials')
    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if not user:
        raise credentials_exception('Could not validate credentials')    
    return user

router = APIRouter(prefix='/auth', tags=['Authentication'])

@router.post('/login', response_model=_schemas.Token)
def login(req: OAuth2PasswordRequestForm=Depends(), db: Session=Depends(models.get_db)):
    # get user from db.
    user: models.User = db.query(models.User).filter(models.User.username == req.username).first()
    # check credentia.
    if not user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail='Invalid Credential.')  
    if not Hash.vertify(req.password, user.password):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail='Invalid Credential.')
    access_token_expires = timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    access_token = Hash.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
