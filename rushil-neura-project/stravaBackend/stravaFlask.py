from flask import Flask, jsonify, request
from waitress import serve
from flask_cors import CORS
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


clerk_jwt_key = os.getenv('CLERK_PUBLIC_JWT_KEY')
jwk_url = os.getenv('CLERK_JWK_URL')
response = requests.get(jwk_url)
jwk_keys = response.json().get("keys")
clerk_jwk = jwk_keys[0] if jwk_keys else None

user_data = {}


def initialize_user_data(user_id):

    # Prepare user-specific data structure
    data_stack = pd.DataFrame(list(collection.find({"userId": user_id})))
    stravaObj = data_stack.strava[0]
    stravaId = stravaObj['stravaUserId']
    stravaRefreshToken= stravaObj['refreshToken']
    stravaAccessToken= stravaObj['accessToken']
    stravaExpiresAt= stravaObj['expiresAt']
    user_data[user_id] = {
        'stravaUserId':stravaId,
        'stravaRefreshToken': stravaRefreshToken,
        'stravaAccessToken': stravaAccessToken,
        'stravaExpiresAt': stravaExpiresAt,
        'activityDataRaw': None
    }

    # Strava API endpoint for athlete stats
    stats_url = f"https://www.strava.com/api/v3/athletes/{user_data[user_id]['stravaUserId']}/stats"

    try:
        # Make a request to Strava API
        response = requests.get(stats_url, headers={
            'Authorization': f"Bearer {user_data[user_id]['stravaAccessToken']}"
        })

        # Check for successful response
        if response.status_code == 200:
            stats = response.json()
            user_data[user_id]['activityDataRaw'] = stats
            return jsonify({'stats': stats}), 200
        else:
            return jsonify({'error': 'Failed to fetch athlete stats', 'details': response.json()}), response.status_code
    except Exception as e:
        return jsonify({'error': 'An error occurred', 'details': str(e)}), 500

    return "Data initialized successfully", 200


@app.route('/storeActivitiesData', methods=['POST'])
def storeActivityData():
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


if __name__ == "__main__":
    from waitress import serve
    serve(app, port=6001)