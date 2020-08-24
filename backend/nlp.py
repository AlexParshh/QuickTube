from youtube_transcript_api import YouTubeTranscriptApi
import nltk
import re
import string
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize, sent_tokenize
nltk.download('punkt')


transcript = YouTubeTranscriptApi.get_transcript("6Af6b_wyiwI")

def cleanTranscript(trans):
    text = ""

    for i in trans:
        text += i['text']

    text = text.replace(".", ". ")
    text = text.replace(",", ", ")
    text = text.replace("\n", " ")
    text = re.sub(r'\([^)]*\)', '', text)
    text = text.lower()

    return text


def createFreqTable(text_string):

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

    return freqTable


text = cleanTranscript(transcript)

freqTable = createFreqTable(text)

sentences = sent_tokenize(text)

def scoreSentences(sentences, freqTable):

    sentenceValue = dict()

    for sentence in sentences:
        word_count_in_sentence = len(word_tokenize(sentence))
        for wordValue in freqTable:
            if wordValue in sentence:
                if sentence[:10] in sentenceValue:
                    sentenceValue[sentence[:10]] += freqTable[wordValue]
                else:
                    sentenceValue[sentence[:10]] = freqTable[wordValue]

        sentenceValue[sentence[:10]] = sentenceValue[sentence[:10]] / word_count_in_sentence

    return sentenceValue

sentenceScores = scoreSentences(sentences,freqTable)

def getAverageScore(sentenceValue):
    sumValues = 0
    for entry in sentenceValue:
        sumValues += sentenceValue[entry]

    average = int(sumValues / len(sentenceValue))

    return average

threshold = getAverageScore(sentenceScores)

def getSummary(sentences, sentenceValue, threshold):
    sentenceCount = 0
    summary = ''

    for sentence in sentences:
        if sentence[:10] in sentenceValue and sentenceValue[sentence[:10]] > (threshold):
            summary += " " + sentence
            sentenceCount += 1

    return summary

print(getSummary(sentences,sentenceScores, threshold*1.5))