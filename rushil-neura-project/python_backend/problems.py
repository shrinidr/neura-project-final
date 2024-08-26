import pymongo
import pandas as pd
import spacy
import gensim
import numpy as np
from gensim.utils import simple_preprocess
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from tensorflow.keras.preprocessing.text import Tokenizer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report
import joblib
import plotly.express as px
import plotly.graph_objects as go
import plotly.io as pio
from transformers import pipeline


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

stress_data = []

for i in range(len(StartDataFrame)):
    stress_data.append(StartDataFrame['input5'][i])


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


Temp topics (So we dont have to run this machine again and again.)

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


Summarization might work:
Algos: cluster rank.
Existing ones are TAKE, MOOTTweetSumm, DEPSUB is also pretty good becuase it generates labels.
I seriously feel like giving up rn man this fucking sucks.
software engineering is so much better than this bullshit
i am tired of wasting all my day just trying to find a good dataset.
i wanna do more maths and actual building than just running theory written by some guy from mit on some
shitty data that took me 10 days to find.

Ultimately, for the time being we are adding to the neg sentiment intensity analyser the value of whether stress exists or
not so that we get a non zero number which would be continous and also reflect quite geniunely the stress levels
over time adios.
"""



def stress_scores(stress_data):
    sia = SentimentIntensityAnalyzer()
    stress_scores = [sia.polarity_scores(stress_data[i])['neg'] for i in range(len(stress_data))]
    return stress_scores

stress_score_data = stress_scores(stress_data)

#stress_data is the files with all the stress responses


#Commenting out this code so that I dont have to train the model again and again.


def text_preprocess(doc):
  doc = nlp(doc)
  return ' '.join([tok.lemma_ for tok in doc if (tok.is_stop!=True and tok.is_punct!=True and tok.is_digit!=True)])


new_stress_corpus = [text_preprocess(doc) for doc in stress_data]
data = pd.read_csv(r'C:\Users\rushi\Downloads\stress_data.csv')
tokenizer = Tokenizer()


#Now, lets use the tokenizer on the actual training data.

training_cleaned = [text_preprocess(doc) for doc in data['text']]
tokenizer.fit_on_texts(training_cleaned)

"""
#First using CountVectorizer
count_vect_docs = tokenizer.texts_to_matrix(training_cleaned, mode='count')

#Using TFIDF Vectorizer which basically assigns more importance to words that occur infrequently within the entire courpus
#But more frequently in individual documents.

tfidf_vect_docs = tokenizer.texts_to_matrix(training_cleaned, mode='tfidf')

xtrain_count, xtest_count, ytrain_count, ytest_count = train_test_split(tfidf_vect_docs, data['label'], test_size=0.05, random_state=42)


cf=Pipeline([
    ('mnb',MultinomialNB())
])

cf.fit(xtrain_count, ytrain_count)
y_pred=cf.predict(xtest_count)
print(classification_report(y_pred, ytest_count))

joblib.dump(cf, 'multinb_neura_tfidf.joblib')
"""


model = joblib.load('multinb_neura_tfidf.joblib')


tfidf_vect_docs_shape = (2838, 8656)

changed_stress_data = [text_preprocess(doc) for doc in stress_data]
tokenizer.fit_on_texts(changed_stress_data)

tfidf_vect_stress = tokenizer.texts_to_matrix(changed_stress_data, mode='tfidf')
tfidf_vect_new = tfidf_vect_stress[:,:tfidf_vect_docs_shape[1]]

predicted_stress = model.predict(tfidf_vect_new)
print(predicted_stress)

classifier = pipeline('sentiment-analysis')

stress_trans_results = []
for i in stress_data:
    result = classifier(i)
    if(result[0]['label']=="NEGATIVE"):
        stress_trans_results.append(result[0]['score'])
    else:
        stress_trans_results.append(0)
#An average of the transformers, VADER, [negativity] and my own stress data.
ultimate_stress_levels =  (stress_trans_results+ predicted_stress + stress_score_data)/3.0


def stress_plot():
    np.random.seed(42)
    date_rng = pd.date_range(start='2024-07-16', end='2024-07-23', freq='D')
    df = pd.DataFrame(date_rng, columns=['date'])
    df['value'] = np.random.randn(len(date_rng)).cumsum()

# Create a Plotly figure
    fig = go.Figure()

# Add trace for the time series
    fig.add_trace(go.Scatter(
        x=date_array,
        y=ultimate_stress_levels,
        mode='lines',
        line=dict(color='royalblue', width=2),
        name='Time Series'
    ))

# Customize the layout
    fig.update_layout(
    title='A Machine Learning Look at your Stress Levels',
    xaxis_title='Date',
    yaxis_title='Value',
    template='plotly_dark',
    xaxis=dict(
        showline=True,
        showgrid=False,
        showticklabels=True,
        linecolor='rgb(204, 204, 204)',
        linewidth=2,
        ticks='outside',
        tickfont=dict(
            family='Arial',
            size=12,
            color='rgb(204, 204, 204)',
        ),
    ),
    yaxis=dict(
        showgrid=False,
        zeroline=False,
        showline=False,
        showticklabels=True,
    ),
    showlegend=True,
    plot_bgcolor='black',
    paper_bgcolor='black',
    font=dict(color='white'),
)

# Add some more unique styling
    fig.update_traces(marker=dict(size=5, color='white', line=dict(width=2, color='DarkSlateGrey')),
                  selector=dict(mode='markers'))

# Adding custom hovertemplate
    fig.update_traces(
    hovertemplate="<b>Date</b>: %{x}<br><b>Stress Value</b>: %{y}<extra></extra>"
)

# Add a vertical line at a specific date
    fig.add_vline(x=pd.Timestamp('2024-07-16'), line=dict(color='firebrick', width=2, dash='dash'))

# Show the plot
    return pio.to_json(fig)

#stress_plot()

#Okay, maybe dont use the transformers, because they end up taking too much time. Solve this issue later on.
#We need to refine this stress thing. At regular intervals, keep adding data labelled by you and train it with
#the model. This is not perfect yet, but we can perfect it over time.

