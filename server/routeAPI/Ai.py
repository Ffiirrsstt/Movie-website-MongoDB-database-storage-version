# model
from model import sentiment as model_predict
from model import suggested as model_suggested

import pymongo

import os
from dotenv import load_dotenv

from fastapi import APIRouter

apiAI = APIRouter()

load_dotenv()
mongodb = os.getenv("MONGODB")
client = pymongo.MongoClient(mongodb)
database = client["WebMovie"]
collectionUserData = database["UserData"]

@apiAI.get('/sentiment')
def sentiment(text: str):
    return {'text': text, 'sentiment': model_predict(text)}

@apiAI.get('/suggested')
def suggested(username: str):
    user = collectionUserData.find_one({"username": username})
    viewUserMovie = user.get("viewTitle")
    if viewUserMovie:
        return {'username': username, 'view':viewUserMovie,"suggested":model_suggested(viewUserMovie) }
    return {'username': username, 'view':viewUserMovie,"suggested":False }
    