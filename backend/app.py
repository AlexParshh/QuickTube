from flask import Flask, jsonify, request
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS, cross_origin
from summarization import *


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

#Yes transcript video https://www.youtube.com/watch?v=6Af6b_wyiwI
#No transcript video https://www.youtube.com/watch?v=zBJU9ndpH1Q


@app.route('/')
@cross_origin()
def index():
    return "Backend Status: Running"

@app.route('/summarize', methods=['POST'])
def summarize():
    if request.method == 'POST':
        req = request.get_json()
        url = req['url'].split("=")[1]
        sentences = req['sentences']
 
        a = Summarize(url,sentences)
        a.getTranscript()
        a.cleanTranscript()
        a.createFreqTable(a.text)
        a.setSentences(a.text)
        a.scoreSentences(a.sentences,a.freqTable)
        a.getAverageScore(a.sentenceValue)
        a.getSummary(a.sentences,a.sentenceValue,a.average*sentences/10)
        
        return jsonify({"summary":a.returnSummary()})
        

if __name__ == "__main__":
    app.run(debug=True)