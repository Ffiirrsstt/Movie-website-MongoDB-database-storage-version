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

len = 60

data = pd.read_csv('Web\\app\\model\\datasetsReview\\pos.csv', sep='\t', encoding='utf-8')
data = pd.concat([data, pd.read_csv('Web\\app\\model\\datasetsReview\\neq.csv', sep='\t', encoding='utf-8')])
data = pd.concat([data, pd.read_csv('Web\\app\\model\\datasetsReview\\test.csv', sep='\t', encoding='utf-8')])
# data.columns = ['review', 'sentiment']

data = data.dropna()

data['review'] = data['review'].apply(lambda x: pythai.word_tokenize(x, engine='newmm'))
data['sentiment'] = data['sentiment'].map({'positive': 1, 'negative': 0})

tokenizer = Tokenizer(num_words=10000, oov_token='<UNK>')
tokenizer.fit_on_texts(data['review'])
word_index = tokenizer.word_index
sequences = tokenizer.texts_to_sequences(data['review'])
padded = pad_sequences(sequences, maxlen=len, padding='post', truncating='post')

test = padded[20]
tokenizer.sequences_to_texts([test])

train_data = padded[:203]
train_sentiment = data['sentiment'][:203]
test_data = padded[40:]
test_sentiment = data['sentiment'][40:]
# train_data = padded[:163]
# train_sentiment = data['sentiment'][:163]
# test_data = padded[163:]
# test_sentiment = data['sentiment'][163:]

model = keras.Sequential([
    keras.layers.Embedding(10000, 16, input_length=len),
    keras.layers.GlobalAveragePooling1D(),
    keras.layers.Dense(16, activation='relu'),
    keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
early_stop = keras.callbacks.EarlyStopping(monitor='val_loss', patience=30)
model.fit(train_data, train_sentiment, epochs=100, validation_data=(test_data, test_sentiment), callbacks=[early_stop])

y_pred = model.predict(test_data)
y_pred = np.round(y_pred)
cm = confusion_matrix(test_sentiment, y_pred)
sns.heatmap(cm, annot=True, fmt='d')
plt.show()
print(classification_report(test_sentiment, y_pred))

model.evaluate(test_data, test_sentiment)

model.save('Web\\app\\model\\sentiment\\model.h5')

with open('Web\\app\\model\\Sentiment\\tokenizer.pkl', 'wb') as file:
    pickle.dump(tokenizer, file)

def predict(text, decode=False):
    text = pythai.word_tokenize(text, engine='newmm')
    text = tokenizer.texts_to_sequences([text])
    text = pad_sequences(text, maxlen=len, padding='post', truncating='post')
    predict = model.predict(text)
    rounded = np.round(predict)
    if decode:
        return 'positive' if rounded == 1 else 'negative'
    return rounded

pred = predict('เริ่ดมาก', decode=True)
print(pred)