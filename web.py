from flask import Flask, jsonify, request, abort, render_template
from psycopg2 import sql, connect
from config import Config
from database.db_setup import dbname, user, password
import csv

app = Flask(__name__, template_folder="template")
app.config.from_object(Config)

with open('state_code.csv', mode='r') as f:
    reader = csv.reader(f)
    next(f)
    state_id = {rows[0]: rows[1] for rows in reader}


@app.route('/')
def homepage():
    return render_template('index.html')


@app.route('/delay_count_by_state', methods=['GET'])
def get_value():
    conn = connect(dbname=dbname, user=user, password=password)
    cur = conn.cursor()
    cur.execute("SELECT airports.state, count(*), count(distinct airports) "
                "FROM flights INNER JOIN airports "
                "ON flights.origin_airport = airports.iata_code "
                "GROUP BY airports.state")
    records = cur.fetchall()
    cur.close()
    conn.close()
    records_dir = [{'id': state_id[records[i][0]], 'count': records[i][1], "airports": records[i][2]}
                   for i in range(len(records))
                   if records[i][1] != '']
    return jsonify(records_dir), 200
