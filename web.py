from flask import Flask, jsonify, request, abort, render_template
from psycopg2 import sql, connect
from config import Config
from database.db_setup import dbname, user, password
# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker

app = Flask(__name__, template_folder="template")
app.config.from_object(Config)
# db = SQLAlchemy(app)


# def get_session(database_ulr):
#     engine = create_engine(database_ulr)
#     Session = sessionmaker(bind=engine)
#     session = Session()
#     return session


@app.route('/')
def homepage():
    return render_template('index.html')


@app.route('/state_count', methods=['GET'])
def get_value():
    conn = connect(dbname=dbname, user=user, password=password)
    cur = conn.cursor()
    cur.execute("SELECT airports.state, count(*) "
                "FROM flights INNER JOIN airports "
                "ON flights.origin_airport = airports.iata_code "
                "GROUP BY airports.state")
    records = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(records), 200
