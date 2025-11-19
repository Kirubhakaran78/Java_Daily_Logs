create table masterTable(
id int generated always as identity primary key,
username varchar(100),
profileName varchar(100),
email varchar(100),
group_name varchar(100),
site varchar(100),
approve varchar(100)
);

select * from masterTable;

DROP TABLE IF EXISTS masterTable;

Truncate table masterTable;

/* Employee table */
create table emp_table(
id int generated always as identity primary key,
emp_id varchar(100),
emp_name varchar(100),
emp_email varchar(100),
product_name varchar(100),
emp_role varchar(100),
site varchar(100),
approve varchar(100)
);

select * from emp_table;

DROP TABLE IF EXISTS emp_table;

-- Product Table
create table product_table(
id int generated always as identity primary key,
product_id varchar(100),
product_name varchar(100),
budget_per_annum varchar(100),
total_employees varchar(100)
);

select * from product_table;

DROP TABLE IF EXISTS product_table;


select * from loginTable;