-- =====================================================
-- EMPLOYEE MANAGEMENT SYSTEM - DATABASE SCHEMA
-- =====================================================

-- Drop existing tables (if needed for fresh setup)
DROP TABLE IF EXISTS employee_audit CASCADE;
DROP TABLE IF EXISTS revenue CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS loginTable CASCADE;

-- Drop sequences
DROP SEQUENCE IF EXISTS emp_id_seq CASCADE;
DROP SEQUENCE IF EXISTS product_id_seq CASCADE;
DROP SEQUENCE IF EXISTS revenue_id_seq CASCADE;

-- =====================================================
-- SEQUENCES
-- =====================================================

CREATE SEQUENCE emp_id_seq START 101;
CREATE SEQUENCE product_id_seq START 101;
CREATE SEQUENCE revenue_id_seq START 101;

-- =====================================================
-- TABLE: loginTable
-- =====================================================

CREATE TABLE loginTable (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    product_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: product
-- =====================================================

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    product_id TEXT UNIQUE DEFAULT 'PROD' || nextval('product_id_seq'),
    product_name VARCHAR(50) UNIQUE NOT NULL,
    budget_per_annum DECIMAL(15, 2) CHECK (budget_per_annum >= 0),
    total_employees INTEGER DEFAULT 0 CHECK (total_employees >= 0),
    team_lead_id INTEGER,  -- FK to employee (added later)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: employee
-- =====================================================

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    emp_id TEXT UNIQUE DEFAULT 'EMP' || nextval('emp_id_seq'),
    emp_name VARCHAR(100) NOT NULL,
    emp_email VARCHAR(100) UNIQUE,
    emp_role VARCHAR(50),
    product_id INTEGER REFERENCES product(id) ON DELETE SET NULL,
    site VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'IN_PROGRESS',
    date_of_joining DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for team_lead_id
ALTER TABLE product 
    ADD CONSTRAINT fk_team_lead 
    FOREIGN KEY (team_lead_id) 
    REFERENCES employee(id) 
    ON DELETE SET NULL;

-- =====================================================
-- TABLE: revenue
-- =====================================================

CREATE TABLE revenue (
    id SERIAL PRIMARY KEY,
    revenue_id TEXT UNIQUE DEFAULT 'REV' || nextval('revenue_id_seq'),
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    month_year DATE NOT NULL,
    revenue_amount DECIMAL(15, 2) NOT NULL CHECK (revenue_amount >= 0),
    expense_amount DECIMAL(15, 2) NOT NULL CHECK (expense_amount >= 0),
    profit DECIMAL(15, 2) NOT NULL DEFAULT 0,
    client_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, month_year)
);

-- =====================================================
-- TABLE: employee_audit (Audit Log)
-- =====================================================

CREATE TABLE employee_audit (
    audit_id SERIAL PRIMARY KEY,
    emp_id INTEGER,
    old_name VARCHAR(100),
    new_name VARCHAR(100),
    old_role VARCHAR(50),
    new_role VARCHAR(50),
    action_type VARCHAR(20),  -- UPDATE, INSERT, DELETE
    changed_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Function: Update employee status based on is_active
CREATE OR REPLACE FUNCTION update_employee_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_active = TRUE THEN
        NEW.status := 'ACTIVE';
    ELSIF NEW.is_active = FALSE THEN
        IF OLD.status = 'ACTIVE' THEN
            NEW.status := 'INACTIVE';
        ELSIF OLD.status = 'IN_PROGRESS' THEN
            NEW.status := 'IN_PROGRESS';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update status on employee changes
CREATE TRIGGER trg_update_status
BEFORE UPDATE ON employee
FOR EACH ROW
EXECUTE FUNCTION update_employee_status();

-- Function: Audit employee changes
CREATE OR REPLACE FUNCTION fn_employee_audit()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO employee_audit (
        emp_id,
        old_name, 
        new_name,
        old_role, 
        new_role,
        action_type,
        changed_at
    )
    VALUES (
        OLD.id,
        OLD.emp_name, 
        NEW.emp_name,
        OLD.emp_role, 
        NEW.emp_role,
        TG_OP,
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Audit employee updates
CREATE TRIGGER trg_employee_audit
AFTER UPDATE ON employee
FOR EACH ROW
EXECUTE FUNCTION fn_employee_audit();

INSERT INTO loginTable (username, password, role, product_name) VALUES
('admin', 'admin123', 'ADMIN', NULL),
('manager_lims', 'manager123', 'MANAGER', 'LIMS'),
('manager_sdms', 'manager123', 'MANAGER', 'SDMS'),
('emp_lims', 'emp123', 'EMPLOYEE', 'LIMS'),
('emp_sdms', 'emp123', 'EMPLOYEE', 'SDMS');


-- View all tables
SELECT * FROM loginTable;
SELECT * FROM employee;
SELECT * FROM product;
SELECT * FROM revenue;
SELECT * FROM employee_audit;

-- Remove status trigger
-- DROP TRIGGER IF EXISTS trg_update_status ON employee;
-- DROP FUNCTION IF EXISTS update_employee_status();

-- (Optional) if you ALSO don't want audit
-- DROP TRIGGER IF EXISTS trg_employee_audit ON employee;
-- DROP FUNCTION IF EXISTS fn_employee_audit();


-- =====================================================
-- LIMS Revenue Data (Product ID: 1)
-- =====================================================

-- 2023 Data
INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount, profit, client_name) VALUES
(1, '2023-01-01', 450000, 180000, 270000, 'Pharma Labs Inc'),
(1, '2023-02-01', 520000, 195000, 325000, 'BioTech Solutions'),
(1, '2023-03-01', 480000, 175000, 305000, 'MediCare Research'),
(1, '2023-04-01', 510000, 190000, 320000, 'Global Diagnostics'),
(1, '2023-05-01', 495000, 185000, 310000, 'HealthFirst Labs'),
(1, '2023-06-01', 530000, 200000, 330000, 'Clinical Partners'),
(1, '2023-07-01', 560000, 210000, 350000, 'Research Dynamics'),
(1, '2023-08-01', 545000, 205000, 340000, 'Lab Innovations'),
(1, '2023-09-01', 525000, 198000, 327000, 'Science Corp'),
(1, '2023-10-01', 580000, 220000, 360000, 'Diagnostic Plus'),
(1, '2023-11-01', 595000, 225000, 370000, 'MedTech Systems'),
(1, '2023-12-01', 610000, 230000, 380000, 'Quality Labs');

-- 2024 Data
INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount, profit, client_name) VALUES
(1, '2024-01-01', 620000, 235000, 385000, 'Pharma Labs Inc'),
(1, '2024-02-01', 650000, 245000, 405000, 'BioTech Solutions'),
(1, '2024-03-01', 630000, 240000, 390000, 'MediCare Research'),
(1, '2024-04-01', 680000, 255000, 425000, 'Global Diagnostics'),
(1, '2024-05-01', 695000, 260000, 435000, 'HealthFirst Labs'),
(1, '2024-06-01', 710000, 270000, 440000, 'Clinical Partners'),
(1, '2024-07-01', 725000, 275000, 450000, 'Research Dynamics'),
(1, '2024-08-01', 740000, 280000, 460000, 'Lab Innovations'),
(1, '2024-09-01', 730000, 278000, 452000, 'Science Corp'),
(1, '2024-10-01', 765000, 290000, 475000, 'Diagnostic Plus'),
(1, '2024-11-01', 780000, 295000, 485000, 'MedTech Systems'),
(1, '2024-12-01', 800000, 300000, 500000, 'Quality Labs');

-- 2025 Data (Jan-Nov)
INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount, profit, client_name) VALUES
(1, '2025-01-01', 820000, 310000, 510000, 'Pharma Labs Inc'),
(1, '2025-02-01', 850000, 320000, 530000, 'BioTech Solutions'),
(1, '2025-03-01', 840000, 315000, 525000, 'MediCare Research'),
(1, '2025-04-01', 880000, 330000, 550000, 'Global Diagnostics'),
(1, '2025-05-01', 895000, 338000, 557000, 'HealthFirst Labs'),
(1, '2025-06-01', 920000, 345000, 575000, 'Clinical Partners'),
(1, '2025-07-01', 935000, 352000, 583000, 'Research Dynamics'),
(1, '2025-08-01', 950000, 360000, 590000, 'Lab Innovations'),
(1, '2025-09-01', 945000, 358000, 587000, 'Science Corp'),
(1, '2025-10-01', 980000, 370000, 610000, 'Diagnostic Plus'),
(1, '2025-11-01', 1000000, 380000, 620000, 'MedTech Systems');

-- =====================================================
-- SDMS Revenue Data (Product ID: 2)
-- =====================================================

-- 2023 Data
INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount, profit, client_name) VALUES
(2, '2023-01-01', 380000, 150000, 230000, 'DataSecure Inc'),
(2, '2023-02-01', 420000, 165000, 255000, 'InfoTech Corp'),
(2, '2023-03-01', 395000, 155000, 240000, 'Cloud Systems'),
(2, '2023-04-01', 430000, 170000, 260000, 'Digital Solutions'),
(2, '2023-05-01', 415000, 162000, 253000, 'Tech Innovators'),
(2, '2023-06-01', 445000, 175000, 270000, 'Data Masters'),
(2, '2023-07-01', 460000, 182000, 278000, 'Secure Networks'),
(2, '2023-08-01', 450000, 178000, 272000, 'Tech Alliance'),
(2, '2023-09-01', 435000, 172000, 263000, 'Digital Hub'),
(2, '2023-10-01', 475000, 188000, 287000, 'Info Solutions'),
(2, '2023-11-01', 490000, 193000, 297000, 'Cloud Partners'),
(2, '2023-12-01', 505000, 200000, 305000, 'Data Dynamics');

-- 2024 Data
INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount, profit, client_name) VALUES
(2, '2024-01-01', 520000, 205000, 315000, 'DataSecure Inc'),
(2, '2024-02-01', 550000, 217000, 333000, 'InfoTech Corp'),
(2, '2024-03-01', 535000, 211000, 324000, 'Cloud Systems'),
(2, '2024-04-01', 570000, 225000, 345000, 'Digital Solutions'),
(2, '2024-05-01', 585000, 230000, 355000, 'Tech Innovators'),
(2, '2024-06-01', 600000, 237000, 363000, 'Data Masters'),
(2, '2024-07-01', 615000, 243000, 372000, 'Secure Networks'),
(2, '2024-08-01', 630000, 248000, 382000, 'Tech Alliance'),
(2, '2024-09-01', 620000, 245000, 375000, 'Digital Hub'),
(2, '2024-10-01', 650000, 256000, 394000, 'Info Solutions'),
(2, '2024-11-01', 665000, 262000, 403000, 'Cloud Partners'),
(2, '2024-12-01', 680000, 268000, 412000, 'Data Dynamics');

-- 2025 Data (Jan-Nov)
INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount, profit, client_name) VALUES
(2, '2025-01-01', 700000, 275000, 425000, 'DataSecure Inc'),
(2, '2025-02-01', 730000, 287000, 443000, 'InfoTech Corp'),
(2, '2025-03-01', 715000, 281000, 434000, 'Cloud Systems'),
(2, '2025-04-01', 750000, 295000, 455000, 'Digital Solutions'),
(2, '2025-05-01', 765000, 301000, 464000, 'Tech Innovators'),
(2, '2025-06-01', 785000, 309000, 476000, 'Data Masters'),
(2, '2025-07-01', 800000, 315000, 485000, 'Secure Networks'),
(2, '2025-08-01', 815000, 321000, 494000, 'Tech Alliance'),
(2, '2025-09-01', 810000, 319000, 491000, 'Digital Hub'),
(2, '2025-10-01', 840000, 330000, 510000, 'Info Solutions'),
(2, '2025-11-01', 860000, 338000, 522000, 'Cloud Partners');

-- =====================================================
-- ELN Revenue Data (Product ID: 3)
-- =====================================================

-- 2023 Data
INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount, profit, client_name) VALUES
(3, '2023-01-01', 320000, 128000, 192000, 'Research Labs'),
(3, '2023-02-01', 355000, 140000, 215000, 'Science Hub'),
(3, '2023-03-01', 340000, 135000, 205000, 'Lab Tech Inc'),
(3, '2023-04-01', 370000, 145000, 225000, 'Experiment Pro'),
(3, '2023-05-01', 360000, 142000, 218000, 'Research Plus'),
(3, '2023-06-01', 385000, 152000, 233000, 'Lab Solutions'),
(3, '2023-07-01', 400000, 158000, 242000, 'Science Works'),
(3, '2023-08-01', 390000, 154000, 236000, 'Tech Research'),
(3, '2023-09-01', 375000, 148000, 227000, 'Lab Partners'),
(3, '2023-10-01', 415000, 164000, 251000, 'Research Co'),
(3, '2023-11-01', 430000, 170000, 260000, 'Science Group'),
(3, '2023-12-01', 445000, 176000, 269000, 'Lab Experts');

-- 2024 Data
INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount, profit, client_name) VALUES
(3, '2024-01-01', 460000, 181000, 279000, 'Research Labs'),
(3, '2024-02-01', 485000, 191000, 294000, 'Science Hub'),
(3, '2024-03-01', 475000, 187000, 288000, 'Lab Tech Inc'),
(3, '2024-04-01', 505000, 199000, 306000, 'Experiment Pro'),
(3, '2024-05-01', 520000, 205000, 315000, 'Research Plus'),
(3, '2024-06-01', 535000, 211000, 324000, 'Lab Solutions'),
(3, '2024-07-01', 550000, 217000, 333000, 'Science Works'),
(3, '2024-08-01', 565000, 223000, 342000, 'Tech Research'),
(3, '2024-09-01', 555000, 219000, 336000, 'Lab Partners'),
(3, '2024-10-01', 580000, 229000, 351000, 'Research Co'),
(3, '2024-11-01', 595000, 235000, 360000, 'Science Group'),
(3, '2024-12-01', 610000, 241000, 369000, 'Lab Experts');

-- 2025 Data (Jan-Nov)
INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount, profit, client_name) VALUES
(3, '2025-01-01', 630000, 248000, 382000, 'Research Labs'),
(3, '2025-02-01', 655000, 258000, 397000, 'Science Hub'),
(3, '2025-03-01', 645000, 254000, 391000, 'Lab Tech Inc'),
(3, '2025-04-01', 675000, 266000, 409000, 'Experiment Pro'),
(3, '2025-05-01', 690000, 272000, 418000, 'Research Plus'),
(3, '2025-06-01', 710000, 280000, 430000, 'Lab Solutions'),
(3, '2025-07-01', 725000, 286000, 439000, 'Science Works'),
(3, '2025-08-01', 740000, 292000, 448000, 'Tech Research'),
(3, '2025-09-01', 735000, 290000, 445000, 'Lab Partners'),
(3, '2025-10-01', 765000, 302000, 463000, 'Research Co'),
(3, '2025-11-01', 785000, 310000, 475000, 'Science Group');

-- =====================================================
-- DMS Revenue Data (Product ID: 4)
-- =====================================================

-- 2023 Data
INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount, profit, client_name) VALUES
(4, '2023-01-01', 280000, 110000, 170000, 'DocuStore Inc'),
(4, '2023-02-01', 310000, 122000, 188000, 'FileManage Pro'),
(4, '2023-03-01', 295000, 116000, 179000, 'Document Hub'),
(4, '2023-04-01', 325000, 128000, 197000, 'Archive Solutions'),
(4, '2023-05-01', 315000, 124000, 191000, 'Data Archive'),
(4, '2023-06-01', 340000, 134000, 206000, 'DocuTech Corp'),
(4, '2023-07-01', 355000, 140000, 215000, 'File Systems'),
(4, '2023-08-01', 345000, 136000, 209000, 'Document Pro'),
(4, '2023-09-01', 330000, 130000, 200000, 'Archive Plus'),
(4, '2023-10-01', 370000, 146000, 224000, 'DocuWorks'),
(4, '2023-11-01', 385000, 152000, 233000, 'File Masters'),
(4, '2023-12-01', 400000, 158000, 242000, 'Document Co');

-- 2024 Data
INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount, profit, client_name) VALUES
(4, '2024-01-01', 415000, 163000, 252000, 'DocuStore Inc'),
(4, '2024-02-01', 440000, 173000, 267000, 'FileManage Pro'),
(4, '2024-03-01', 430000, 169000, 261000, 'Document Hub'),
(4, '2024-04-01', 460000, 181000, 279000, 'Archive Solutions'),
(4, '2024-05-01', 475000, 187000, 288000, 'Data Archive'),
(4, '2024-06-01', 490000, 193000, 297000, 'DocuTech Corp'),
(4, '2024-07-01', 505000, 199000, 306000, 'File Systems'),
(4, '2024-08-01', 520000, 205000, 315000, 'Document Pro'),
(4, '2024-09-01', 510000, 201000, 309000, 'Archive Plus'),
(4, '2024-10-01', 535000, 211000, 324000, 'DocuWorks'),
(4, '2024-11-01', 550000, 217000, 333000, 'File Masters'),
(4, '2024-12-01', 565000, 223000, 342000, 'Document Co');

-- 2025 Data (Jan-Nov)
INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount, profit, client_name) VALUES
(4, '2025-01-01', 585000, 230000, 355000, 'DocuStore Inc'),
(4, '2025-02-01', 610000, 240000, 370000, 'FileManage Pro'),
(4, '2025-03-01', 600000, 236000, 364000, 'Document Hub'),
(4, '2025-04-01', 630000, 248000, 382000, 'Archive Solutions'),
(4, '2025-05-01', 645000, 254000, 391000, 'Data Archive'),
(4, '2025-06-01', 665000, 262000, 403000, 'DocuTech Corp'),
(4, '2025-07-01', 680000, 268000, 412000, 'File Systems'),
(4, '2025-08-01', 695000, 274000, 421000, 'Document Pro'),
(4, '2025-09-01', 690000, 272000, 418000, 'Archive Plus'),
(4, '2025-10-01', 720000, 284000, 436000, 'DocuWorks'),
(4, '2025-11-01', 740000, 292000, 448000, 'File Masters');


