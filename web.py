from flask import Flask, jsonify, request, abort, render_template
from psycopg2 import sql, connect
from config import Config
from database.db_setup import dbname, user, password
import csv
import time

app = Flask(__name__, template_folder="template")
app.config.from_object(Config)

with open('state_code.csv', mode='r') as f:
    reader = csv.reader(f)
    next(f)
    state_id = {rows[0]: rows[1] for rows in reader}
    # state_abbr = {rows[1]: rows[0] for rows in reader}


@app.route('/')
def homepage():
    return render_template('index.html')


@app.route('/delay_count_by_state', methods=['GET'])
def get_delay_count_by_state():
    start_time = time.time()

    conn = connect(dbname=dbname, user=user, password=password)
    cur = conn.cursor()

    connect_time = time.time() - start_time
    app.logger.info("%.1fs for connecting to database from delay count by state API", connect_time)

    cur.execute("SELECT airports.state, count(*), count(distinct airports) "
                "FROM flights INNER JOIN airports "
                "ON flights.origin_airport = airports.iata_code "
                "GROUP BY airports.state;")

    fetch_time = time.time() - start_time
    app.logger.info("%.1fs for fetching delay count through state data", fetch_time)

    records = cur.fetchall()
    cur.close()
    conn.close()
    records_dir = [{'id': state_id[records[i][0]],
                    'abbr': records[i][0],
                    'count': records[i][1],
                    'airports': records[i][2]}
                   for i in range(len(records))
                   if records[i][1] != '']

    return_time = time.time() - start_time
    app.logger.info("%ds for returning delay count by state data", return_time-fetch_time)

    return jsonify(records_dir), 200


@app.route('/delay_count_by_state_week', methods=['GET'])
def get_delay_count_by_state_week():
    start_time = time.time()

    conn = connect(dbname=dbname, user=user, password=password)
    cur = conn.cursor()

    connect_time = time.time() - start_time
    app.logger.info("%.1fs for connecting to database through delay count by week API", connect_time)

    cur.execute("SELECT airports.state, flights.day_of_week, count(*)/count(distinct airports) "
                "FROM flights INNER JOIN airports "
                "ON flights.origin_airport = airports.iata_code "
                "GROUP BY airports.state, flights.day_of_week;")

    fetch_time = time.time() - start_time
    app.logger.info("%.1fs for fetching delay count by week data", fetch_time)

    records = cur.fetchall()
    cur.close()
    conn.close()
    records_dir = [{'id': state_id[records[i][0]],
                    'day_of_week': records[i][1],
                    'count': records[i][2]}
                   for i in range(len(records))
                   if records[i][1] != '']

    return_time = time.time() - start_time
    app.logger.info("%.1fs for returning delay count by week data", return_time-fetch_time)

    return jsonify(records_dir), 200
