"""
This file will perform all the model building and the generation of responses based on the versionInput and
the userInput which we will get from the file ./userinput.py through a flask API.
Lets see how this one goes.

"""
import pymongo
import pandas as pd


userInput = "Hey, how are you doing?"

#Say
versionInput = "2024-07-23"

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["neura-react-server"]
collection = db["datamodels"]

dataBase = pd.DataFrame(list(collection.find()))
datearray = pd.Series([str(i)[:10] for i in dataBase['date']])
dataBase['date'] = datearray


document_array = []

"""
import spacy
nlp = spacy.load('en_core_web_sm')
"""

data_array = {"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]}
cleaned_data_array = {"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]}


date_array = dataBase['date']
for i in range(len(dataBase)):
    stack = dataBase["entries"][i]
    for j in stack:
        data_array[j['id']].append(j['content'])
        #document = nlp(j['content'])
        #cleaned_data_array[j['id']].append([tok.lemma_ for tok in document if (tok.is_stop!=True and tok.is_punct!=True and tok.is_digit!=True)])
#This is how you access the data.

StartDataFrame = pd.DataFrame(data_array)
#CleanedDataFrame = pd.DataFrame(cleaned_data_array)
StartDataFrame["date"] = datearray

loc1 = pd.DataFrame()
loc2 = pd.DataFrame()

for i in range(len(StartDataFrame)):
  if(StartDataFrame['date'][i]==versionInput):
    loc1 = StartDataFrame.loc[i-5:i]
    loc2 = StartDataFrame.loc[i+1:i+4]

frames = [loc1, loc2]
#This is the plus minus 5 entries of the date chosen. 5 is arbitrary at the moment, we can tinker it as we go on.
FinalChangedFrame = pd.concat(frames)

#Lets create the model first and then figure out the qna thing.



