create TABLE car (
  id SERIAL NOT NULL PRIMARY KEY,
  name varchar(255) NOT NULL,
  license_plate varchar(255) NOT NULL
);

 create TABLE rent (
  id SERIAL NOT NULL PRIMARY KEY,
  car_id integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  cost INT NOT NULL,
  CONSTRAINT fk_car_id
      FOREIGN KEY (car_id)
        REFERENCES car (id) )
