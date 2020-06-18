\c pr

CREATE TYPE job_type AS ENUM ('A', 'B');

create table records(
    employee_id int not null,
    hours_worked float not null,
    job_group job_type not null,
    date DATE not null,
    PRIMARY KEY(employee_id, date)
);

create table aggro_records(
    employee_id int not null,
    pay float not null,
    date DATE not null,
    PRIMARY KEY(employee_id, date)
);
