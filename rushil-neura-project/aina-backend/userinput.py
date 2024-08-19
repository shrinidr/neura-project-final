from flask import Flask, jsonify, request
from waitress import serve
from flask_cors import CORS
from calcu import return_reference_docs


app = Flask(__name__)
CORS(app)

@app.route('/version_input', methods = ['POST'])
def handle_version_input():
    #This will tell us which of the 5 versions the user has chosen.
    version = request.json
    repCollection = ''
    curr_version = version.get('input')

    if not curr_version:
        return ''

    repCollection = return_reference_docs(curr_version)

    return repCollection

"""

Things that you should take care of:
1) The persistent client keeps older collections in the aina-backend cache.
Find a way to remove them.


2) Solve this collection calling before user input error.
"""


#Uset
@app.route('/get_results', methods = ['GET'])
def get_results():
    docs_output = handle_version_input()




@app.route('/process-chat-input', methods=['POST'])
def handle_chat_input():
    data = request.json  # Get the JSON data from the request
    user_input = data.get('input', '')  # Extract the input field
    return user_input



if __name__=='__main__':
    serve(app, port=5000)