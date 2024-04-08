# ใช้งาน env
import os
from dotenv import load_dotenv

from passlib.context import CryptContext

#mongoDB
import pymongo

from pydantic import BaseModel

# เพื่อแยกไฟล์ API ออกมาจาก server
from fastapi import APIRouter
apiRegister = APIRouter()

# เชื่อมต่อ MongoDB
load_dotenv()
mongodb = os.getenv("MONGODB")
client = pymongo.MongoClient(mongodb)
database = client["WebMovie"]
collectionUserData = database["UserData"]

pwContext = CryptContext(schemes=["bcrypt"], deprecated="auto")

# data_to_insert = {
#     "idUser": "0",
#     "username": "test",
#     "password": "test123",
#     "viewIndex": ""
# }

class account(BaseModel):
    userData: str
    passwordData: str

@apiRegister.post("/register")
async def register(dataAccount:account):
    hashedPassword = pwContext.hash(dataAccount.passwordData)

    accountId = collectionUserData.count_documents({})
    dataInsert  = {"idUser":accountId,"username" : dataAccount.userData,"password":hashedPassword,"viewTitle": ""}
    collectionUserData.insert_one(dataInsert)
    return {"message": "Registration successful."}

@apiRegister.get("/register/User")
async def checkUserforRegister(userData:str):
    #ถ้าเช็กออกมาว่าเป็น true คือผ่าน ไม่มี username ซ้ำ
    resultCheck = collectionUserData.count_documents({ "username":userData })<1
    return {"resultCheck": resultCheck}
