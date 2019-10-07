from flask import Flask, jsonify, request, abort, render_template

app = Flask(__name__, template_folder="template")


@app.route('/')
def homepage():
    return render_template('index.html')


@app.route('/visualization')
def get_value():

    return '', 200
