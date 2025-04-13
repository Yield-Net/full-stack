from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import strategies, auth, invest, dashboard, ai_router

app = FastAPI()
app.include_router(strategies.router)
app.include_router(auth.router)
app.include_router(invest.router)
app.include_router(dashboard.router)
app.include_router(ai_router.router)


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
