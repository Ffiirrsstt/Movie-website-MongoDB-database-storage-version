import numpy as np
import pandas as pd
import difflib
import pickle
import pythainlp as pythai
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences


# load model
model = load_model('./model/Sentiment/model.h5')
# load tokenizer
with open('./model/Sentiment/tokenizer.pkl', 'rb') as handle:
    tokenizer = pickle.load(handle)

movies_data = pd.read_csv('./model/Movies/movies.csv')

with open('./model/Movies/similarity.pkl', 'rb') as handle:
    similarity = pickle.load(handle)

def sentiment(text, decode=False):
    text = pythai.word_tokenize(text, engine='newmm')
    text = tokenizer.texts_to_sequences([text])
    text = pad_sequences(text, maxlen=60, padding='post', truncating='post')
    predict = model.predict(text)
    rounded = np.round(predict)
    if decode:
        return 'positive' if rounded == 1 else 'negative'
    return rounded

def suggested(movie_name):
    titile = []
    list_of_all_titles = movies_data['title'].tolist()
    find_close_match = difflib.get_close_matches(movie_name, list_of_all_titles)
    close_match = find_close_match[0]
    index_of_the_movie = movies_data[movies_data.title == close_match]['index'].values[0]
    similarity_score = list(enumerate(similarity[index_of_the_movie]))
    sorted_similar_movies = sorted(similarity_score, key = lambda x:x[1], reverse = True) 
    
    i = 1
    for movie in sorted_similar_movies:
        index = movie[0]
        title_from_index = movies_data[movies_data.index==index]['title'].values[0]
        if (i<30):
            titile.append(f'{i} . {title_from_index}')
            i+=1
    
    return titile

