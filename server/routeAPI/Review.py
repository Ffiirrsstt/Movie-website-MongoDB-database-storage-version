import pymongo
import json
from bson import json_util

import os
from dotenv import load_dotenv

from flask import abort
from fastapi import APIRouter
from datetime import datetime

from model import sentiment as model_predict

from pydantic import BaseModel

apiReview = APIRouter()


load_dotenv()
mongodb = os.getenv("MONGODB")
client = pymongo.MongoClient(mongodb)
database = client["WebMovie"]
collectionReviewData = database["ReviewData"]

class ReviewForm(BaseModel):
    dataReview:str
    sentiment:str
    username:str

class ReviewFormEdit(BaseModel):
    username:str
    textReviewEdit:str
    idReview:int
    createData:datetime
    
class ReviewFormDelete(BaseModel):
    username:str
    idReview:int
    createData:datetime

def checkUser(username,ReviewEdit,createData):
    dataReview = collectionReviewData.find_one({"created":createData})
    dataReview = collectionReviewData.find_one({"idReview": ReviewEdit,"created":createData})
    if dataReview:
        if dataReview.get("username") == username:
            return True
    return False

def delelteUpdate(username):
    ReviewData = list(collectionReviewData.find({}).sort([("created", -1)]).skip(0).limit(20))
    for data in ReviewData:
        data["edit"] = True if data.get("username") == username else False
    
    return json_util.dumps(ReviewData)

@apiReview.post('/add/Review')
def addReview(dataForm:ReviewForm):
    ReviewId = collectionReviewData.count_documents({})
    dataInsert  = {"idReview":ReviewId,"Review" : dataForm.dataReview
    ,"sentiment":dataForm.sentiment,"username":dataForm.username
    ,"edit":False
    ,"edited":False,"created":datetime.utcnow()
    }
    collectionReviewData.insert_one(dataInsert)
    return {"message": "Review successfully posted."}

@apiReview.get('/show/Review')
def AllReview(username:str,pageReview:int,findData:str):
    ReviewData = list(collectionReviewData.find(json.loads(findData)).sort([("created", -1)]).skip((pageReview-1)*20).limit(pageReview*20))
    for data in ReviewData:
        data["edit"] = True if data.get("username") == username else False

    totalReview = collectionReviewData.count_documents(json.loads(findData))
    return json_util.dumps({"ReviewData":ReviewData,"count" : totalReview})

@apiReview.put('/Review/edit')
def editReview(dataForm:ReviewFormEdit):
    # เช็กผู้ใช้
    resultCheck = checkUser(dataForm.username,dataForm.idReview,dataForm.createData)
    if not resultCheck:
        abort(401, description="The username used does not match the account being operated.")
    
    sentiment = model_predict(dataForm.textReviewEdit)
    collectionReviewData.update_one(
    {"idReview": int(dataForm.idReview)},
    {"$set": {"Review": dataForm.textReviewEdit,"sentiment":sentiment
    ,"edited":True,"created":datetime.utcnow()}}
    )

    return delelteUpdate(dataForm.username)

@apiReview.delete('/Review/delete')
def deleteReview(data:ReviewFormDelete):
    username = data.username
    idReview = data.idReview
    createData = data.createData

    # เช็กผู้ใช้
    resultCheck = checkUser(username,idReview,createData)
    if not resultCheck:
        abort(401, description="The username used does not match the account being operated.")
    collectionReviewData.delete_one({"idReview": int(idReview)})

    return delelteUpdate(username)