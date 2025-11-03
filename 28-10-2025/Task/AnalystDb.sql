create table analysts(
id int generated always as identity primary key,
name Varchar(40)
)

alter table analysts add column age int;

select * from analysts;