from flask import Flask, jsonify, request
from waitress import serve
from flask_cors import CORS
from calcu import return_reference_docs, return_query_collection, when_docs_avail, return_date_matrix, get_predef_versions
import pandas as pd
import os
import pymongo
from jose import JWTError, jwt
import spacy
import requests
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app)



mongo_uri = os.getenv('MONGO_URI')
client = pymongo.MongoClient(mongo_uri)
db = client["test"]
collection = db["users"]

#Use this: https://chatgpt.com/c/6727abd1-155c-8012-8cbe-dc5635e38df7

version_input_data = {}
repCollection = {}
chatHistory = []

#clerk setup

clerk_jwt_key = os.getenv('CLERK_PUBLIC_JWT_KEY')
jwk_url = os.getenv('CLERK_JWK_URL')
response = requests.get(jwk_url)
jwk_keys = response.json().get("keys")
clerk_jwk = jwk_keys[0] if jwk_keys else None

user_data = {}

questions_dict = {"input1": "How was your day (In one sentence)?",
        "input2": "Did anything make you feel like smashing a wall today?",
        "input3": "What was something that made you want to dance?",
        "input4": "Did you exercise today? What did you do?",
        "input5": "How are you dealing with stress in your life?",
        "input6": "Did you do anything that isn't part of your regular day?",
        "input7": "Any other thing that you think is worth remembering?"}


document_array = []
nlp = spacy.load('en_core_web_sm')

def initialize_user_data(user_id):
    """Initialize data structures for a new user."""
    data_stack = pd.DataFrame(list(collection.find({"userId": user_id})))

    if data_stack.empty:
        return "User data not found", 404

    # Prepare user-specific data structure
    user_data[user_id] = {
        "StartDataFrame": None,
        "CleanedDataFrame": None,
        "date_array": [],
        "data_array":{"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]},
        "cleaned_data_array": {"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]},
        "version_input_data": {},
        "repCollection": {},
        "chatHistory": []
    }

    req_vals = data_stack.journal[0]
    for entry in req_vals:
        date_str = f"{entry['date'].year}-{entry['date'].month}-{entry['date'].day}"
        user_data[user_id]["date_array"].append(date_str)
        for question in entry['entries']:
            data_array = user_data[user_id]["data_array"]
            cleaned_data_array = user_data[user_id]["cleaned_data_array"]
            data_array[question['id']].append(question['content'])

            # NLP processing
            document = nlp(question['content'])
            cleaned_data_array[question['id']].append([
                tok.lemma_ for tok in document if not tok.is_stop and not tok.is_punct and not tok.is_digit
            ])

    # Trim lists to the shortest length
    min_len = min(len(lst) for lst in user_data[user_id]["data_array"].values())
    min_len2 = min(len(lst) for lst in user_data[user_id]["cleaned_data_array"].values())
    user_data[user_id]["data_array"] = {k: v[:min_len] for k, v in user_data[user_id]["data_array"].items()}
    user_data[user_id]["cleaned_data_array"] = {k: v[:min_len2] for k, v in user_data[user_id]["cleaned_data_array"].items()}

    # Create dataframes
    user_data[user_id]["StartDataFrame"] = pd.DataFrame(user_data[user_id]["data_array"])
    user_data[user_id]["CleanedDataFrame"] = pd.DataFrame(user_data[user_id]["cleaned_data_array"])
    return "Data initialized successfully", 200

@app.route('/store', methods=['POST'])
def store_data():
    token = request.headers.get('Authorization')
    if not token or not token.startswith("Bearer "):
        return jsonify({"error": "Invalid or missing token"}), 401

    token_actual = token.split(" ")[1]
    try:
        # Decode the token
        payload = jwt.decode(token_actual, clerk_jwk, algorithms=['RS256'])
        user_id = payload['sub']

        # Initialize data if it doesn't already exist for the user
        if user_id not in user_data:
            status, code = initialize_user_data(user_id)
            if code != 200:
                return jsonify({"error": status}), code

        return jsonify({"message": "Data stored successfully"}), 200

    except JWTError:
        return jsonify({"error": "Token is invalid"}), 401


@app.route('/version_input', methods = ['POST'])
def handle_version_input():
    token = request.headers.get('Authorization')
    token_actual = token.split(" ")[1]
    payload = jwt.decode(token_actual, clerk_jwk, algorithms=['RS256'])
    user_id = payload['sub']

    if user_id not in user_data:
        return jsonify({"error": "User data not initialized"}), 400

    version_input_data = request.json
    curr_version = version_input_data.get('input')
    if not curr_version:
        return jsonify({"error": "No version input provided"}), 400

    user_data[user_id]["version_input_data"] = version_input_data
    sdf = user_data[user_id]["StartDataFrame"]
    udate_array = user_data[user_id]["date_array"]
    user_data[user_id]["repCollection"] = return_reference_docs(curr_version, sdf, udate_array)
    print(user_data[user_id]["repCollection"])
    return jsonify({"message": "Version received successfully"}), 200

"""
Things that you should take care of:
1) If the flask script is running, its possible to change the versions. Solve this later on.
"""

@app.route('/datesFind', methods = ['GET'])
def datesFind():
    token = request.headers.get('Authorization')
    token_actual = token.split(" ")[1]
    payload = jwt.decode(token_actual, clerk_jwk, algorithms=['RS256'])
    user_id = payload['sub']

    if user_id not in user_data:
        return jsonify({"error": "User data not initialized"}), 400

    sdf = user_data[user_id]["StartDataFrame"]
    udate_array = user_data[user_id]["date_array"]
    answer1 = get_predef_versions(sdf, udate_array)
    date_answer = return_date_matrix(answer1)
    print("date answer", date_answer)
    return jsonify({"response": date_answer}), 200
    """
    predef_version = return_date_matrix()
    return jsonify({"response": predef_version}), 200
    """


@app.route('/process-chat-input', methods=['POST'])
def handle_chat_input():
    token = request.headers.get('Authorization')
    token_actual = token.split(" ")[1]
    payload = jwt.decode(token_actual, clerk_jwk, algorithms=['RS256'])
    user_id = payload['sub']

    if user_id not in user_data:
        return jsonify({"error": "User data not initialized"}), 400

    data = request.json
    user_input = data.get('input')
    if not user_input:
        return jsonify({"error": "Chat input not provided"}), 400

    chat_history = user_data[user_id]["chatHistory"]
    chat_history.append({"role": "user", "content": user_input})

    matched_docs = return_query_collection(user_data[user_id]["repCollection"], user_input)
    if not matched_docs:
        response_content = "You're talking about stuff that I don't really recall. Let's talk about something else."
    else:
        response_content = when_docs_avail(matched_docs, user_input, user_data[user_id]["version_input_data"]["input"], chat_history)

    chat_history.append({"role": "assistant", "content": response_content})

    return jsonify({"response": response_content}), 200

if __name__=='__main__':
    serve(app, port=5002, threads=10)