import os
import flask
import logging

from termcolor import colored
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from run import bot_money


###--------------------------------------------------------------------------###

app = flask.Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

###--------------------------------------------------------------------------###


def handle_request(func):
    try:
        par = request.json
        logging.info(colored(par, "cyan"))
        response, status_code = func(par)
        return response, status_code
    except Exception as e:
        logging.error(str(e))
        return {"error": str(e)}, 500

@app.route("/callback", methods=["POST"])
def summary_route2():
    return "hello"

@app.route("/bot", methods=["POST"])
@cross_origin()
def summary_route():
    return handle_request(bot_money)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000,debug=False)