import pymongo
import pandas as pd
import nltk
import spacy
import numpy as np

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["neura-server"]
collection = db["datamodels"]


questions_dict = {"input1": "How was your day (In one sentence)?",
        "input2": "How many times did you feel like smashing a wall?",
        "input3": "How many times did you feel like dancing with said wall?",
        "input4": "How much did you exercise?",
        "input5": "How is your stress situation?",
        "input6": "Did you do anything that isn't part of your regular day?",
        "input7": "Any other thing that you think is worth remembering?"}
data_stack = pd.DataFrame(list(collection.find()))
document_array = []

nlp = spacy.load('en_core_web_sm')


for i in range(len(data_stack)):
    document = nlp(data_stack["content"][i])
    #lower, stop words and lemma.
    document_array.append([tok.lemma_ for tok in document if (tok.is_stop!=True and tok.is_punct!=True and tok.is_digit!=True)])
#print(len(document_array))


"""Lets do a thing like bow or tfidf initially for the more basic functionality and then implement word
embeddings or something when we began to reason through more complex problems."""


