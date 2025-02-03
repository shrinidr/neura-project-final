from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_session import Session
import redis
import plotly.graph_objs as go
import plotly.io as pio
from jose import jwt
from dotenv import load_dotenv
import os
import json
import requests
import pandas as pd
import spacy
import pymongo
from dataTesting import cum_happy_graph, most_words_plot

load_dotenv()

app = Flask(__name__)
CORS(app)

nlp = spacy.load("en_core_web_sm")

# Redis Session Configuration
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'session:'
app.config['SESSION_REDIS'] = redis.StrictRedis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/0'))

# Initialize Flask-Session
Session(app)

# Redis Client
redis_client = redis.StrictRedis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/0'))

# MongoDB Connection
mongo_uri = os.getenv('MONGO_URI')
client = pymongo.MongoClient(mongo_uri)
db = client["test"]
collection = db["users"]

# Clerk JWT Setup
clerk_jwt_key = os.getenv('CLERK_PUBLIC_JWT_KEY')
jwk_url = os.getenv('CLERK_JWK_URL')

response = requests.get(jwk_url)
jwk_keys = response.json().get("keys")
clerk_jwk = jwk_keys[0] if jwk_keys else None

# Function to get User ID from JWT
def get_user_id():
    token = request.headers.get('Authorization')
    if not token or not token.startswith("Bearer "):
        return None
    try:
        token_actual = token.split(" ")[1]
        payload = jwt.decode(token_actual, clerk_jwk, algorithms=['RS256'])
        return payload['sub']
    except:
        return None

@app.route('/storeCache', methods=['POST'])
def store_data():
    userId = get_user_id()
    if not userId:
        return jsonify({"error": "Unauthorized"}), 401

    if redis_client.exists(f"{userId}_StartDataFrame"):
        json_data = redis_client.get(f"{userId}_date_array")
        json_string = json_data.decode('utf-8')
        data_list = json.loads(json_string)
        print(data_list)
        return jsonify({"message": "Cache already initialized"}), 200

    data_stack = pd.DataFrame(list(collection.find({"userId": userId})))

    if data_stack.empty:
        return jsonify({"error": "User data not found"}), 404

    if data_stack.empty:
        return "User data not found", 404

    req_vals = data_stack.journal[0]
    date_array = []
    data_array = {"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]}
    cleaned_data_array = {"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]}

    for i in range(len(req_vals)):
        dt = req_vals[i]['date']
        date_str = f"{dt.year}-{dt.month}-{dt.day}"
        date_array.append(date_str)
        req_obj= req_vals[i]['entries']
        for j in range(len(req_obj)):
            data_array[req_obj[j]['id']].append(req_obj[j]['content'])
            document = nlp(req_obj[j]['content'])
            cleaned_data_array[req_obj[j]['id']].append([tok.lemma_ for tok in document if (tok.is_stop!=True and tok.is_punct!=True and tok.is_digit!=True)])
    print("this is the motherfukcing date array", date_array)
    min_len = min(len(lst) for lst in data_array.values())
    data_array = {k: v[:min_len] for k, v in data_array.items()}

    min_len2 = min(len(lst) for lst in cleaned_data_array.values())
    cleaned_data_array = {k: v[:min_len2] for k, v in cleaned_data_array.items()}

    StartDataFrame = pd.DataFrame(data_array)
    CleanedDataFrame = pd.DataFrame(cleaned_data_array)

    # Store data in Redis
    redis_client.set(f"{userId}_StartDataFrame", StartDataFrame.to_json())
    redis_client.set(f"{userId}_CleanedDataFrame", CleanedDataFrame.to_json())
    redis_client.set(f"{userId}_date_array", json.dumps(date_array.tolist()))
    redis_client.set(f"{userId}_data_array", json.dumps(data_array))
    redis_client.set(f"{userId}_cleaned_data_array", json.dumps(cleaned_data_array))

    print(pd.read_json(redis_client.get(f"{userId}_date_array")))
    return "Data initialized successfully", 200

@app.route('/chp')
def get_cum_happy_plot():
    user_id = get_user_id()
    print(user_id)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    cache_key = f"{user_id}_cum_happy"
    if not redis_client.exists(cache_key):
        StartDataFrame = pd.read_json(redis_client.get(f"{user_id}_StartDataFrame").decode("utf-8"))
        data_array = pd.read_json(redis_client.get(f"{user_id}_data_array").decode("utf-8"))
        json_data = redis_client.get(f"{user_id}_date_array")
        json_string = json_data.decode('utf-8')
        date_array = json.loads(json_string)
        answer = jsonify(cum_happy_graph(StartDataFrame, data_array, date_array))
        redis_client.set(cache_key, answer.get_data(as_text=True))
        return answer
    else:
        return jsonify(json.loads(redis_client.get(cache_key).decode("utf-8")))

@app.route('/words')
def get_words():
    user_id = get_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    cache_key = f"{user_id}_daily_word_bc"
    if not redis_client.exists(cache_key):
        CleanedDataFrame = pd.read_json(redis_client.get(f"{user_id}_CleanedDataFrame").decode("utf-8"))
        answer = jsonify(most_words_plot(CleanedDataFrame))
        redis_client.set(cache_key, answer.get_data(as_text=True))
        return answer
    else:
        return jsonify(json.loads(redis_client.get(cache_key).decode("utf-8")))

if __name__ == "__main__":
    from waitress import serve
    serve(app, port=5001)
