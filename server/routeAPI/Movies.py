import json
from bson import json_util

# ใช้งาน env
import os
from dotenv import load_dotenv

#mongoDB
import pymongo

import pandas as pd

# เพื่อแยกไฟล์ API ออกมาจาก server
from fastapi import APIRouter
apiMovies = APIRouter()

# เชื่อมต่อ MongoDB
load_dotenv()
mongodb = os.getenv("MONGODB")
client = pymongo.MongoClient(mongodb)
database = client["WebMovie"]
collectionMovieData = database["MovieData"]
collectionUserData = database["UserData"]

# collectionMovieData.delete_many({})

# df = pd.read_csv("./model/datasetsMovies/datasetsMovie.csv")
# data = df.to_dict(orient='records')
# collectionMovieData.insert_many(data)
# print("เพิ่มข้อมูลเรียบร้อย")

# เอาจำนวนมาใช้ในการทำแถบเลื่อนที่หน้า Web
# print('Movies :', {collectionMovieData.count_documents({"formats": "Movies"})})
# print('Anime :', {collectionMovieData.count_documents({"formats": "Anime"})})
# print('liveAction :', {collectionMovieData.count_documents({"formats": "Live Action"})})

# ได้จำนวน ดังนี้
# Movies = 61
# Anime = 24
# liveAction = 4
@apiMovies.get('/')
def index():
    movies = list(collectionMovieData.find({"formats": "Movies"}).limit(6))
    anime = list(collectionMovieData.find({"formats": "Anime"}).limit(6))
    liveAction = list(collectionMovieData.find({"formats": "Live Action"}).limit(6))

    pipeline  = [
    {"$sort": {"views": -1}},
    {"$limit": 6} 
    ]
    popular = json_util.dumps(collectionMovieData.aggregate(pipeline))
    return json_util.dumps({'Popular': json.loads(popular),'Movies': movies,'Anime': anime,'liveAction': liveAction})

@apiMovies.get('/show/Movies')
def nextMovies(dataSkip):
    movies = list(collectionMovieData.find({"formats": "Movies"}).skip(int(dataSkip)).limit(6))
    return json_util.dumps(movies)

@apiMovies.get('/show/Animation')
def nextAnimation(dataSkip):
    anime = list(collectionMovieData.find({"formats": "Anime"}).skip(int(dataSkip)).limit(6))
    return json_util.dumps(anime)

@apiMovies.get('/show/Live-Action')
def nextLiveAction(dataSkip):
    liveAction = list(collectionMovieData.find({"formats": "Live Action"}).skip(int(dataSkip)).limit(6))
    return json_util.dumps( liveAction)

@apiMovies.get('/Movies/detail')
def detail(index):
    dataDetail = collectionMovieData.find_one({"index": int(index)})

    collectionUserData.update_one({"idUser": "0"}, {"$set": {"viewIndex": int(index)}})

    return json_util.dumps(dataDetail)