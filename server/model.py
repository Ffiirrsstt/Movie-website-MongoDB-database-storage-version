# นำเข้าโมดูลมาใช้งาน ได้แก่ โมดูล numpy , pandas , pickle, difflib

# pickle ทำข้อมูลของ python เช่น list dict และอื่น ๆ ให้เป็นไฟล์ .pkl หรือ .pickle ซึ่งมีข้อมูลเป็นรหัสที่ไม่สามารถอ่านได้โดยตรง
#  เวลาใช้งานจึงต้องใช้คำสั่ง pickle.load() เพื่อให้ข้อมูลกลับมาใช้ได้เหมือนเดิม

#difflib หาข้อความใกล้เคียงกัน ในที่นี้ใช้สำหรับในการหาหนังใกล้เคียง

import numpy as np
import pandas as pd
import difflib
import pickle
import pythainlp as pythai
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# การโหลดการเตรียมข้อมูล
#ฝั่ง sentiment
# load model
model = load_model('./model/Sentiment/model.h5')
# load tokenizer
with open('./model/Sentiment/tokenizer.pkl', 'rb') as handle:
    tokenizer = pickle.load(handle)

# ฝั่ง suggested
moviesData = pd.read_csv('./model/Movies/movies.csv')
# load similarity
with open('./model/Movies/similarity.pkl', 'rb') as handle:
    similarity = pickle.load(handle)

def sentiment(text):
    text = pythai.word_tokenize(text, engine='newmm')
    text = tokenizer.texts_to_sequences([text])
    text = pad_sequences(text, maxlen=60, padding='post', truncating='post')
    predict = model.predict(text)
    rounded = np.round(predict)
    return 'positive' if rounded == 1 else 'negative'

def suggested(movieName):
    # สร้าง list เพื่อใช้สำหรับเพิ่มข้อมูลรายการหนังที่แนะนำ และใช้เพื่อส่งค่าออก
    dataSuggested = [] 
    '''สร้าง list รวมรายการหนังทั้งหมดเก็บในตัวแปร listOfAllTitles และ
    ใช้  difflib.get_closeMatches ค้นว่า movieName ใกล้เคียงรายการอะไรบ้างใน listOfAllTitles
    closeMatch เอามาแค่หนึ่งชื่อ เสร็จแล้วเอาชื่อไปหา index เก็บใน indexOfTheMovie
    list ที่ภายในถูก enumerate สร้างในรูป (index,similarity) เก็บลงใน similarityScore
    ทำการเรียงลำดับความใกล้เคียงมากไปน้อย (reverse = True) โดยอ้างอิงข้อมูล similarity (key = lambda x:x[1])
    เก็บลงตัวแปร sortedSimilarMovies 
    '''
    listOfAllTitles = moviesData['title'].tolist()
    findCloseMatch = difflib.get_close_matches(movieName, listOfAllTitles)
    closeMatch = findCloseMatch[0]
    indexOfTheMovie = moviesData[moviesData.title == closeMatch]['index'].values[0]
    similarityScore = list(enumerate(similarity[indexOfTheMovie]))
    sortedSimilarMovies = sorted(similarityScore, key = lambda x:x[1], reverse = True) 
    
    i = 1
    for movie in sortedSimilarMovies:
        index = movie[0]
        titleFromIndex = moviesData[moviesData.index==index]['title'].values[0]
        imageFromIndex = moviesData[moviesData.index==index]['image'].values[0]
        if (i<=6):
            dataSuggested.append({
                "index":index,
                "title":titleFromIndex,
                "image":imageFromIndex})
            i+=1
    
    return dataSuggested

