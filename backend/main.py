from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, strategies

app = FastAPI()
app.include_router(users.router)
app.include_router(strategies.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/ping")
def ping():
    return {"ping": "pong"}
