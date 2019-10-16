from psycopg2 import sql, connect, Error
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

defaultdb = "postgres"
dbname = "a3db"
user = "a3user"
password = "password"


def create_db():
    conn = connect(dbname=defaultdb, user=user, password=password)
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    cur.execute(sql.SQL("CREATE DATABASE {}".format(dbname)))
    print("Database {} created!".format(dbname))
    cur.close()
    conn.close()
    print("PostgreSQL connection closed.")


def import_data():
    conn = connect(dbname=dbname, user=user, password=password)
    cur = conn.cursor()
    cur.execute(open("schema.sql", "r").read())
    conn.commit()
    print("SQL tables created!")
    with open('flight-delays/airlines.csv', 'r') as f:
        next(f)
        cur.copy_from(f, table='airlines', sep=',')
        conn.commit()
    print("Write data to table airlines")
    with open('flight-delays/airports.csv', 'r') as f:
        next(f)
        cur.copy_from(f, table='airports', null='', sep=',')
        conn.commit()
    print("Write data to table airports")
    with open('flight-delays/flights.csv', 'r') as f:
        next(f)
        # for i in range(4385712):
        #     next(f)
        # row = next(f)
        # print (row)
        cur.copy_from(f, table='flights', null='', sep=',')
        conn.commit()
    print("Write data to table flights")

    cur.close()
    conn.close()
    print("PostgreSQL connection closed.")


if __name__ == '__main__':
    create_db()
    import_data()
