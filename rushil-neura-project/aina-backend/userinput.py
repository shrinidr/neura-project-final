from flask import Flask, jsonify, request
from waitress import serve
from flask_cors import CORS



app = Flask(__name__)
CORS(app)

@app.route('/version_input', methods = ['POST'])
def handle_version_input():

    #This will tell us which of the 5 versions the user has chosen.
    version = request.json
    curr_version = version.get('input')
    return curr_version


@app.route('/process-chat-input', methods=['POST'])
def handle_chat_input():
    data = request.json  # Get the JSON data from the request
    user_input = data.get('input', '')  # Extract the input field
    return user_input


if __name__=='__main__':
    serve(app, port=5000)