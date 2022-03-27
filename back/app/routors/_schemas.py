from datetime import datetime
from pydantic import BaseModel, validator
from typing import Dict, List, Optional

class Detail(BaseModel):
    detail: str

# authentication
class Token(BaseModel):
    access_token: str
    token_type: str
 
class TokenData(BaseModel):
    username: Optional[str] = None

# user
class User_id(BaseModel):
    id: str

class User_base(BaseModel):
    username: str
    class Config():
        orm_mode=True

class User_request(User_base):
    password: Optional[str]
    
# reading
class Reading_base(BaseModel):
    timestamp: datetime
    data: Dict[str, float]
 
class Datetime(BaseModel):
    start: datetime
    end: datetime

    @validator('end')
    def start_must_less_than_end(cls, v, values):
        if v < values['start']:
            raise ValueError('Start must less than end')
        return v 

# group
class Group_Create(BaseModel):
    name: str  
    class Config():
        orm_mode=True  

class Group_Respones(Group_Create):
    class Sensor(BaseModel):
        id: int
        name: str
        unit: str
        class Config():
            orm_mode=True
    id: int
    sensor: List[Sensor]
    class Config():
        orm_mode=True

# sensor
class Sensor_Create(BaseModel):
    name: str
    unit: str
    group_id: int
    class Config():
        orm_mode=True

class Sensor_respones(BaseModel):
    class Group(BaseModel):
        id: int
        name: str  
        class Config():
            orm_mode=True
    id: int
    name: str
    unit: str
    group: Group
    class Config():
        orm_mode=True