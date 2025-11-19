-- Create a sequence starting at 101
CREATE SEQUENCE emp_id_seq START 101;


-- 1. EMPLOYEE Table
-- create table  employee (
--     id serial primary key,
--     emp_id text unique default 'EMP' || nextval('emp_id_seq'),
--     emp_name varchar(100) not null,
--     emp_email varchar(100) ,
--     product_name varchar(50),
--     emp_role varchar(50),
--     site varchar(50),
--     is_active boolean default false,
--     date_of_joining date
-- );


CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    emp_id TEXT UNIQUE DEFAULT 'EMP' || nextval('emp_id_seq'),
    emp_name VARCHAR(100) NOT NULL,
    emp_email VARCHAR(100) UNIQUE NOT NULL,
    emp_role VARCHAR(50) NOT NULL,
    site VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    date_of_joining DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





-- 2. PRODUCT Table
create sequence product_id_seq start 101;

-- create table product (
--     id serial primary key,
--     product_id text unique default 'PROD' || nextval('product_id_seq'),
--     product_name varchar(50) not null,
--     budget_per_annum decimal(15, 2),
--     total_employees integer default 0,
--     team_lead_name varchar(100)
-- );

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    product_id TEXT UNIQUE DEFAULT 'PROD' || nextval('product_id_seq'),
    product_name VARCHAR(50) UNIQUE NOT NULL,
    budget_per_annum DECIMAL(15, 2) CHECK (budget_per_annum >= 0),
    total_employees INTEGER DEFAULT 0 CHECK (total_employees >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE employee 
    ADD COLUMN product_id INTEGER REFERENCES product(id) ON DELETE SET NULL;

ALTER TABLE product 
    ADD COLUMN team_lead_id INTEGER REFERENCES employee(id) ON DELETE SET NULL;

	-- Make foreign keys nullable so we can insert data
ALTER TABLE employee ALTER COLUMN product_id DROP NOT NULL;
ALTER TABLE product ALTER COLUMN team_lead_id DROP NOT NULL;

-- removing the not null constraint
ALTER TABLE employee ALTER COLUMN emp_email DROP NOT NULL;
ALTER TABLE employee ALTER COLUMN emp_role DROP NOT NULL;

ALTER TABLE employee
ALTER COLUMN is_active SET DEFAULT true;


-- 3. REVENUE Table
create sequence revenue_id_seq start 101;

CREATE TABLE revenue (
    id SERIAL PRIMARY KEY,
    revenue_id TEXT UNIQUE DEFAULT 'REV' || nextval('revenue_id_seq'),
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    month_year DATE NOT NULL,  -- Use DATE instead of VARCHAR
    revenue_amount DECIMAL(15, 2) NOT NULL CHECK (revenue_amount >= 0),
    expense_amount DECIMAL(15, 2) NOT NULL CHECK (expense_amount >= 0),
    profit DECIMAL(15, 2) GENERATED ALWAYS AS (revenue_amount - expense_amount) STORED,
    client_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, month_year)  -- Prevent duplicate entries
);


ALTER TABLE revenue DROP COLUMN profit;

ALTER TABLE revenue
ADD COLUMN profit DECIMAL(15,2) NOT NULL DEFAULT 0;

-- login table

create table  loginTable (
id serial primary key,
username varchar(150) unique,
password varchar(255),
role varchar(50)
);

-- Drop the Tables
drop table if exists loginTable;
drop table if exists employee;
drop table if exists product;
drop table if exists revenue;


-- Select the Tables
select * from loginTable;
select * from employee;
select * from product;
select * from revenue;


alter table loginTable add column product_name VARCHAR(50);

-- making the create new account status
ALTER TABLE employee
ADD COLUMN status VARCHAR(20) DEFAULT 'IN_PROGRESS';

--trigger to know the employee status
CREATE OR REPLACE FUNCTION update_employee_status()
RETURNS TRIGGER AS $$
BEGIN
    -- When admin activates employee
    IF NEW.is_active = TRUE THEN
        NEW.status := 'ACTIVE';
    END IF;

    -- When admin deactivates employee
    IF NEW.is_active = FALSE THEN
        -- If employee was ACTIVE → change to INACTIVE
        IF OLD.status = 'ACTIVE' THEN
            NEW.status := 'INACTIVE';
        END IF;

        -- If employee is IN_PROGRESS → keep IN_PROGRESS
        IF OLD.status = 'IN_PROGRESS' THEN
            NEW.status := 'IN_PROGRESS';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER trg_update_status
BEFORE UPDATE ON employee
FOR EACH ROW
EXECUTE FUNCTION update_employee_status();


-- test users
insert into loginTable (username, password, role, product_name) values
('admin', 'admin123', 'ADMIN', null),
('manager_lims', 'manager123', 'MANAGER', 'LIMS'),
('manager_sdms', 'manager123', 'MANAGER', 'SDMS'),
('emp_lims', 'emp123', 'EMPLOYEE', 'LIMS'),
('emp_sdms', 'emp123', 'EMPLOYEE', 'SDMS');




-- employee audit log
CREATE TABLE employee_audit (
    audit_id SERIAL PRIMARY KEY,
    emp_id INT,
    old_name VARCHAR(100),
    new_name VARCHAR(100),
    old_role VARCHAR(50),
    new_role VARCHAR(50),
    old_salary NUMERIC,
    new_salary NUMERIC,
    action_type VARCHAR(20),      -- UPDATE, INSERT, DELETE
    changed_at TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION fn_employee_audit()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO employee_audit (
        emp_id,
        old_name, new_name,
        old_role, new_role,
        action_type,
        changed_at
    )
    VALUES (
        OLD.id,
        OLD.emp_name, NEW.emp_name,
        OLD.emp_role, NEW.emp_role,
        TG_OP,
        NOW()
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER trg_employee_audit
AFTER UPDATE ON employee
FOR EACH ROW
EXECUTE FUNCTION fn_employee_audit();

-- view the trigger when update
SELECT * FROM employee_audit;
