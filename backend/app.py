from flask import Flask, jsonify, request
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS, cross_origin



app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

#Yes transcript video https://www.youtube.com/watch?v=6Af6b_wyiwI
#No transcript video https://www.youtube.com/watch?v=zBJU9ndpH1Q

class Summarize():
    def __init__(self,url,sentences):
        self.url = url
        self.sentences = sentences
        self.transcript = ""

    def getTranscript(self):
        self.transcript = YouTubeTranscriptApi.get_transcript(self.url)

    def getText(self):
        return self.transcript


@app.route('/')
@cross_origin()
def index():
    return "Backend Status: Running"

@app.route('/summarize', methods=['POST'])
def summarize():
    if request.method == 'POST':
        req = request.get_json()
        url = req['url'].split("=")[1]
        a = YouTubeTranscriptApi.get_transcript(url)
        
        return jsonify({"you sent":a})
        



if __name__ == "__main__":
    app.run(debug=True)