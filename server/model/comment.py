# tensorflow.keras สำหรับสร้างและฝึกโมเดลประสาทเทียม
# pandas สำหรับจัดการข้อมูล (ตาราง)
# numpy  สำหรับคำนวณทางคณิตศาสตร์
# pythainlp สำหรับประมวลภาษาไทย
# matplotlib.pyplot สำหรับวาดกราฟ
# seaborn สำหรับวาดกราฟความร้อน (Heatmap)
# pickle สำหรับบันทึกข้อมูลของ Tokenizer

import tensorflow.keras as keras
import pandas as pd
import numpy as np
import pythainlp as pythai
import matplotlib.pyplot as plt
import seaborn as sns
import pickle
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix

# ความยาวของรีวิวที่จะนำไปวิเคราะห์ว่าเป็น positive หรือ negative
len = 60

data = pd.read_csv('movie-website\\server\\model\\datasetsReview\\pos.csv', sep='\t', encoding='utf-8')
data = pd.concat([data, pd.read_csv('movie-website\\server\\model\\datasetsReview\\neq.csv', sep='\t', encoding='utf-8')])
data = pd.concat([data, pd.read_csv('movie-website\\server\\model\\datasetsReview\\test.csv', sep='\t', encoding='utf-8')])
# data.columns = ['review', 'sentiment']

# อ่านไฟล์ csv และรวมกัน เก็บที่ data

# ถ้าพบข้อมูลหายก็ลบทิ้งเลย
data = data.dropna()

# pythai.word_tokenize แยกคำ
# แยกคำในรีวิว และแปลงให้ positive ในคอลัมภ์ sentiment เป็น 1 ,negative เป็น 0
data['review'] = data['review'].apply(lambda x: pythai.word_tokenize(x, engine='newmm'))
data['sentiment'] = data['sentiment'].map({'positive': 1, 'negative': 0})

# การแปลงข้อความเป็นตัวเลข
# Tokenizer(num_words=10000, oov_token='<UNK>') เก็บศัพท์มากสุด 1000 คำ และกำหนดค่าแทนสำหรับคำที่ไม่มีในพจนานุกรม (oov_token='<UNK>')
tokenizer = Tokenizer(num_words=10000, oov_token='<UNK>')
# สร้างพจนานุกรมคำ โดยเรียนรู้คำจากรีวิว
tokenizer.fit_on_texts(data['review'])
word_index = tokenizer.word_index
# แปลงข้อความรีวิวเป็นลำดับตัวเลข เก็บใน sequences
sequences = tokenizer.texts_to_sequences(data['review'])
# ปรับความยาวของลำดับตัวเลขให้เท่ากัน (pad_sequences)
# เติมช่องว่างด้านท้าย (padding='post')  ตัดคำเกิน(ทิ้ง)ด้านซ้าย (truncating='post')
padded = pad_sequences(sequences, maxlen=len, padding='post', truncating='post')

# แบ่งข้อมูลออกเป็นชุดฝึก และชุดทดสอบ
# ชุดฝึก 250 รีวิวแรก และชุดทดสอบ ตั้งแต่รีวิวที่ 230 เป็นต้นไป
trainData = padded[:200]
trainSentiment = data['sentiment'][:200]
testData = padded[40:]
testSentiment = data['sentiment'][40:]
 
'''สร้างโมเดลประสาทเทียมแบบ Sequential เก็บในตัวแปร model
โมเดลแบบ Sequential ประกอบด้วยชั้น (layer) เรียงต่อกัน
ชั้นแรก (Embedding) มี 10000
ชั้นที่สอง (GlobalAveragePooling1D) 
ชั้นสาม (hidden layer) กำหนด 16 หน่วยประมวลผล และใช้ฟังก์ชันการกระตุ้น relu
ชั้นสี่ (output layer) มี 1 หน่วยประมวลผล (units) และใช้ฟังก์ชันการกระตุ้น Sigmoid
'''

model = keras.Sequential([
keras.layers.Embedding(10000, 16, input_length=len),
    keras.layers.GlobalAveragePooling1D(),
    keras.layers.Dense(16, activation='relu'),
    keras.layers.Dense(1, activation='sigmoid')
])

'''
กำหนดค่าโมเดลเพิ่มเติม
optimizer='adam' ปรับแต่งโมเดล ,loss='binary_crossentropy' ต้องการผลที่ได้เป็น 0 หรือ 1 
,metrics=['accuracy'] วัดความแม่นยำ "accuracy"
'''
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
# หยุดฝึกเมื่อ val_loss ไม่ดีขึ้นเลย 30 epochs
earlyStop = keras.callbacks.EarlyStopping(monitor='val_loss', patience=30)
# ฝึกโมเดล จำนวนรอบ 100 , ใช้ข้อมูลเพื่อประเมินผลระหว่างฝึก (validation_data=(testData, testSentiment))
# callbacks นำ earlyStop มาใช้
model.fit(trainData, trainSentiment, epochs=100, validation_data=(testData, testSentiment), callbacks=[earlyStop])

yPredict = model.predict(testData)
# ปัดเศษผลทำนาย
yPredict = np.round(yPredict)
# สร้าง confusion matrix แล้วนำไปใช้สร้างกราฟ heatmap
# confusion matrix แสดงผลการจำแนกประเภท
cm = confusion_matrix(testSentiment, yPredict)
# annot=True แสดงตัวเลขในช่องกราฟ , fmt='d': กำหนดรูปแบบการแสดงค่าตัวเลขภายในช่องของกราฟ (d : จำนวนเต็ม)
# heatmap กราฟสี นอนผลลัพธ์จริง ตั้งผลลัพธ์ทำนาย สีเข้มจำนวนมาก สีอ่อนจำนวนน้อย
sns.heatmap(cm, annot=True, fmt='d')
plt.show()

# classification_report รายงานประสิทธิภาพ
print(classification_report(testSentiment, yPredict))

# ประเมินประสิทธิภาพโมเดลอีกครั้ง
model.evaluate(testData, testSentiment)

# เก็บโมเดลที่ฝึกเสร็จแล้วเพื่อนำไปใช้งาน
model.save('movie-website\\server\\model\\sentiment\\model.h5')
# บันทึกข้อมูลตัวแปลงข้อความเป็นตัวเลข ,'wb' คือโหมด binary write
# pickle.dump บันทึกข้อมูล tokenizer ลงในไฟล์
with open('movie-website\\server\\model\\Sentiment\\tokenizer.pkl', 'wb') as file:
    pickle.dump( tokenizer , file)

def predict(text):
    # แยกคำในข้อความเก็บลง text
    text = pythai.word_tokenize(text, engine='newmm')
    # แปลงข้อความเป็นลำดับตัวเลข
    text = tokenizer.texts_to_sequences([text])
    # ปรับความยาวของลำดับตัวเลขให้เท่ากัน
    text = pad_sequences(text, maxlen=len, padding='post', truncating='post')
    # ทำนายข้อมูล
    predict = model.predict(text)
    # ปัดเศษ
    rounded = np.round(predict)
    return 'positive' if rounded == 1 else 'negative'

pred = predict('มันก็ได้อยู่')
print(pred)