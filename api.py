from flask import Flask, request
from api.main import urun_bazli_filtreleme
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/film', methods=['GET', 'POST'])
def method_name():
    result =  urun_bazli_filtreleme(request.get_json()["keyword"])
    json = result.reset_index().to_json(orient='records')
    return json
   

if __name__ == '__main__':
    app.run()