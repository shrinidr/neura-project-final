from flask import Flask, jsonify, request, session
import plotly.graph_objs as go
import plotly.io as pio
from flask_cors import CORS
from jose import JWTError, jwt
from dotenv import load_dotenv
import os
import requests
import json
from dataTesting import cum_happy_graph, most_words_plot, happiness_card_graph
from stressData import stress_plot
import pymongo
import pandas as pd
import nltk
import spacy
import numpy as np
import matplotlib.pyplot as plt
import plotly.express as px
import seaborn as sns
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import plotly.graph_objects as go
import itertools
import plotly.io as pio
from dotenv import load_dotenv
import os
import datetime

""" Hello, there are still some bugs in this code and we have to add user session management soon using
something like Redis. For now (11/3) I am keeping this as is. I will look into it at a later time.
Also token auth is done through mainpage.tsx which has a bit of latency. We have to fix that as well, of course,
later on.

"""
load_dotenv()

app = Flask(__name__)
CORS(app)

mongo_uri = os.getenv('MONGO_URI')
client = pymongo.MongoClient(mongo_uri)
db = client["test"]
collection = db["users"]

questions_dict = {"input1": "How was your day (In one sentence)?",
        "input2": "How many times did you feel like smashing a wall?",
        "input3": "How many times did you feel like dancing with said wall?",
        "input4": "How much did you exercise?",
        "input5": "How is your stress situation?",
        "input6": "Did you do anything that isn't part of your regular day?",
        "input7": "Any other thing that you think is worth remembering?"}


document_array = []

data_array = {"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]}
cleaned_data_array = {"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]}

date_array = []
StartDataFrame = None
CleanedDataFrame = None

nlp = spacy.load('en_core_web_sm')


clerk_jwt_key = os.getenv('CLERK_PUBLIC_JWT_KEY')
jwk_url = os.getenv('CLERK_JWK_URL')

response = requests.get(jwk_url)
jwk_keys = response.json().get("keys")

# Assume the first key in the JWK is the one you need
clerk_jwk = jwk_keys[0] if jwk_keys else None
cum_happy = None
daily_word_bc = None
stress_bc = None
happy_card = None


def initialize_data(userId):
    global StartDataFrame, CleanedDataFrame, date_array, data_array, cleaned_data_array
    data_stack = pd.DataFrame(list(collection.find({"userId": userId})))

    if data_stack.empty:
        return "User data not found", 404
    # Process entries
    req_vals = data_stack.journal[0]
    for i in range(len(req_vals)):
        dt = req_vals[i]['date']
        date_str = f"{dt.year}-{dt.month}-{dt.day}"
        date_array.append(date_str)
        req_obj= req_vals[i]['entries']
        for j in range(len(req_obj)):

            data_array[req_obj[j]['id']].append(req_obj[j]['content'])
            document = nlp(req_obj[j]['content'])
            cleaned_data_array[req_obj[j]['id']].append([tok.lemma_ for tok in document if (tok.is_stop!=True and tok.is_punct!=True and tok.is_digit!=True)])


    min_len = min(len(lst) for lst in data_array.values())
    data_array = {k: v[:min_len] for k, v in data_array.items()}  # Trim lists to the shortest length

    min_len2 = min(len(lst) for lst in cleaned_data_array.values())
    cleaned_data_array = {k: v[:min_len2] for k, v in cleaned_data_array.items()}  # Trim lists to the shortest length
    # Set global data frames
    StartDataFrame = pd.DataFrame(data_array)
    CleanedDataFrame = pd.DataFrame(cleaned_data_array)

    return "Data initialized successfully",200

@app.route('/storeCache', methods=['POST'])
def store_data():
    token = request.headers.get('Authorization')
    print("this is the token babyyyyy", token)
    # Check if the token is present and formatted correctly
    if not token:
        return jsonify({"error": "Authorization token missing"}), 401

    if not token.startswith("Bearer "):
        return jsonify({"error": "Invalid token format"}), 401

    try:
        # Extract the actual token after 'Bearer '
        token_actual = token.split(" ")[1]

        # Decode the token
        payload = jwt.decode(token_actual, clerk_jwk, algorithms=['RS256'])
        user_id = payload['sub']
        print(user_id)
        if StartDataFrame == None:
            return initialize_data(user_id)
        else:
            return "", 200

    except JWTError:
        return jsonify({"error": "Token is invalid"}), 401

@app.route('/chp')
def get_cum_happy_plot():
    global StartDataFrame, data_array, date_array, cum_happy
    if (cum_happy== None):
        answer = jsonify(cum_happy_graph(StartDataFrame, data_array, date_array))
        cum_happy = answer
        return answer
    else:
        return cum_happy


@app.route('/dailyhappyplot')
def get_daily_happy_plot():
    global StartDataFrame, data_array, date_array, happy_card
    if (happy_card == None):
        answer =  jsonify(happiness_card_graph(StartDataFrame, data_array, date_array))
        happy_card = answer
        return answer
    else:
        return happy_card

@app.route('/words')
def get_words():
    global CleanedDataFrame, data_array, daily_word_bc
    if (daily_word_bc == None):
        answer = jsonify(most_words_plot(CleanedDataFrame, data_array))
        daily_word_bc = answer
        return answer
    else:
        return daily_word_bc


@app.route('/stress')
def get_stress():
    global StartDataFrame, date_array, stress_bc
    if (stress_bc == None):
        answer = jsonify(stress_plot(StartDataFrame, date_array))
        stress_bc = answer
        return answer
    else:
        return stress_bc


if __name__ == "__main__":
    from waitress import serve
    serve(app, port=5001)