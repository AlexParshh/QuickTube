from youtube_transcript_api import YouTubeTranscriptApi
import nltk
import re
import string
import pycurl
from io import BytesIO
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize, sent_tokenize
nltk.download('punkt')
nltk.download('stopwords')

class Summarize():
    def __init__(self,url,sentences):
        self.url = url
        self.sentences = sentences

    def getTranscript(self):
        self.transcript = YouTubeTranscriptApi.get_transcript(self.url)

    def cleanTranscript(self):
        text = ""

        for i in self.transcript:
            text += (i['text']+" ")

        text = text.replace("\n", " ")
        text = text.replace("[","")
        text = text.replace("]", "")
        text = re.sub(r'\([^)]*\)', '', text)
        text = text.replace("  ", " ")
        text = text.lower()

        self.text = text

    def punctuateText(self):
        #checks if text is properlly punctuated, if not sends a request to neureal net api that returns punctuated text
        if len(sent_tokenize(self.text)) < (len(self.text)//100):
            #formula that checks if transcript is properlly punctuated, no run on sentences, if average sentence is 100 chars
            punctURL = "http://bark.phon.ioc.ee/punctuator"
            c = pycurl.Curl()
            c.setopt(c.URL, punctURL)
            postfields = "text="+self.text
            postfields = u' '.encode('utf-8').strip()+postfields.encode('utf-8').strip()
            b = BytesIO()
            c.setopt(c.POSTFIELDS, postfields)
            c.setopt(c.WRITEDATA,b)
            c.perform()
            c.close()
            res = str(b.getvalue())
            res = res[2:-2]
            res = res.replace("..",".")
            res = res.replace(".,", ",")
            self.text = res


    def createFreqTable(self, text_string):

        stopWords = set(stopwords.words("english") + list(string.punctuation))
        words = nltk.word_tokenize(text_string)
        ps = PorterStemmer()

        freqTable = dict()

        for word in words:
            word = ps.stem(word)
            if word in stopWords:
                continue
            if word in freqTable:
                freqTable[word] += 1
            else:
                freqTable[word] = 1

        self.freqTable = freqTable

    def setSentences(self,text):
        self.sentences = sent_tokenize(text)
        self.sentences = [i for i in self.sentences if len(i)>=10]

    def scoreSentences(self, sentences, freqTable):

        sentenceValue = dict()

        for sentence in sentences:
            word_count_in_sentence = len(word_tokenize(sentence))
            for wordValue in freqTable:
                if wordValue in sentence:
                    if sentence[:10] in sentenceValue:
                        sentenceValue[sentence[:10]] += freqTable[wordValue]
                    else:
                        sentenceValue[sentence[:10]] = freqTable[wordValue]

            if sentence[:10] in sentenceValue:
                sentenceValue[sentence[:10]] = sentenceValue[sentence[:10]] / word_count_in_sentence
            else:
                sentenceValue[sentence[:10]] = 0

        self.sentenceValue = sentenceValue


    def getAverageScore(self, sentenceValue):
        sumValues = 0
        for entry in sentenceValue:
            sumValues += sentenceValue[entry]

        average = int(sumValues / len(sentenceValue))

        self.average = average


    def getSummary(self, sentences, sentenceValue, threshold):
        sentenceCount = 0
        summary = ''

        for sentence in sentences:
            if sentence[:10] in sentenceValue and sentenceValue[sentence[:10]] > (threshold):
                summary += " " + sentence
                sentenceCount += 1

        tmp = sent_tokenize(summary)

        tmp = [i.capitalize() for i in tmp]
        newSummary = ""

        for i in tmp:
            newSummary += (i+" ")

        newSummary = newSummary[1:]
        firstLetter = newSummary[0].upper()
        newSummary = firstLetter + newSummary[1:]
        self.summary = newSummary

    def returnSummary(self):
        return self.summary
