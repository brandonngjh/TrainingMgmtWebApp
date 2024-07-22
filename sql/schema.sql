CREATE DATABASE IF NOT EXISTS training_app;
USE training_app;

CREATE TABLE user_credentials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- TODO: REDUNDANT, REMOVE
CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- TODO: REDUNDANT, REMOVE
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department_id BIGINT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);


CREATE TABLE employees (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL DEFAULT 'temp@gmail.com',
    hire_date DATE,
    designation VARCHAR(255),

    -- Redundant?
    division VARCHAR(255),
    department_id BIGINT,
    job_id BIGINT,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE trainings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    validity_period INT,
    training_provider VARCHAR(255)
);

CREATE TABLE relevant_trainings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT,
    training_id BIGINT,
    validity ENUM('Valid', 'Expired', 'NA') DEFAULT 'NA',
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (training_id) REFERENCES trainings(id)
);

CREATE TABLE employees_trainings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT,
    training_id BIGINT,
    status ENUM('Completed', 'Scheduled') NOT NULL,
    start_date DATE,
    end_date DATE,
    expiry_date DATE,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (training_id) REFERENCES trainings(id),
    INDEX (employee_id, training_id)
);

CREATE TABLE skills_report (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    job_name VARCHAR(255) NOT NULL,
    training_course VARCHAR(255) NOT NULL,
    validity VARCHAR(50) NOT NULL,
    UNIQUE (employee_id, training_course)
);

-- Additional Indexes for performance
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_training_title ON trainings(title);
CREATE INDEX idx_employee_id ON skills_report(employee_id);

-- Stored procedure to enroll an employee in a training
DELIMITER $$
CREATE PROCEDURE EnrollEmployeeInTraining (
    IN p_employee_id BIGINT,
    IN p_training_id BIGINT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    INSERT INTO employees_trainings (employee_id, training_id, status, start_date, end_date)
    VALUES (p_employee_id, p_training_id, 'Scheduled', p_start_date, p_end_date);
END $$
DELIMITER ;

INSERT INTO user_credentials (username, password, role) VALUES
('admin', 'admin', 'admin'),
('hr', 'hr', 'hr'),
('hod', 'hod', 'hod');

-- Redundant?
INSERT INTO departments (name) VALUES ('Machining');
INSERT INTO jobs (name, department_id)
VALUES ( 'Job1', (SELECT id FROM departments WHERE name = 'Machining'));

INSERT INTO employees (id, name, email, designation)
VALUES
    (294, 'Robert Destreza', 'temp@gmail.com',  'Production Machining HOD'),
    (523, 'Ashikin Binti Ibrahim', 'temp@gmail.com',  'Production/MES Planner'),
    (897, 'Min Htet Kyaw', 'temp@gmail.com',  'Assitant Planner'),
    (923, 'Myat Naing Maw', 'temp@gmail.com',  'Material Planner'),
    (969, 'Ernest Bryan Buenacida', 'temp@gmail.com',  'MES Planner'),
    (363, 'Mangawang Benjo Tejada', 'temp@gmail.com',  'Production Supervisor (Machining)'),
    (875, 'Fery Suwandri Wijaya', 'temp@gmail.com',  'Big Format Leader'),
    (878, 'Heri Nurul Huda', 'temp@gmail.com',  'Big Format Machinist Setter'),
    (968, 'Franclin Cole Vitug', 'temp@gmail.com',  'CNC Machine Operator'),
    (530, 'Danial Haikal Bin Badrol Sham', 'temp@gmail.com',  'Fanuc Leader/Machinist'),
    (862, 'Dileep Kumar', 'temp@gmail.com',  'Fanuc Machinist Setter'),
    (815, 'Zaw Lin Naing', 'temp@gmail.com',  'CNC Machine Operator'),
    -- (694, 'Khaing Soe Wai', 'temp@gmail.com',  'CNC Machine Operator'),
    -- (937, 'Tin Lin Aung', 'temp@gmail.com',  'CNC Machine Operator'),
    -- (811, 'Gopinathan Nair Anish Kumar', 'temp@gmail.com',  'Slim3N Leader/Machinist'),
    -- (510, 'Chand Dhan Bahadur', 'temp@gmail.com',  'CNC Machine Operator'),
    (680, 'Gauj Kazi', 'temp@gmail.com',  'CNC Machine Operator'),
    (894, 'San Ko Win', 'temp@gmail.com',  'CNC Machine Operator'),
    (539, 'Bashir Muhammad', 'temp@gmail.com',  'CNC Machine Operator'),
    (781, 'Kottaisamy Arjunan', 'temp@gmail.com',  'PS105 Leader/Machinist'),
    -- (802, 'Basanta Rai', 'temp@gmail.com',  'CNC Machine Operator'),
    -- (682, 'Mir Rabby Saddam', 'temp@gmail.com',  'CNC Machine Operator'),
    (944, 'Tham Wai Seng', 'temp@gmail.com',  'J300 Machinist Setter'),
    (895, 'Kaung Khant Zaw', 'temp@gmail.com',  'CNC Machine Operator'),
    (2, 'See Seng Giap', 'temp@gmail.com',  'Production Supervisor (Conventional)'),
    (23, 'Muhamad Al Amin Bin Md Surep', 'temp@gmail.com',  'Buffer Leader'),
    (392, 'Muhammad Riduan Bin Mohd Misman', 'temp@gmail.com',  'Buffer'),
    -- (645, 'Mohd Shahrul Nizam Bin Nordin', 'temp@gmail.com',  'Buffer'),
    -- (790, 'Aung Myint Thein', 'temp@gmail.com',  'Buffer'),
    -- (490, 'Surindra Mahato', 'temp@gmail.com',  'Buffer'),
    -- (349, 'Manlabian Ernesto JR Ramon', 'temp@gmail.com',  'Tool Crib Leader'),
    -- (805, 'Mahesh Nepali', 'temp@gmail.com',  'Tooling operator'),
    -- (678, 'Hossain MD Jubayer', 'temp@gmail.com',  'Conventional Grinding'),
    -- (703, 'Myo Min Oo', 'temp@gmail.com',  'Saw cut'),
    (733, 'Phyo That Hlaing', 'temp@gmail.com',  'Chip Cleaner'),
    (832, 'Aktaruzzaman Md', 'temp@gmail.com',  'Chip Cleaner'),
    (838, 'Rayhan Md', 'temp@gmail.com',  'Chip Cleaner'),
    (177, 'Muhammad Syafiq Bin Abdul Razak', 'temp@gmail.com',  'Assembly Leader'),
    (587, 'Jaiswal Pashupati Nath', 'temp@gmail.com',  'Assembly'),
    (69, 'Mohd Sapuan Bin Othmar', 'temp@gmail.com',  'Maintenance Leader'),
    -- (812, 'Htet Wai Oo', 'temp@gmail.com',  'Maintenance'),
    -- (693, 'Kyaw San Htwe', 'temp@gmail.com',  'Maintenance'),
    -- (833, 'Hosion MD Saddam', 'temp@gmail.com',  'Maintenance/Construction'),
    (935, 'Thein Kyaw', 'temp@gmail.com',  'Maintenance/Construction'),
    (978, 'Rukesh a/l Ravendran', 'temp@gmail.com',  'Machinist'),
    (504, 'Sah Fulgendra', 'temp@gmail.com',  'Maintenance/Construction'),
    (22, 'Brandon', 'temp@gmail.com',  'Maintenance/Construction'),
    (21, 'Bob', 'temp@gmail.com',  'Maintenance/Construction');

INSERT INTO trainings (title, description, validity_period)
VALUES
    ('AS 9100D AWARNESS', 'EXTERNAL', 365),
    ('COUNTERFEIT', 'INTERNAL', 365),
    ('FOD', 'INTERNAL', 365),
    ('IQA TRAINING AS9100D', 'EXTERNAL', 365),
    ('SAFETY AWARENESS (PPE)', 'INTERNAL', 365),
    ('MEASUREMENT AND CALIBRATION', 'INTERNAL', 365),
    ('MACHINING PHASE 1', 'INTERNAL', 365),
    ('MACHINING PHASE 2', 'INTERNAL', 365),
    ('DEBURING AND BUFFING', 'INTERNAL', 720),
    ('PROCESS MANAGEMENT PLANNING', 'INTERNAL', 720),
    ('NC PROGRAMME', 'INTERNAL', 720),
    ('GD&T', 'INTERNAL', 720),
    ('5S', 'INTERNAL', 720);
    -- ('ENGINEERING MANAGEMENT', 'INTERNAL', 365),
    -- ('TOOLS (JIG & FITURES)', 'INTERNAL', 365),
    -- ('DRAWING INTERPERTATION', 'INTERNAL', 365),
    -- ('QUALITY AWARNESS', 'INTERNAL', 365),
    -- ('MES SYSTEM', 'INTERNAL', 365);

INSERT INTO relevant_trainings(employee_id, training_id, validity)
VALUES
(22, (SELECT id FROM trainings WHERE title = 'COUNTERFEIT'), 'NA'),
(22, (SELECT id FROM trainings WHERE title = 'MEASUREMENT AND CALIBRATION'), 'NA'),
(22, (SELECT id FROM trainings WHERE title = 'FOD'), 'expired'),

(21, (SELECT id FROM trainings WHERE title = 'SAFETY AWARENESS (PPE)'), 'valid'),
(21, (SELECT id FROM trainings WHERE title = 'FOD'), 'valid'),
(21, (SELECT id FROM trainings WHERE title = 'IQA TRAINING AS9100D'), 'NA'),

(504, (SELECT id FROM trainings WHERE title = 'GD&T'), 'valid'),
(504, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 1'), 'valid'),
(504, (SELECT id FROM trainings WHERE title = 'MEASUREMENT AND CALIBRATION'), 'valid'),

(23, (SELECT id FROM trainings WHERE title = 'DEBURING AND BUFFING'), 'valid'),
(23, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 1'), 'valid'),

(587, (SELECT id FROM trainings WHERE title = 'COUNTERFEIT'), 'expired'),
(587, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 1'), 'valid'),
(587, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 2'), 'valid'),

(2, (SELECT id FROM trainings WHERE title = 'PROCESS MANAGEMENT PLANNING'), 'valid'),
(2, (SELECT id FROM trainings WHERE title = '5S'), 'valid'),
(2, (SELECT id FROM trainings WHERE title = 'IQA TRAINING AS9100D'), 'NA');


INSERT INTO employees_trainings (employee_id, training_id, status, start_date, end_date, expiry_date) VALUES

(22, (SELECT id FROM trainings WHERE title = 'COUNTERFEIT'), 'Scheduled', '2024-09-01', '2024-09-29', '2025-09-29'),
(22, (SELECT id FROM trainings WHERE title = 'MEASUREMENT AND CALIBRATION'), 'Scheduled', '2024-09-15', '2024-10-20', '2025-10-20'),
(22, (SELECT id FROM trainings WHERE title = 'FOD'), 'Completed', '2022-10-01', '2022-10-02', '2023-11-02'),

(21, (SELECT id FROM trainings WHERE title = 'SAFETY AWARENESS (PPE)'), 'Completed', '2024-01-16', '2024-01-18', '2025-01-18'),
(21, (SELECT id FROM trainings WHERE title = 'FOD'), 'Completed', '2023-06-10', '2024-06-14', '2025-06-14'),
(21, (SELECT id FROM trainings WHERE title = 'IQA TRAINING AS9100D'), 'Scheduled', '2024-08-15', '2024-08-29', '2025-08-29'),

(504, (SELECT id FROM trainings WHERE title = 'GD&T'), 'Completed', '2022-11-30', '2022-12-05', '2024-12-05'),
(504, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 1'), 'Completed', '2024-04-24', '2024-04-26', '2025-04-26'),
(504, (SELECT id FROM trainings WHERE title = 'MEASUREMENT AND CALIBRATION'), 'Completed', '2024-02-18', '2024-02-22', '2025-02-22'),

(23, (SELECT id FROM trainings WHERE title = 'DEBURING AND BUFFING'), 'Completed', '2023-06-10', '2024-06-14', '2025-06-14'),
(23, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 1'), 'Completed', '2023-08-15', '2023-08-29', '2024-08-29'),

(587, (SELECT id FROM trainings WHERE title = 'COUNTERFEIT'), 'Completed', '2022-11-30', '2022-12-05', '2023-12-05'),
(587, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 1'), 'Completed', '2024-04-24', '2024-04-26', '2025-04-26'),
(587, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 2'), 'Completed', '2024-02-18', '2024-02-22', '2025-02-22'),

(2, (SELECT id FROM trainings WHERE title = 'PROCESS MANAGEMENT PLANNING'), 'Completed', '2024-05-01', '2024-05-10', '2025-05-10'),
(2, (SELECT id FROM trainings WHERE title = '5S'), 'Completed', '2022-10-01', '2022-10-02', '2024-10-02'),
(2, (SELECT id FROM trainings WHERE title = 'IQA TRAINING AS9100D'), 'Scheduled', '2024-09-15', '2024-10-20', '2025-10-20');

-- Populate the skills_report table
INSERT INTO skills_report (employee_id, employee_name, department_name, job_name, training_course, validity)
SELECT
    e.id AS employee_id,
    e.name AS employee_name,
    d.name AS department_name,
    j.name AS job_name,
    t.title AS training_course,
    rt.validity AS validity
FROM
    employees e
JOIN
    departments d ON e.department_id = d.id
JOIN
    jobs j ON e.job_id = j.id
JOIN
    employees_trainings et ON e.id = et.employee_id
JOIN
    trainings t ON et.training_id = t.id
JOIN
    relevant_trainings rt ON e.id = rt.employee_id AND t.id = rt.training_id
ON DUPLICATE KEY UPDATE
    employee_name = VALUES(employee_name),
    department_name = VALUES(department_name),
    job_name = VALUES(job_name),
    training_course = VALUES(training_course),
    validity = VALUES(validity);
