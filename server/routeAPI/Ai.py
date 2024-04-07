# model
from model import sentiment as model_predict
from model import suggested as model_suggested

from fastapi import APIRouter
apiAI = APIRouter()

@apiAI.get('/sentiment')
def sentiment(text: str):
    return {'text': text, 'sentiment': model_predict(text, decode=True)}

@apiAI.get('/suggested')
def suggested(text: str):
    return {'text': text, 'suggested': model_suggested(text)}