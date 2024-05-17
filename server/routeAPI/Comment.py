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

apiComment = APIRouter()

load_dotenv()
mongodb = os.getenv("MONGODB")
client = pymongo.MongoClient(mongodb)
database = client["WebMovie"]
collectionCommentData = database["CommentData"]

class CommentForm(BaseModel):
    dataReviewComment:str
    sentiment:str
    username:str
    idMV:int

class CommentFormEdit(BaseModel):
    username:str
    textCommentEdit:str
    idComment:int
    createData:datetime
    findData:str
    
class CommentFormDelete(BaseModel):
    username:str
    idComment:int
    createData:datetime
    findData:str

def checkUser(username,CommentEdit,createData):
    dataReviewComment = collectionCommentData.find_one({"created":createData})
    dataReviewComment = collectionCommentData.find_one({"idComment": CommentEdit,"created":createData})
    if dataReviewComment:
        if dataReviewComment.get("username") == username:
            return True
    return False

def delelteUpdate(username, findData):
    CommentData = list(collectionCommentData.find(json.loads(findData)).sort([("created", -1)]).limit(20))
    for data in CommentData:
        data["edit"] = True if data.get("username") == username else False
    
    return json_util.dumps(CommentData)

@apiComment.post('/add/Comment')
def addComment(dataForm:CommentForm):
    CommentId = collectionCommentData.count_documents({})
    dataInsert  = {"idMV":dataForm.idMV,"idComment":CommentId,"Comment" : dataForm.dataReviewComment
    ,"sentiment":dataForm.sentiment,"username":dataForm.username
    ,"edit":False
    ,"edited":False,"created":datetime.utcnow()
    }
    collectionCommentData.insert_one(dataInsert)
    return {"message": "Comment successfully posted."}

@apiComment.get('/show/Comment')
def AllComment(username:str,pageComment:int,findData:str):
    CommentData = list(collectionCommentData.find(json.loads(findData)).sort([("created", -1)]).skip((pageComment-1)*20).limit(pageComment*20))
    for data in CommentData:
        data["edit"] = True if data.get("username") == username else False

    totalComment = collectionCommentData.count_documents(json.loads(findData))
    return json_util.dumps({"CommentData":CommentData,"count" : totalComment})

@apiComment.put('/Comment/edit')
def editComment(dataForm:CommentFormEdit):
    # เช็กผู้ใช้
    resultCheck = checkUser(dataForm.username,dataForm.idComment,dataForm.createData)
    if not resultCheck:
        abort(401, description="The username used does not match the account being operated.")
    
    sentiment = model_predict(dataForm.textCommentEdit)
    collectionCommentData.update_one(
    {"idComment": int(dataForm.idComment),"created":dataForm.createData},
    {"$set": {"Comment": dataForm.textCommentEdit,"sentiment":sentiment
    ,"edited":True,"created":datetime.utcnow()}}
    )

    return delelteUpdate(dataForm.username,dataForm.findData)

@apiComment.delete('/Comment/delete')
def deleteComment(data:CommentFormDelete):
    username = data.username
    idComment = data.idComment
    createData = data.createData
    findData = data.findData

    # เช็กผู้ใช้
    resultCheck = checkUser(username,idComment,createData)
    if not resultCheck:
        abort(401, description="The username used does not match the account being operated.")
    collectionCommentData.delete_one({"idComment": int(idComment),"created":createData})

    return delelteUpdate(username, findData)