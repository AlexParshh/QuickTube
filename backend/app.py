from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/')
@cross_origin()
def index():
    return "Backend Status: Running"




@app.route('/summarize', methods=['POST'])
def summarize():
    if request.method == 'POST':
        req = request.get_json()
        print("recieved")
        return jsonify({"you sent":req})
        





if __name__ == "__main__":
    app.run(debug=True)