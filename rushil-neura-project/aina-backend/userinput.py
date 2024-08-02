from flask import Flask, jsonify, request
from waitress import serve
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/process-chat-input', methods=['POST'])
def handle_chat_input():
    data = request.json  # Get the JSON data from the request
    user_input = data.get('input', '')  # Extract the input field



if __name__=='__main__':
    serve(app, port=5000)