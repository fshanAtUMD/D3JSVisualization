from flask import Flask, jsonify, request, abort, render_template
from psycopg2 import sql, connect
from config import Config
from database.db_setup import dbname, user, password

app = Flask(__name__, template_folder="template")
app.config.from_object(Config)

state_id = {'AL': '01',
            'AK': '02',

            'AZ': '04',
            'AR': '05',
            'CA': '06',

            'CO': '08',
            'CT': '09',
            'DE': '10',
            'DC': '11',
            'FL': '12',
            'GA': '13',

            'HI': '15',
            'ID': '16',
            'IL': '17',
            'IN': '18',
            'IA': '19',
            'KS': '20',
            'KY': '21',
            'LA': '22',
            'ME': '23',
            'MD': '24',
            'MA': '25',
            'MI': '26',
            'MN': '27',
            'MS': '28',
            'MO': '29',
            'MT': '30',
            'NE': '31',
            'NV': '32',
            'NH': '33',
            'NJ': '34',
            'NM': '35',
            'NY': '36',
            'NC': '37',
            'ND': '38',
            'OH': '39',
            'OK': '40',
            'OR': '41',
            'PA': '42',

            'RI': '44',
            'SC': '45',
            'SD': '46',
            'TN': '47',
            'TX': '48',
            'UT': '49',
            'VT': '50',
            'VA': '51',

            'WA': '53',
            'WV': '54',
            'WI': '55',
            'WY': '56',

            'AS': '60',
            'GU': '66',
            'CM': '69',
            'PR': '72',
            'VI': '78'
            }


@app.route('/')
def homepage():
    return render_template('index.html')


@app.route('/delay_count_by_state', methods=['GET'])
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
    records_dir = [{'id': state_id[records[i][0]], 'count': records[i][1]}
                   for i in range(len(records))
                   if records[i][1] != '']
    # records_dir = dict((records[i][0], records[i][1]) for i in range(len(records)))
    return jsonify(records_dir), 200
