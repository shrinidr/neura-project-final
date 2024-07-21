import pymongo
import pandas as pd
import spacy
import gensim
from gensim.utils import simple_preprocess

db = pymongo.MongoClient('mongodb://localhost:27017/')
client = db["neura-react-server"]
database = client["datamodels"]

data_stack = pd.DataFrame(list(database.find()))

document_array = []

nlp = spacy.load('en_core_web_sm')

data_array = {"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]}
cleaned_data_array = {"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]}


date_array = data_stack['date']
for i in range(len(data_stack)):
    stack = data_stack["entries"][i]
    for j in stack:
        data_array[j['id']].append(j['content'])
        document = nlp(j['content'])
        cleaned_data_array[j['id']].append([tok.lemma_ for tok in document if (tok.is_stop!=True and tok.is_punct!=True and tok.is_digit!=True)])
#This is how you access the data.

StartDataFrame = pd.DataFrame(data_array)
CleanedDataFrame = pd.DataFrame(cleaned_data_array)


""" Stress Dataset: https://www.kaggle.com/datasets/kreeshrajani/human-stress-prediction

Lets do LDA for the 'problems'. Figure out the common topics that pervade the conversation over the past, say,
five days. Next, classify if the topics are "problems" or not. For this, it might be easier to train a dataset
rather than just using pre - made functionality.
Next, list only the problems.
For each problem, we fine tune an LLM using whatever text data we have over the past couple days.
The 'solution' will be a mix of ideas from what the person has tried before and something more general, with a focus
on keeping it contextual.


What LDA is doing: Basically create a random distribution of documents to the various topics. [document i has what
% of being in topic x], create a similiar random distribution of words and topics [where words are the edges of some
n dimensional simplex]. THese are our gears which we manipulate to basically get the gear combination that produces
a document from the given words that is closest to one of the actual documents. In this process, we get our topics.
The topics are arbitrary.
What we actually get is a collection of words that should form one topic which we define ourselves.

"""
doc = []
for i in CleanedDataFrame.columns:
    for j in range(4):
        doc.append(CleanedDataFrame[i][j])



data_dict=gensim.corpora.Dictionary(doc)
data_bow = [data_dict.doc2bow(m) for m in doc]



def topics_array(LDA_diss, num_topics):

    smol_array = []
    big_array = []
    for i in range(num_topics):
        smol_array = []
        for j in LDA_diss.print_topics()[i][1]:
            if type(j)==str:
                smol_array.append(j)
        big_array.append(smol_array)
    alphabet = 'abcdefghijklmnopqrstuvwxyz'
    words_smol = []
    words_big = []
    word = ''
    for array in big_array:
        words_smol = []
        for k in array:
            if (k in alphabet):
                word+=(k)
            elif (k== "\""):
                words_smol.append(word)
                word = ''
        topic1 = [word for word in words_smol if word!='']
        words_big.append(topic1)
    return words_big



#Apparently this is because ill import (i.e. execute) the
# main module at start. You need to insert an if __name__ == '__main__': guard in the main
# module to avoid creating subprocesses recursively.

"""
topics = []
if __name__ == '__main__':
    LDA_diss=gensim.models.LdaMulticore(data_bow, id2word= data_dict, workers=3, passes=2, num_topics=5)
    topics = topics_array(LDA_diss, 5)

print(topics)
"""

""" Temp topics (So we dont have to run this machine again and again.)

['good', 's', 'time', 'weight', 'pushup', 'day', 'sleep', 'want', 'try', 'not'],
['work', 'like', 'start', 'soon', 'need', 'want', 'good', 'healthy', 's'],
['time', 'morning', 'thing', 'not', 'project', 'run', 'dumb', 'software', 'error'],
['feel', 'like', 'day', 'good', 'not', 'yesterday', 'well', 'want', 'bit', 'end'],
['feel', 'thing', 'not', 'want', 'road', 'work', 'control', 'time', 'nope', 'today']]

Broad goals over the next month:
1) Complete the nn from scratch.
2) Get the chat interface running (at the very least).


Immediate goals:
1) Solve the problem labelling problem and subsequently the answering problem.
2) Next, do the stress thing.
3) Deploy results on frontend using flask API.
4) Start building the chat function (latest by 1 august)
"""











