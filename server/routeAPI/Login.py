from flask import abort
from fastapi import Depends, FastAPI, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt
import os
from dotenv import load_dotenv

import pymongo
from fastapi import APIRouter
apiLogin = APIRouter()

load_dotenv()
mongodb = os.getenv("MONGODB")
client = pymongo.MongoClient(mongodb)
database = client["WebMovie"]
collectionUserData = database["UserData"]

# เก็บรหัสผ่านเป็นแบบเข้ารหัส
pwdContext = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2Scheme = OAuth2PasswordBearer(tokenUrl="token")

# สร้าง JWT token
def createAccessToken(data: dict, expiresDelta: timedelta):
    toEncode = data.copy()
    expire = datetime.utcnow() + expiresDelta
    toEncode.update({"exp": expire})
    encodedJwt = jwt.encode(toEncode, os.environ["SECRETS_KEY"], algorithm="HS256")
    return encodedJwt

@apiLogin.post("/login")
async def loginAccessToken(formData: OAuth2PasswordRequestForm = Depends()):
    user =  collectionUserData.find_one({"username": formData.username})
    if not user or not pwdContext.verify(formData.password, user["password"]):
        return {"login":False}
    accessTokenExpires = timedelta(hours=2)
    accessToken = createAccessToken(
        data={"subject": user["username"]}, expiresDelta=accessTokenExpires
    )
    return {"accessToken": accessToken, "tokenType": "Bearer","login":True}

@apiLogin.get("/users/data")
async def checkAccessToken (token: str = Depends(oauth2Scheme)):
    try:
        payload = jwt.decode(token, os.environ["SECRETS_KEY"], algorithms=["HS256"])
        username: str = payload.get("subject")
        user = collectionUserData.find_one({"username": username})
        if not user:
            abort(404, description="User not found")
        return {"username": username}
    except jwt.ExpiredSignatureError:
        abort(401, description="Token has expired")
    except jwt.InvalidTokenError:
        abort(401, description="Invalid token")

