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

class commentForm(BaseModel):
    dataComment:str
    sentiment:str
    username:str

class commentFormEdit(BaseModel):
    username:str
    textCommentEdit:str
    idComment:int
    createData:datetime
    
class commentFormDelete(BaseModel):
    username:str
    idComment:int
    createData:datetime

def checkUser(username,commentEdit,createData):
    dataComment = collectionCommentData.find_one({"created":createData})
    dataComment = collectionCommentData.find_one({"idComment": commentEdit,"created":createData})
    if dataComment:
        if dataComment.get("username") == username:
            return True
    return False

def delelteUpdate(username):
    commentData = list(collectionCommentData.find({}).sort([("created", -1)]).skip(0).limit(20))
    for data in commentData:
        data["edit"] = True if data.get("username") == username else False
    
    return json_util.dumps(commentData)

@apiComment.post('/add/Comment')
def addComment(dataForm:commentForm):
    commentId = collectionCommentData.count_documents({})
    dataInsert  = {"idComment":commentId,"comment" : dataForm.dataComment
    ,"sentiment":dataForm.sentiment,"username":dataForm.username
    ,"edit":False
    ,"edited":False,"created":datetime.utcnow()
    }
    collectionCommentData.insert_one(dataInsert)
    return {"message": "Comment successfully posted."}

@apiComment.get('/show/Comment')
def AllComment(username:str,pageComment:int,findData:str):
    commentData = list(collectionCommentData.find(json.loads(findData)).sort([("created", -1)]).skip((pageComment-1)*20).limit(pageComment*20))
    for data in commentData:
        data["edit"] = True if data.get("username") == username else False

    totalComment = collectionCommentData.count_documents(json.loads(findData))
    return json_util.dumps({"commentData":commentData,"count" : totalComment})

@apiComment.put('/comment/edit')
def editComment(dataForm:commentFormEdit):
    # เช็กผู้ใช้
    resultCheck = checkUser(dataForm.username,dataForm.idComment,dataForm.createData)
    if not resultCheck:
        abort(401, description="The username used does not match the account being operated.")
    
    sentiment = model_predict(dataForm.textCommentEdit)
    collectionCommentData.update_one(
    {"idComment": int(dataForm.idComment)},
    {"$set": {"comment": dataForm.textCommentEdit,"sentiment":sentiment
    ,"edited":True,"created":datetime.utcnow()}}
    )

    return delelteUpdate(dataForm.username)

@apiComment.delete('/comment/delete')
def deleteComment(data:commentFormDelete):
    username = data.username
    idComment = data.idComment
    createData = data.createData

    # เช็กผู้ใช้
    resultCheck = checkUser(username,idComment,createData)
    if not resultCheck:
        abort(401, description="The username used does not match the account being operated.")
    collectionCommentData.delete_one({"idComment": int(idComment)})

    return delelteUpdate(username)