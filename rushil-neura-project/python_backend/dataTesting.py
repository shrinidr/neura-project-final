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
import plotly.io as pio
from dotenv import load_dotenv
import os
import datetime

nlp = spacy.load('en_core_web_sm')


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

def most_words_plot(CleanedDataFrame, data_array):

    most_words_spoken = most_used_words(CleanedDataFrame, data_array.keys())
    better_words_spoken = dict(itertools.islice(most_words_spoken.items(), 10))

    xdata = [val for val in better_words_spoken.values() if val>2]
    ydata = [key for key in better_words_spoken.keys() if better_words_spoken[key]>2 ]
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
    yaxis=dict(showgrid=False, showticklabels=False, zeroline=False),
    paper_bgcolor='#050505',
    plot_bgcolor = 'lightblue',
    title = {
            'text': "Your Most Used Words",
            'font': {'size': 24, 'family': "FreeSans", 'color': "white"},
            'y': 0.92,
            'yanchor': 'top'
        },
        margin = {'t': 100},
    coloraxis_colorbar=dict(
            title='Value',  # Title of the color bar
            title_font=dict(size=12, color='white'),  # Title font size and color
            tickfont=dict(size=12, color='white')  # Color of the color bar tick labels
        )
    )

    return pio.to_json(fig)

def daily_happiness(dataset, cols, indx):
    sid_obj = SentimentIntensityAnalyzer()
    happy = 0
    for col in cols:
        happy+=((sid_obj.polarity_scores(dataset[col][indx])['pos']))
    return happy/7

def happiness_card_graph(StartDataFrame, data_array, date_array):
    score_today = daily_happiness(StartDataFrame, data_array.keys(), 0)
    happiness_array = cum_happiness(StartDataFrame, data_array.keys(), date_array)
    happiness_array = [i*100 for i in happiness_array]
    val = happiness_array[-1]
    last_happiness = np.mean(happiness_array)
    fig = go.Figure(go.Indicator(
    mode = "gauge+number+delta",
    value = val,
    domain = {'x': [0, 1], 'y': [0, 1]},
    delta = {'reference': last_happiness, 'increasing': {'color': "RebeccaPurple"}},
    number = {'font': {'color': "white"}},
    gauge = {
        'axis': {'range': [None, 100], 'tickwidth': 1, 'tickcolor': "white"},
        'bar': {'color': "gray"},
        'bgcolor': "white",
        'borderwidth': 2,
        'bordercolor': "gray",
        'steps': [
            {'range': [0, 250], 'color': 'white'},
            {'range': [250, 400], 'color': 'white'}],
        'threshold': {
            'line': {'color': "red", 'width': 4},
            'thickness': 0.75,
            'value': 490}}))

    fig.update_layout(
        paper_bgcolor = "#050505",
        font = {'color': "white", 'family': "Free Sans", 'size': 15},
        title = {
            'text': "The Happiness Meter (With respect to your baseline)",
            'font': {'size': 24, 'family': "FreeSans", 'color': "white"},
            'y': 0.92,
            'yanchor': 'top'
        },
        margin = {'t': 100}
        )
    return(pio.to_json(fig))

def cum_happiness(dataset, cols, date_array):
    x = date_array
    y = [daily_happiness(dataset, cols, i) for i in range(len(dataset))]
    return y

def cum_happy_graph(StartDataFrame, data_array, date_array):
    happiness_array = cum_happiness(StartDataFrame, data_array.keys(), date_array)
    happiness_array = [i*100 for i in happiness_array]
    date_array = [str(i)[:10] for i in date_array]

    print("Dates Length:", len(date_array))
    print("Values Length:", len(happiness_array))
    print("Dates:", date_array)
    print("Values:", happiness_array)

    dates = date_array
    values = happiness_array
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
        color= 'white',
        width=2
    )
))

# Calculate the mean of the values
    mean_value = df['Value'].mean()

# Add the horizontal line for the mean value
    fig.add_shape(
    type='line',
    x0=df['Date'].min(),
    y0=mean_value,
    x1=df['Date'].max(),
    y1=mean_value,
    line=dict(color='white', dash='dash')
)

# Add annotation for the baseline
    fig.add_annotation(
    x=df['Date'].max(),
    y=mean_value,
    text='Baseline',
    showarrow=True,
    arrowhead=1,
    ax=0,
    ay=-40
)

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
    xaxis=dict(
            title=dict(text='Date', font=dict(color='white')),
            tickfont=dict(color='white'),
            gridcolor='#242323'  # Change grid color for x-axis
        ),
        yaxis=dict(
            title=dict(text='The Happiness Coefficient', font=dict(color='white')),
            tickfont=dict(color='white'),
            gridcolor='#242323'  # Change grid color for y-axis
        ),
    annotations=annotations,
    template='plotly_white',
    plot_bgcolor = '#050505',
    paper_bgcolor = '#050505',
    font=dict(color='white')
)

    return (pio.to_json(fig))
