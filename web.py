from flask import Flask, jsonify, request, abort, render_template
from psycopg2 import sql, connect
from config import Config
from database.db_setup import dbname, user, password

app = Flask(__name__, template_folder="template")
app.config.from_object(Config)

state_id = {'CA': '06',
            'TX': '48',
            'FL': '12',
            'NY': '36',
            'PA': '42',
            'IL': '17',
            'OH': '39',
            'GA': '13',
            'NC': '37',
            'MI': '26',
            'NJ': '34',
            'VA': '51',
            'WA': '53',
            'AZ': '04',
            'MA': '25',
            'TN': '47',
            'IN': '18',
            'MO': '29',
            'MD': '24',
            'WI': '55',
            'CO': '08',
            'MN': '27',
            'SC': '45',
            'AL': '01',
            'LA': '22',
            'KY': '21',
            'OR': '41',
            'OK': '40',
            'CT': '09',
            'UT': '49',
            'IA': '19',
            'NV': '32',
            'AR': '05',
            'MS': '28',
            'KS': '20',
            'NM': '35',
            'NE': '31',
            'WV': '54',
            'ID': '16',
            'HI': '15',
            'NH': '33',
            'ME': '23',
            'MT': '30',
            'RI': '44',
            'DE': '10',
            'SD': '46',
            'ND': '38',
            'AK': '02',
            'VT': '50',
            'WY': '56',
            'DC': '57',
            'AS': '',
            'PR': '',
            'VI': '',
            'GU': ''
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
    records = [[state_id[records[i][0]], records[i][1]]
               for i in range(len(records))
               if records[i][1] != '']
    # records_dir = dict((records[i][0], records[i][1]) for i in range(len(records)))
    return jsonify(records), 200
