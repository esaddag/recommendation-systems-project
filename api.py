import json
from turtle import pd
import pandas as pd

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from api.main import urun_bazli_filtreleme, kullanici_bazli_filtreleme, kullanici_film_matrisi

app = Flask(__name__)
cors = CORS(app)


@app.route('/')
def hello():
    return 'Hello World!'


@app.route('/film', methods=['GET', 'POST'])
@cross_origin()
def film():
    keyword = request.args.get("keyword")
    if keyword is None or keyword == "":
        keyword = "Matrix "
    result = urun_bazli_filtreleme(keyword)
    json = result.reset_index().to_json(orient='records')
    return json


@app.route('/kullaniciFilm', methods=['GET', 'POST'])
@cross_origin()
def kullaniciFilm():
    userId = request.args.get("userId")
    numUserId: int = int(pd.Series(kullanici_film_matrisi.index).sample(1, random_state=45).values)
    if userId is not None and userId != "":
        numUserId = int(userId)
    result = kullanici_bazli_filtreleme(numUserId)
    json = jsonify(result)
    return json


@app.route('/kullanici', methods=['GET', 'POST'])
@cross_origin()
def kullanici():
    userId = request.args.get("userId")
    numUserId: int = int(pd.Series(kullanici_film_matrisi.index).sample(1, random_state=45).values)
    if userId is not None and userId != "":
        numUserId = int(userId)
    result = kullanici_film_matrisi[kullanici_film_matrisi.index == numUserId]
    return result.reset_index().to_json(orient='records')


if __name__ == '__main__':
    app.run()
