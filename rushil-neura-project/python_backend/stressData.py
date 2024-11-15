import pymongo
import pandas as pd
import spacy
import gensim
import numpy as np
from gensim.utils import simple_preprocess
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from tensorflow.keras.preprocessing.text import Tokenizer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report
import joblib
import plotly.express as px
import plotly.graph_objects as go
import plotly.io as pio
from dotenv import load_dotenv
import os


nlp = spacy.load('en_core_web_sm')

def get_stress_data(StartDataFrame):

    stress_data = []
    for i in range(len(StartDataFrame)):
        stress_data.append(StartDataFrame['input5'][i])
    return stress_data

def topics_array(LDA_diss, num_topics, CleanedDataFrame):

    doc = []
    for i in CleanedDataFrame.columns:
        for j in range(4):
            doc.append(CleanedDataFrame[i][j])

    data_dict=gensim.corpora.Dictionary(doc)
    data_bow = [data_dict.doc2bow(m) for m in doc]

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

def stress_scores(stress_data):
    sia = SentimentIntensityAnalyzer()
    stress_scores = [sia.polarity_scores(stress_data[i])['neg'] for i in range(len(stress_data))]
    return stress_scores

def text_preprocess(doc):
    doc = nlp(doc)
    return ' '.join([tok.lemma_ for tok in doc if (tok.is_stop!=True and tok.is_punct!=True and tok.is_digit!=True)])

def some_fucking_thing(StartDataFrame):
    stress_data = get_stress_data(StartDataFrame)
    new_stress_corpus = [text_preprocess(doc) for doc in stress_data]
    data = pd.read_csv(r'C:\Users\rushi\Downloads\stress_data.csv')
    tokenizer = Tokenizer()
#Now, lets use the tokenizer on the actual training data.

    training_cleaned = [text_preprocess(doc) for doc in data['text']]
    tokenizer.fit_on_texts(training_cleaned)
    model = joblib.load('multinb_neura_tfidf.joblib')


    tfidf_vect_docs_shape = (2838, 8656)

    changed_stress_data = [text_preprocess(doc) for doc in stress_data]
    tokenizer.fit_on_texts(changed_stress_data)

    tfidf_vect_stress = tokenizer.texts_to_matrix(changed_stress_data, mode='tfidf')
    tfidf_vect_new = tfidf_vect_stress[:,:tfidf_vect_docs_shape[1]]

    predicted_stress = model.predict(tfidf_vect_new)
    return predicted_stress

def stress_plot(StartDataFrame, date_array):
    np.random.seed(42)
    stress_data = get_stress_data(StartDataFrame)
    ultimate_stress_levels =  (some_fucking_thing(StartDataFrame) + stress_scores(stress_data))/2.0
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