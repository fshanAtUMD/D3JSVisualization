from psycopg2 import sql, connect, Error
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
# from sqlalchemy import Column, Integer, String
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import relationships

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

# # ORM
# Base = declarative_base()
#
#
# class Airlines(Base):
#     __tablename__ = 'airlines'
#
#     iata_code = Column(int, primary_key=True)
#     airline = Column(String(255))
#
#
# class Airports(Base):
#     __tablename__ = 'airports'
#
#     iata_code = Column(int, primary_key=True)
#     airport = Column(String(255))
#     city = Column(String(255))
#     state = Column(String(255))
#     country = Column(float)
#     latitude = Column(float)
#
# class Flights(Base):
#     __tablename__ = 'flights'
#
#     year = Column(int)
#     month = Column(int)
#     day = Column(int)
#     day_of_week = Column(int)
#     airline = Column(String(2))
#     flight_number = Column(int, primary_key=True)
#


if __name__ == '__main__':
    create_db()
    import_data()
