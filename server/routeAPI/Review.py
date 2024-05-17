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
    dataReviewComment:str
    sentiment:str
    username:str

class ReviewFormEdit(BaseModel):
    username:str
    textReviewEdit:str
    idReview:int
    createData:datetime
    typeReview:str
    
class ReviewFormDelete(BaseModel):
    username:str
    idReview:int
    createData:datetime
    typeReview:str

def checkUser(username,ReviewEdit,createData):
    dataReviewComment = collectionReviewData.find_one({"created":createData})
    dataReviewComment = collectionReviewData.find_one({"idReview": ReviewEdit,"created":createData})
    if dataReviewComment:
        if dataReviewComment.get("username") == username:
            return True
    return False

def delelteUpdate(username, typeReview):
    ReviewData = list(collectionReviewData.find(json.loads(typeReview)).sort([("created", -1)]).limit(3))
    for data in ReviewData:
        data["edit"] = True if data.get("username") == username else False
    
    print(ReviewData)
    return json_util.dumps(ReviewData)

@apiReview.post('/add/Review')
def addReview(dataForm:ReviewForm):
    ReviewId = collectionReviewData.count_documents({})
    dataInsert  = {"idReview":ReviewId,"Review" : dataForm.dataReviewComment
    ,"sentiment":dataForm.sentiment,"username":dataForm.username
    ,"edit":False
    ,"edited":False,"created":datetime.utcnow()
    }
    collectionReviewData.insert_one(dataInsert)
    return {"message": "Review successfully posted."}

@apiReview.get('/show/Review')
def AllReview(username:str,pageReview:int,findData:str):
    ReviewData = list(collectionReviewData.find(json.loads(findData)).sort([("created", -1)]).skip((pageReview-1)*3).limit(3))
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

    return delelteUpdate(dataForm.username,dataForm.typeReview)

@apiReview.delete('/Review/delete')
def deleteReview(data:ReviewFormDelete):
    username = data.username
    idReview = data.idReview
    createData = data.createData
    typeReview = data.typeReview
    # เช็กผู้ใช้
    resultCheck = checkUser(username,idReview,createData)
    if not resultCheck:
        abort(401, description="The username used does not match the account being operated.")
    collectionReviewData.delete_one({"idReview": int(idReview)})

    return delelteUpdate(username, typeReview)