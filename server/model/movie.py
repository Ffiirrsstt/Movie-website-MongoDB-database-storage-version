# นำเข้าโมดูลมาใช้งาน ได้แก่ โมดูล numpy , pandas , pickle, difflib, TfidfVectorizer, cosine_similarity

# pickle ทำข้อมูลของ python เช่น list dict และอื่น ๆ ให้เป็นไฟล์ .pkl หรือ .pickle ซึ่งมีข้อมูลเป็นรหัสที่ไม่สามารถอ่านได้โดยตรง
#  เวลาใช้งานจึงต้องใช้คำสั่ง pickle.load() เพื่อให้ข้อมูลกลับมาใช้ได้เหมือนเดิม

#difflib หาข้อความใกล้เคียงกัน ในที่นี้ใช้สำหรับในการหาหนังใกล้เคียง

# คลาส TfidfVectorizer จาก scikit-learn โดยแปลงข้อความเป็นเวกเตอร์ ใช้ในการสร้างเวกเตอร์ของข้อมูลหนัง

# คลาส cosine_similarity จาก scikit-learn คำนวณความคล้ายคลึงกันระหว่างเวกเตอร์

import numpy as np
import pandas as pd
import pickle
import difflib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# อ่านข้อมูลจากไฟล์ csv เก็บลงในตัวแปร moviesData
moviesData = pd.read_csv('movie-website\\server\\model\\datasetsMovies\\datasetsMovie.csv', encoding='latin-1')

# สร้างรายการเก็บชื่อคอลัมภ์ที่จะนำไปสร้างเป็นเวกเตอร์
selectedFeatures = ['title','genres','formats','keywords']

# ไม่ให้มีค่าว่างเกิดขึ้นในแต่ละคอลัมภ์
for feature in selectedFeatures:
  moviesData[feature] = moviesData[feature].fillna('')

# รวมข้อมูลคอลัมภ์ใส่ในตัวแปร combinedFeatures
combinedFeatures = moviesData['title']+' '+moviesData['genres']+' '+moviesData['formats']+' '+moviesData['keywords']

# สร้าง object TfidfVectorizer ชื่อ vectorizer และ 
# vectorizer ใช้เมธอด fit_transform ทำให้ combinedFeatures เป็น เวกเตอร์
vectorizer = TfidfVectorizer()
featureVectors = vectorizer.fit_transform(combinedFeatures)

# คำนวณความคล้ายคลึงกันของเวกเตอร์ (featureVectors) เก็บลงใน similarity
similarity = cosine_similarity(featureVectors)

# บันทึกไฟล์
# similarity ถูกบันทึกไฟล์ .pkl และ บันทึกข้อมูล moviesData ตามเส้นทาง path ตั้งชื่อ movies.csv
with open('movie-website\\server\\model\\Movies\\similarity.pkl', 'wb') as file:
    pickle.dump(similarity, file)
moviesData.to_csv('movie-website\\server\\model\\Movies\\movies.csv', index=False)

movieName = input(' Enter your favourite movie name : ')

# list รายการหนังทั้งหมดเก็บใน listOfAllTitles
listOfAllTitles = moviesData['title'].tolist()
# difflib.get_close_matches ค้นหาหนังใกล้เคียง movieName ใน list listOfAllTitles โดยคืนค่าไปที่ findCloseMatch
findCloseMatch = difflib.get_close_matches(movieName, listOfAllTitles)

# อย่างเราป้อน harray potter
# findCloseMatch = ['harry potter 6', 'harry potter 5', 'harry potter 4']

closeMatch = findCloseMatch[0]

# หา index ของรายการหนังที่ใกล้เคียง movieName
indexOfTheMovie = moviesData[moviesData.title == closeMatch]['index'].values[0]

# indexOfTheMovie เช่น 71 เป็น index harry potter 6

# list ของ enumerate ที่ทำให้อยู่ในรูป (index,similarity)
similarityScore = list(enumerate(similarity[indexOfTheMovie]))

# เรียงตามความคล้ายคลึงมากไปน้อย (เรียงอิงตาม similarity ที่ถูกเก็บเป็นตำแหน่งที่ 1 โดยกำหนดด้วย key)
sortedSimilarMovies = sorted(similarityScore, key = lambda x:x[1], reverse = True) 

print('Movies suggested for you : \n')

i = 1

for movie in sortedSimilarMovies:
  # movie[0] คือ index และเก็บลงในตัวแปรชื่อ index (เรียกใช้งานสะดวก)
  index = movie[0]
  # เข้าถึงคอลัมภ์ title ของ DataFrame ชื่อ moviesData
  # โดย index ต้องเท่ากับ index ของ moviesData 
  # และข้อมูลที่จะเก็บในตัวแปร titleFromIndex คือข้อมูลที่พบค่าแรกในชุดข้อมูล (จาก values[0])
  titleFromIndex = moviesData[moviesData.index==index]['title'].values[0]

  # moviesData[moviesData.index==index]['title'] จะได้ข้อมูล 66    harry potter 1 Name: title, dtype: object
  # ดังนั้นใช้ values[0] เพื่อดึงเฉพาะค่าแรก อย่าง harry potter 1 มาเก็บใน titleFromIndex

  # แสดงผลลำดับรายการหนังที่มีความคล้ายคลึงกันกับหนังที่เราป้อนเข้าไป
  if (i<30):
    print(i, '.',titleFromIndex)
    i+=1