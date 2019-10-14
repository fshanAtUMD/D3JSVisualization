from flask import Flask, jsonify, request, abort, render_template
from flask_sqlalchemy import SQLAlchemy
from . import db

app = Flask(__name__, template_folder="template")
db = app.db

@app.route('/')
def homepage():
    return render_template('index.html')


@app.route('/visualization')
def get_value():

    return '', 200
