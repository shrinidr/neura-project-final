from data_insights import most_words_plot, happiness_card_graph, cum_happy_graph
from problems import stress_plot
from flask import Flask, jsonify
import plotly.graph_objs as go
import plotly.io as pio
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/chp')
def get_cum_happy_plot():
    cum_happy_json = cum_happy_graph()
    return jsonify(cum_happy_json)

@app.route('/dailyhappyplot')
def get_daily_happy_plot():
    daily_happy_json = happiness_card_graph()
    return jsonify(daily_happy_json)


@app.route('/words')
def get_words():
    words_json = most_words_plot()
    return jsonify(words_json)


@app.route('/stress')
def get_stress():
    stress_json = stress_plot()
    return jsonify(stress_json)


if __name__ == "__main__":
    from waitress import serve
    serve(app, port=5001)