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
import itertools


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


most_words_spoken = most_used_words(CleanedDataFrame, data_array.keys())
better_words_spoken = dict(itertools.islice(most_words_spoken.items(), 10))


def most_words_plot(most_words_spoken):
    xdata = [val for val in most_words_spoken.values() if val>2]
    ydata = [key for key in most_words_spoken.keys() if most_words_spoken[key]>2 ]
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
    df['Category'] = df['Category'].apply(lambda x: x[:5])

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

#most_words_plot(better_words_spoken)

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
    delta = {'reference': last_happiness*100, 'increasing': {'color': "RebeccaPurple"}},
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



#Cumulative Happiness Card

def cum_happiness(dataset, cols, date_array):
    x = date_array
    y = [daily_happiness(dataset, cols, i) for i in range(len(dataset))]
    return y


happiness_array = cum_happiness(StartDataFrame, data_array.keys(), date_array)

#happiness_card_graph(happiness_array[-1], happiness_array[-2])

happiness_array = [i*100 for i in happiness_array]
date_array = [str(i)[:10] for i in date_array]


def cum_happy_graph(date_array, happy_array):
    np.random.seed(42)
    dates = date_array
    values = happy_array
# Create a DataFrame
    df = pd.DataFrame({'Date': dates, 'Value': values})

# Create a color scale based on the progression of dates
    color_scale = px.colors.sequential.Viridis

# Create a scatter plot with lines
    fig = go.Figure()

    fig.add_trace(go.Scatter(
        x=df['Date'], y=df['Value'],
        mode='lines+markers',
        marker=dict(
            size=10,
            color=np.linspace(0, 1, len(df)),
            colorscale=color_scale,
            showscale=True,
            colorbar=dict(title='Progression')
        ),
        line=dict(
            color='rgba(0,0,0,0.2)',
            width=2
        )
    ))

# Add annotations for unique points
    annotations = [
    dict(
        x=df['Date'].iloc[0],
        y=df['Value'].iloc[0],
        xref="x",
        yref="y",
        text="Start",
        showarrow=True,
        arrowhead=7,
        ax=0,
        ay=-40
    ),
    dict(
        x=df['Date'].iloc[-1],
        y=df['Value'].iloc[-1],
        xref="x",
        yref="y",
        text="End",
        showarrow=True,
        arrowhead=7,
        ax=0,
        ay=-40
    )
    ]

    fig.update_layout(
    title='A Visualization of How Happy You Were So Far',
    xaxis_title='Date',
    yaxis_title='The Happiness Coefficient',
    annotations=annotations,
    template='plotly_white'
)

    fig.show()

#cum_happy_graph(date_array, happiness_array)


"""Ideas for what we should have: an LDA for 'things that you spend most of your time on'
We either have an interface where the user can ask questions about themselves and we answer.
Or we provide answers to custom questions.


Your favourite swear words also put for fun.

Find out the things that you tend to complain about or the like. Seem to bicker on about.
List them and find solutions for them.

We first design machinery ourselves to find out these problems using training. Then we maybe fine tune an LLM
to figure out the 'solutions' part.

Lets have a seperate file for this because this one's getting too complicated.

"""


