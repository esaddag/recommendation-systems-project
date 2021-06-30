from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/film', methods=['GET', 'POST'])
def method_name():
   pass

if __name__ == '__main__':
    app.run()