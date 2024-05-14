# Web Server
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pymon

# ใช้งาน API (ไฟล์ที่เราเขียนแยกออกไป)
from routeAPI.Movies import apiMovies
from routeAPI.Ai import apiAI
from routeAPI.Register import apiRegister
from routeAPI.Login import apiLogin
from routeAPI.Review import apiReview
from routeAPI.Comment import apiComment

# create app
app = FastAPI()
# alow cross origin all origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(apiMovies)
app.include_router(apiAI)
app.include_router(apiRegister)
app.include_router(apiLogin)
app.include_router(apiReview)
app.include_router(apiComment)

# start server
if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)