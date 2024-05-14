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
    action = list(collectionMovieData.find({"genres": "Action"}).limit(6))
    drama = list(collectionMovieData.find({"genres": "Drama"}).limit(6))
    fantasy = list(collectionMovieData.find({"genres": "Fantasy"}).limit(6))
    scienceFiction = list(collectionMovieData.find({"genres": "Science Fiction"}).limit(6))
    comedy = list(collectionMovieData.find({"genres": "Comedy"}).limit(6))
    musical = list(collectionMovieData.find({"genres": "Musical"}).limit(6))
    romance = list(collectionMovieData.find({"genres": "Romance"}).limit(6))
    documentary = list(collectionMovieData.find({"genres": "Documentary"}).limit(6))
    thriller = list(collectionMovieData.find({"genres": "Thriller"}).limit(6))

    pipeline  = [
    {"$sort": {"views": -1}},
    {"$limit": 6} 
    ]
    popular = json_util.dumps(collectionMovieData.aggregate(pipeline))
    return json_util.dumps({'Popular': json.loads(popular),'Movies': movies,'Anime': anime,
    'liveAction': liveAction,'Action': action,'Drama': drama,'Fantasy': fantasy,'ScienceFiction': scienceFiction,
    'Comedy': comedy,'Musical': musical,'Romance': romance,'Documentary': documentary,'Movies': movies
    ,'Thriller': thriller,})

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
    return json_util.dumps(liveAction)

@apiMovies.get('/show/Action')
def nextLiveAction(dataSkip):
    Action = list(collectionMovieData.find({"genres": "Action"}).skip(int(dataSkip)).limit(6))
    return json_util.dumps(Action)

@apiMovies.get('/show/Drama')
def nextLiveAction(dataSkip):
    Drama = list(collectionMovieData.find({"genres": "Drama"}).skip(int(dataSkip)).limit(6))
    return json_util.dumps(Drama)

@apiMovies.get('/show/Fantasy')
def nextLiveAction(dataSkip):
    Fantasy = list(collectionMovieData.find({"genres": "Fantasy"}).skip(int(dataSkip)).limit(6))
    return json_util.dumps(Fantasy)

@apiMovies.get('/show/Science-Fiction')
def nextLiveAction(dataSkip):
    ScienceFiction = list(collectionMovieData.find({"genres": "Science Fiction"}).skip(int(dataSkip)).limit(6))
    return json_util.dumps(ScienceFiction)

@apiMovies.get('/show/Comedy')
def nextLiveAction(dataSkip):
    Comedy = list(collectionMovieData.find({"genres": "Comedy"}).skip(int(dataSkip)).limit(6))
    return json_util.dumps(Comedy)

@apiMovies.get('/show/Musical')
def nextLiveAction(dataSkip):
    Musical = list(collectionMovieData.find({"genres": "Musical"}).skip(int(dataSkip)).limit(6))
    return json_util.dumps(Musical)

@apiMovies.get('/show/Romance')
def nextLiveAction(dataSkip):
    Romance = list(collectionMovieData.find({"genres": "Romance"}).skip(int(dataSkip)).limit(6))
    return json_util.dumps(Romance)

@apiMovies.get('/show/Documentary')
def nextLiveAction(dataSkip):
    Documentary = list(collectionMovieData.find({"genres": "Documentary"}).skip(int(dataSkip)).limit(6))
    return json_util.dumps(Documentary)

@apiMovies.get('/show/Thriller')
def nextLiveAction(dataSkip):
    Thriller = list(collectionMovieData.find({"genres": "Thriller"}).skip(int(dataSkip)).limit(6))
    return json_util.dumps(Thriller)

@apiMovies.get('/movies/detail')
def detail(index:str,username:str):
    dataDetail = collectionMovieData.find_one({"index": int(index)})
    user = collectionUserData.find_one({"username": username})
    collectionUserData.update_one({"idUser": user.get("idUser")}, {"$set": {"viewTitle": dataDetail.get("title")}})

    return json_util.dumps(dataDetail)

@apiMovies.get('/movies/search')
def searchData(dataSearch:str):
    resultSearch = collectionMovieData.find({
    "$or": [
        {"title": {"$regex": dataSearch, "$options": "i"}},
        {"genres": {"$regex": dataSearch, "$options": "i"}},
        {"formats": {"$regex": dataSearch, "$options": "i"}},
        {"keywords": {"$regex": dataSearch, "$options": "i"}}
    ]
})
    return json_util.dumps(resultSearch)