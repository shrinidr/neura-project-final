from flask import Flask, jsonify, request
from waitress import serve
from flask_cors import CORS
from calcu import return_reference_docs, return_query_collection, when_docs_avail, return_date_matrix


app = Flask(__name__)
CORS(app)


version_input_data = {}
repCollection = {}
chatHistory = []
@app.route('/version_input', methods = ['POST'])
def handle_version_input():
    #This will tell us which of the 5 versions the user has chosen.
    global version_input_data
    global repCollection

    version_input_data = request.json
    curr_version = version_input_data.get('input')
    if not curr_version:
        return jsonify({"error": "No version input provided"}), 400

    repCollection = return_reference_docs(curr_version)

    return jsonify({"message": "Version Received Successfully"}), 200


"""
Things that you should take care of:
1) If the flask script is running, its possible to change the versions. Solve this later on.
"""

@app.route('/datesFind', methods = ['GET'])
def datesFind():
    predef_version = return_date_matrix()
    return jsonify({"response": predef_version}), 200



@app.route('/process-chat-input', methods=['POST'])
def handle_chat_input():

    global version_input_data
    global repCollection
    global chatHistory

    data = request.json  # Get the JSON data from the request
    user_input = data.get('input')  # Extract the input field



    curr_version = version_input_data.get('input')
    if not user_input:
        return jsonify({"error": "Chat Input Not Provided"}), 400
    if not version_input_data:
        return jsonify({"error": "Version Input Not Provided"}), 400

    chatHistory.append({"role": "user", "content": user_input})


    matched_docs = return_query_collection(repCollection, user_input)
    LLM_output = ''
    if len(matched_docs) == 0:
        LLM_output = "You're talking about stuff that I don't really recall. Let's talk about something else."
    else:
        LLM_output = when_docs_avail(matched_docs, user_input, curr_version, chatHistory)

    chatHistory.append({"role": "assistant", "content": LLM_output})


    # Clear version input data after processing to allow new inputs
    return jsonify({"response": LLM_output}), 200

if __name__=='__main__':
    serve(app, port=5000, threads=10)