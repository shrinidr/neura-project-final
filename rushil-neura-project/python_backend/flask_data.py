from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_session import Session
import redis
import plotly.graph_objs as go
import plotly.io as pio
from jose import jwt
from dotenv import load_dotenv
import time
import os
import logging
from io import StringIO
import json
import redis.client
import requests
import pandas as pd
import spacy
import pymongo
from dataTesting import cum_happy_graph, most_words_plot, happiness_card_graph
from ainaCalc import return_reference_docs, get_predef_versions, return_date_matrix, return_query_collection, when_docs_avail
from stressData import stress_plot
from waitress import serve
from pinecone import Pinecone
import psutil

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://www.neura-inc.com", "http://localhost:5173"]}})

# With this:
#nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])

nlp = spacy.load("en_core_web_md", disable=['ner', 'parser'])


logging.basicConfig(level=logging.INFO)

def log_memory():
    mem = psutil.virtual_memory()
    logging.info(f"Memory usage: {mem.used/1024/1024:.2f}MB/{mem.total/1024/1024:.2f}MB")

    
# Redis Session Configuration

redis_host = os.getenv('REDIS_HOST', 'localhost')  # No redis:// prefix here
redis_port = int(os.getenv('REDIS_PORT', 11691))  # Default is 6379, replace with your actual port
redis_password = os.getenv('REDIS_PASSWORD', '')

app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'session:'
app.config['SESSION_REDIS'] = redis.StrictRedis(
    host=redis_host,
    port=redis_port,
    password=redis_password,
    decode_responses= True
)
#app.config['SESSION_REDIS'] = redis.StrictRedis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/0'))

# Initialize Flask-Session
Session(app)

# Redis Client
# Connect to Redis
redis_client = redis.StrictRedis(
    host=redis_host,
    port=redis_port,
    password=redis_password, 
    decode_responses= True 
)
#redis_client = redis.StrictRedis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/0'))


# Test Connection
try:
    print("Redis connection test:", redis_client.ping())  # Should return True
except redis.AuthenticationError:
    print("Redis authentication failed. Check credentials.")
except redis.ConnectionError:
    print("Failed to connect to Redis. Check host and port.")


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

#Array for input padding. 
EXPECTED_INPUTS = [f"input{i}" for i in range(1, 8)]

# Initialize Pinecone
pinecone_api_key = os.getenv('PINECONE_API_KEY')
pc = Pinecone(api_key=pinecone_api_key)

#CHROMA_CLIENT = chromadb.HttpClient(host="https://chromadb-persistent-service.onrender.com", port=8000)
#CHROMA_COLLECTION = CHROMA_CLIENT.get_or_create_collection(name="my_collection")

# Connect to the index
index_name = "neura-pinecone"
"""if index_name not in pc.list_indexes():
    pc.create_index(index_name, dimension=384,
                     spec=ServerlessSpec(
                    cloud='aws',
                    region='us-east-1'
                    ))  # Adjust dimension as needed"""
index = pc.Index(index_name)

"""def get_or_create_collection(name="my_collection"):
    Get an existing collection or create a new one if it doesn't exist
    try:
        return CHROMA_CLIENT.get_collection(name=name)
    except Exception as e:
        print(f"⚠️ Collection  not found, creating a new one")
        return CHROMA_CLIENT.create_collection(name=name)"""


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
    #print("This is the user id", userId)
    if not userId:
        return jsonify({"error": "Unauthorized"}), 401
    
    print(redis_client)
    if redis_client.exists(f"{userId}_StartDataFrame"):
            print("Existing cache found, extending TTL")
            redis_client.expire(f"{userId}_StartDataFrame", 3600)
            redis_client.expire(f"{userId}_CleanedDataFrame", 3600)
            redis_client.expire(f"{userId}_date_array", 3600)
            redis_client.expire(f"{userId}_data_array", 3600)
            redis_client.expire(f"{userId}_cleaned_data_array", 3600)
            redis_client.expire(f"{userId}_version_input_data", 3600)
            redis_client.expire(f"{userId}_repCollection", 3600)
            redis_client.expire(f"{userId}_chatHistory", 3600)
            redis_client.expire(f"{userId}_cum_happy", 3600)
            redis_client.expire(f"{userId}_daily_word_bc", 3600)
            redis_client.expire(f"{userId}_daily_happy_plot", 3600)
            redis_client.expire(f"{userId}_stress_plot", 3600)
            keys = redis_client.keys(f"{userId}_*")
            """if keys:
                redis_client.delete(*keys)
                print(f"Deleted {len(keys)} cache keys for user {userId}")
            return jsonify({"message": "Initialized cache deleted."}), 200"""


    data_stack = pd.DataFrame(list(collection.find({"userId": userId})))
    
    #print("This is the bitchy data stack:", data_stack)
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

        current_entries = {input_id: "" for input_id in EXPECTED_INPUTS}
        current_cleaned = {input_id: [] for input_id in EXPECTED_INPUTS}
        
        req_obj= req_vals[i]['entries']
        """
        for j in range(len(req_obj)):
            data_array[req_obj[j]['id']].append(req_obj[j]['content'])
            document = nlp(req_obj[j]['content'])
            cleaned_data_array[req_obj[j]['id']].append([tok.lemma_ for tok in document if (tok.is_stop!=True and tok.is_punct!=True and tok.is_digit!=True)])"""
        
        for field in req_obj:
            input_id = field['id']
            if input_id in EXPECTED_INPUTS and field.get('content'):
                content = field['content']
                current_entries[input_id] = content
                
                # Process NLP if content exists
                if content and isinstance(content, str):
                    doc = nlp(content)
                    current_cleaned[input_id] = [
                        tok.lemma_ for tok in doc 
                        if not (tok.is_stop or tok.is_punct or tok.is_digit)
                    ]
        
        # Append to main arrays
        for input_id in EXPECTED_INPUTS:
            data_array[input_id].append(current_entries[input_id])
            cleaned_data_array[input_id].append(current_cleaned[input_id])

    #print("this is the motherfukcing date array", date_array)
    min_len = min(len(lst) for lst in data_array.values())
    data_array = {k: v[:min_len] for k, v in data_array.items()}

    
    min_len2 = min(len(lst) for lst in cleaned_data_array.values())
    cleaned_data_array = {k: v[:min_len2] for k, v in cleaned_data_array.items()}


    StartDataFrame = pd.DataFrame(data_array)
    CleanedDataFrame = pd.DataFrame(cleaned_data_array)

    print("sdf length in store data", len(StartDataFrame))
    # Store data in Redis
    redis_client.setex(f"{userId}_StartDataFrame", 3600, StartDataFrame.to_json(orient="records"))
    redis_client.setex(f"{userId}_CleanedDataFrame", 3600,  CleanedDataFrame.to_json(orient="records"))
    redis_client.setex(f"{userId}_date_array", 3600, json.dumps(date_array))

    stored_date_array = redis_client.get(f"{userId}_date_array")
    #print(f"Stored Date Array in Redis: {stored_date_array}")

    redis_client.setex(f"{userId}_data_array", 3600, json.dumps(data_array, default=str))
    redis_client.setex(f"{userId}_cleaned_data_array", 3600, json.dumps(cleaned_data_array))
    redis_client.setex(f"{userId}_version_input_data", 3600,  json.dumps(cleaned_data_array))

    #aiNA variables.
    redis_client.setex(f"{userId}_version_input_data", 3600, json.dumps({}))
    redis_client.setex(f"{userId}_repCollection", 3600, json.dumps({}))
    redis_client.setex(f"{userId}_chatHistory", 3600, json.dumps([]))

    #print(pd.read_json(redis_client.get(f"{userId}_date_array")))
    return "Data initialized successfully", 200

@app.route('/refreshCache', methods=['POST'])
def refresh_cache():
    user_id = get_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    # Delete all existing keys to force fresh load
    keys = redis_client.keys(f"{user_id}_*")
    if keys:
        redis_client.delete(*keys)
    
    # Call store_data to repopulate
    return store_data()


@app.route('/version_input', methods = ['POST'])
def handle_version_input():
    user_id = get_user_id()
    print(user_id)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    version_input_data = request.json
    curr_version = version_input_data.get('input')
    if not curr_version:
        return jsonify({"error": "No version input provided"}), 400
    
    redis_client.setex(f"{user_id}_version_input_data", 3600, json.dumps(version_input_data))
    sdf = pd.read_json(StringIO(redis_client.get(f"{user_id}_StartDataFrame")))
    json_string = redis_client.get(f"{user_id}_date_array")
    udate_array = json.loads(json_string)
    print("this is the literal start data fraem", sdf)
    repCol = return_reference_docs(curr_version, sdf, udate_array, index, user_id)
    print("returned ref docs", repCol)
    redis_client.setex(f"{user_id}_repCollection", 3600, json.dumps(repCol))
    return jsonify({"message": "Version received successfully"}), 200

"""
Things that you should take care of:
1) If the flask script is running, its possible to change the versions. Solve this later on.
"""
@app.route('/datesFind', methods = ['GET'])
def datesFind():
    user_id = get_user_id()
    print(user_id)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    sdf = pd.read_json(StringIO(redis_client.get(f"{user_id}_StartDataFrame")))
    print('dates find sdf', sdf)
    json_string = redis_client.get(f"{user_id}_date_array")
    udate_array = json.loads(json_string)
    print(len(udate_array))
    answer1 = get_predef_versions(sdf, udate_array)
    date_answer = return_date_matrix(answer1)
    print("date answer", date_answer)
    return jsonify({"response": date_answer}), 200
    

@app.route('/process-chat-input', methods=['POST'])
def handle_chat_input():
    user_id = get_user_id()
    print(user_id)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    user_input = data.get('input')
    if not user_input:
        return jsonify({"error": "Chat input not provided"}), 400
    
    chat_history_raw = redis_client.get(f"{user_id}_chatHistory")
    chat_history = json.loads(chat_history_raw)[-10:] if chat_history_raw else []


    #Append the new user message
    chat_history.append({"role": "user", "content": user_input})

    # Store the updated chat history back in Redis
    redis_client.setex(f"{user_id}_chatHistory", 3600,  json.dumps(chat_history))
    repCol2 = json.loads(redis_client.get(f"{user_id}_repCollection"))

    print("this is repCol2", repCol2)
    matched_docs = return_query_collection(repCol2, user_input, index, user_id)
    if not matched_docs:
        response_content = "You're talking about stuff that I don't really recall. Let's talk about something else."
    else:
        version_input = json.loads(redis_client.get(f"{user_id}_version_input_data"))
        version_input = version_input["input"]
        print("sending these to when_docs_avail", matched_docs)
        response_content = when_docs_avail(matched_docs, user_input, version_input, chat_history)

    chat_history.append({"role": "assistant", "content": response_content})
    redis_client.setex(f"{user_id}_chatHistory", 3600, json.dumps(chat_history))
    return jsonify({"response": response_content}), 200



@app.route('/chp')
def get_cum_happy_plot():
    user_id = get_user_id()
    print(user_id)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    cache_key = f"{user_id}_cum_happy"
    if not redis_client.exists(cache_key):
        StartDataFrame = pd.read_json(StringIO(redis_client.get(f"{user_id}_StartDataFrame")))
        data_array = pd.read_json(StringIO(redis_client.get(f"{user_id}_data_array")))
        #print("This the data array", data_array)
        json_string = redis_client.get(f"{user_id}_date_array")
        #print("json string", json_string)
        #json_string = json_data.decode('utf-8')
        date_array = json.loads(json_string)
        #print("final date array", date_array)
        answer = jsonify(cum_happy_graph(StartDataFrame, data_array, date_array))
        redis_client.setex(cache_key, 3600,  answer.get_data(as_text=True))
        return answer
    else:
        return jsonify(json.loads(redis_client.get(cache_key)))

@app.route('/words')
def get_words():
    user_id = get_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    cache_key = f"{user_id}_daily_word_bc"
    if not redis_client.exists(cache_key):
        CleanedDataFrame = pd.read_json(StringIO(redis_client.get(f"{user_id}_CleanedDataFrame")))
        data_array = pd.read_json(StringIO(redis_client.get(f"{user_id}_data_array")))
        answer = jsonify(most_words_plot(CleanedDataFrame, data_array))
        redis_client.setex(cache_key, 3600,  answer.get_data(as_text=True))
        return answer
    else:
        return jsonify(json.loads(redis_client.get(cache_key)))


@app.route('/dailyhappyplot')
def daily_happy_plot():
    user_id = get_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    cache_key = f"{user_id}_daily_happy_plot"
    if not redis_client.exists(cache_key):
        StartDataFrame = pd.read_json(StringIO(redis_client.get(f"{user_id}_StartDataFrame")))
        data_array = pd.read_json(StringIO(redis_client.get(f"{user_id}_data_array")))
        json_string = redis_client.get(f"{user_id}_date_array")
        #json_string = json_data.decode('utf-8')
        date_array = json.loads(json_string)
        answer = jsonify(happiness_card_graph(StartDataFrame, data_array, date_array))
        redis_client.setex(cache_key, 3600,  answer.get_data(as_text=True))
        return answer
    else:
        return jsonify(json.loads(redis_client.get(cache_key)))
    
@app.route('/stress')
def stress_plot_graph():
    user_id = get_user_id()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    cache_key = f"{user_id}_stress_plot"
    if not redis_client.exists(cache_key):
        StartDataFrame = pd.read_json(StringIO(redis_client.get(f"{user_id}_StartDataFrame")))
        json_string = redis_client.get(f"{user_id}_date_array")
        #json_string = json_data.decode('utf-8')
        date_array = json.loads(json_string)
        answer = jsonify(stress_plot(StartDataFrame, date_array))
        redis_client.setex(cache_key, 3600,  answer.get_data(as_text=True))
        return answer
    else:
        return jsonify(json.loads(redis_client.get(cache_key)))
    


"""if __name__ == "__main__":
    
    serve(app, port=5001)
"""

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))  # Use PORT from environment, default to 5001
    serve(app, host="0.0.0.0", port=port)




""":
1) Optimize collecting data from redis by:
 # Instead of loading full DataFrames:
sdf = pd.read_json(StringIO(redis_client.get(f"{user_id}_StartDataFrame")))

# Use chunked loading:
chunk_size = 100  # Adjust based on your data
for chunk in pd.read_json(StringIO(redis_data), chunksize=chunk_size):
    process(chunk)

    
2) 

"""