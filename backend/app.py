from flask import Flask, request, jsonify, json, make_response
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/checkString", methods = ['POST'])
def check_overlapping_chars():
    requestData = json.loads(request.data)
    mainWord = requestData['mainWord'].strip()
    searchWord = requestData['searchWord'].strip()
    if mainWord == '' or searchWord == '':
        response = make_response(
                            jsonify(
                                {"message": "Please check your input again!"}
                            ),
                            200,
                        )
        response.headers["Content-Type"] = "application/json"
        return response
    matchedChars  = ''
    for i in searchWord:
        charLocation = mainWord.find(i)
        if charLocation >= 0:
            matchedChars   = matchedChars + i
            mainWord        = mainWord[charLocation:] #strip the word to avoid searching in the former part of it

    response = make_response(
                    jsonify(
                        {"chars": matchedChars, "count": len(matchedChars)}
                    ),
                    200,
                )
    response.headers["Content-Type"] = "application/json"
    return response
