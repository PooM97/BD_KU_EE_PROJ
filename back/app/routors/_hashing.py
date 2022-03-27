import os
from passlib.context import CryptContext
from jose import jwt
from typing import Optional
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
SCHEMES = os.getenv("CRYPT_SCHEMES")
pwd_context = CryptContext(schemes=[SCHEMES], deprecated="auto")

class Hash():
    @staticmethod
    def bcryte(password: str):
        return pwd_context.hash(password)

    @staticmethod
    def vertify(plain_password:str, hashed_password:str):
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def de_token(token: str):
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        body: str = payload.get("sub")
        return body