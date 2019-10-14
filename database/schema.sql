CREATE TABLE airlines (
    iata_code varchar(2) PRIMARY KEY,
    airline varchar(255)
);

CREATE TABLE airports (
    iata_code varchar(3) PRIMARY KEY,
    airport varchar(255),
    city varchar(255),
    state varchar(2),
    country varchar(3),
    latitude float,
    longitude float
);

CREATE TABLE flights (
    year smallint,
    month smallint,
    day smallint,
    day_of_week smallint,
    airline varchar(2),
    flight_number smallint,
    tail_number varchar(6),
    origin_airport varchar(5),
    destination_airport varchar(5),
    scheduled_departure smallint,
    departure_time smallint,
    departure_delay smallint,
    taxi_out smallint,
    wheels_off smallint,
    scheduled_time smallint,
    elapsed_time smallint,
    air_time smallint,
    distance smallint,
    wheels_on smallint,
    taxi_int smallint,
    scheduled_arrival smallint,
    arrival_time smallint,
    arrival_delay smallint,
    diverted smallint,
    cancelled smallint,
    cancellation_reason varchar(255),
    air_system_delay smallint,
    security_delay smallint,
    airline_delay smallint,
    late_aricraft_delay smallint,
    weather_delay smallint
);

