import uvicorn, models
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routors import auth, user, group, timeseries, sensor
from database import pool

app = FastAPI(title="GSHP-API",
    version="0.0.1", tags=['api']
)
# https://fastapi.tiangolo.com/tutorial/static-files/?h=static
#app.mount("/static", StaticFiles(directory="static"), name="static")

#CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Create the database tables
models.Base.metadata.create_all(bind=pool)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(group.router)
app.include_router(sensor.router)
app.include_router(timeseries.router)
    
if __name__ == "__main__":
    uvicorn.run(app, port=8000, host="0.0.0.0")
