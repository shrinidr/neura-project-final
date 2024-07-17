import pymongo
import pandas as pd
import nltk
import spacy
import numpy as np
import matplotlib.pyplot as plt
import plotly.express as px
import seaborn as sns
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import plotly.graph_objects as go



client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["neura-react-server"]
collection = db["datamodels"]


questions_dict = {"input1": "How was your day (In one sentence)?",
        "input2": "How many times did you feel like smashing a wall?",
        "input3": "How many times did you feel like dancing with said wall?",
        "input4": "How much did you exercise?",
        "input5": "How is your stress situation?",
        "input6": "Did you do anything that isn't part of your regular day?",
        "input7": "Any other thing that you think is worth remembering?"}
data_stack = pd.DataFrame(list(collection.find()))
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


"""Lets do a thing like bow or tfidf initially for the more basic functionality and then implement word
embeddings or something when we began to reason through more complex problems."""


#Sorting the most used words [Want this to be on all words ever said not just todays.]


def most_used_words(cleaned_df, cols):

    words = {}
    for col in cols:
        for data in range(len(cleaned_df)):
            words_array = cleaned_df[col][data]
            for word in words_array:
                if(word not in words):
                    words[word]=1
                else:
                    words[word]+=1
    return (dict(sorted(words.items(), key = lambda item: item[1], reverse = True)))



most_words_spoken = (most_used_words(CleanedDataFrame, data_array.keys()))



def most_words_plot(most_words_spoken):
    xdata = [val for val in most_words_spoken.values() if val>1]
    ydata = [key for key in most_words_spoken.keys() if most_words_spoken[key]>1 ]
    bubble_size = [val * 150 for val in xdata]
    df = pd.DataFrame({
    'Category': ydata,
    'Value': xdata,
    'Bubble Size': bubble_size
})

# Create the plot using Plotly
    fig = px.scatter(
    df,
    x='Value',
    y='Category',
    size='Bubble Size',
    text='Category',
    color='Value',
    color_continuous_scale=px.colors.sequential.Sunsetdark,
    size_max=100,
)

# Customize the appearance
    fig.update_traces(
    textposition='middle center',
    textfont_size=14,
    marker=dict(
        opacity=0.6,
        line=dict(width=1, color='lightgrey')  # Setting the boundary to be very light
    )
)

# Increase space between words in the same bubble by adding newlines
    for i, row in df.iterrows():
        fig.data[0].text[i] = row['Category'].replace(' ', '\n\n')

# Change the color of the darkest maroon bubble
    #fig.data[0].marker.color[df['Value'].idxmax()] = 'maroon'

    fig.update_layout(
    title_font_size=24,
    xaxis_title='',
    yaxis_title='',
    xaxis=dict(showgrid=False, showticklabels=False),
    yaxis=dict(showgrid=False, showticklabels=False, zeroline=False)
)

    fig.show()

#most_words_plot(most_words_spoken)

#This is an okish plot. Change the CSS of it later on.

#The Happiness Card and the stress card and so on:
#Happiness and stress index


#Daily Happiness Card:

def daily_happiness(dataset, cols, indx):
    sid_obj = SentimentIntensityAnalyzer()
    happy = 0
    for col in cols:
        happy+=((sid_obj.polarity_scores(dataset[col][indx])['pos']))
    return happy/7

score_today = daily_happiness(StartDataFrame, data_array.keys(), 0)

def happiness_card_graph(val, last_happiness):
    fig = go.Figure(go.Indicator(
    mode = "gauge+number+delta",
    value = val*100,
    domain = {'x': [0, 1], 'y': [0, 1]},
    title = {'text': "The Happiness Meter", 'font': {'size': 24}},
    delta = {'reference': last_happiness, 'increasing': {'color': "RebeccaPurple"}},
    gauge = {
        'axis': {'range': [None, 100], 'tickwidth': 1, 'tickcolor': "darkblue"},
        'bar': {'color': "black"},
        'bgcolor': "white",
        'borderwidth': 2,
        'bordercolor': "gray",
        'steps': [
            {'range': [0, 250], 'color': 'white'},
            {'range': [250, 400], 'color': 'royalblue'}],
        'threshold': {
            'line': {'color': "red", 'width': 4},
            'thickness': 0.75,
            'value': 490}}))

    fig.update_layout(paper_bgcolor = "lavender", font = {'color': "black", 'family': "Free Sans", 'size': 15})

    fig.show()

#happiness_card_graph(score_today, 23)



#Cumulative Happiness Card

def cum_happiness(dataset, cols, date_array):
    x = date_array
    y = [daily_happiness(dataset, cols, i) for i in range(len(dataset))]
    print(y)


#cum_happiness(StartDataFrame, data_array.keys(), date_array)






