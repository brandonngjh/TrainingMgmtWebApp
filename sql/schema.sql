CREATE DATABASE IF NOT EXISTS training_app;
USE training_app;

CREATE TABLE user_credentials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

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
    division VARCHAR(255),
    department_id BIGINT,
    job_id BIGINT,
    designation VARCHAR(255),
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
    validity ENUM('valid', 'expired', 'NA') DEFAULT 'NA',
    foreign key (employee_id) references employees(id),
    foreign key (training_id) references trainings(id)
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

-- Additional Indexes for performance
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_training_title ON trainings(title);

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

INSERT INTO departments (name) VALUES ('Machining');

INSERT INTO jobs (name, department_id)
VALUES ('Production', (SELECT id FROM departments WHERE name = 'Machining'));

INSERT INTO employees (id, name, email, department_id, division, job_id, designation)
VALUES
    (294, 'Robert Destreza', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Production Machining HOD'),
    (523, 'Ashikin Binti Ibrahim', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Production/MES Planner'),
    (897, 'Min Htet Kyaw', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Assitant Planner'),
    (923, 'Myat Naing Maw', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Material Planner'),
    (969, 'Ernest Bryan Buenacida', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'MES Planner'),
    (363, 'Mangawang Benjo Tejada', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Production Supervisor (Machining)'),
    (875, 'Fery Suwandri Wijaya', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Big Format Leader'),
    (878, 'Heri Nurul Huda', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Big Format Machinist Setter'),
    (968, 'Franclin Cole Vitug', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'CNC Machine Operator'),
    (530, 'Danial Haikal Bin Badrol Sham', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Fanuc Leader/Machinist'),
    (862, 'Dileep Kumar', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Fanuc Machinist Setter'),
    (815, 'Zaw Lin Naing', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'CNC Machine Operator'),
    (694, 'Khaing Soe Wai', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'CNC Machine Operator'),
    (937, 'Tin Lin Aung', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'CNC Machine Operator'),
    (811, 'Gopinathan Nair Anish Kumar', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Slim3N Leader/Machinist'),
    (510, 'Chand Dhan Bahadur', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'CNC Machine Operator'),
    (680, 'Gauj Kazi', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'CNC Machine Operator'),
    (894, 'San Ko Win', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'CNC Machine Operator'),
    (539, 'Bashir Muhammad', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'CNC Machine Operator'),
    (781, 'Kottaisamy Arjunan', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'PS105 Leader/Machinist'),
    (802, 'Basanta Rai', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'CNC Machine Operator'),
    (682, 'Mir Rabby Saddam', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'CNC Machine Operator'),
    (944, 'Tham Wai Seng', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'J300 Machinist Setter'),
    (895, 'Kaung Khant Zaw', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'CNC Machine Operator'),
    (2, 'See Seng Giap', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Production Supervisor (Conventional)'),
    (23, 'Muhamad Al Amin Bin Md Surep', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Buffer Leader'),
    (392, 'Muhammad Riduan Bin Mohd Misman', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Buffer'),
    (645, 'Mohd Shahrul Nizam Bin Nordin', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Buffer'),
    (790, 'Aung Myint Thein', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Buffer'),
    (490, 'Surindra Mahato', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Buffer'),
    (349, 'Manlabian Ernesto JR Ramon', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Tool Crib Leader'),
    (805, 'Mahesh Nepali', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Tooling operator'),
    (678, 'Hossain MD Jubayer', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Conventional Grinding'),
    (703, 'Myo Min Oo', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Saw cut'),
    (733, 'Phyo That Hlaing', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Chip Cleaner'),
    (832, 'Aktaruzzaman Md', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Chip Cleaner'),
    (838, 'Rayhan Md', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Chip Cleaner'),
    (177, 'Muhammad Syafiq Bin Abdul Razak', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Assembly Leader'),
    (587, 'Jaiswal Pashupati Nath', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Assembly'),
    (69, 'Mohd Sapuan Bin Othmar', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Maintenance Leader'),
    (812, 'Htet Wai Oo', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Maintenance'),
    (693, 'Kyaw San Htwe', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Maintenance'),
    (833, 'Hosion MD Saddam', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Maintenance/Construction'),
    (935, 'Thein Kyaw', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Maintenance/Construction'),
    (978, 'Rukesh a/l Ravendran', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Machinist'),
    (504, 'Sah Fulgendra', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Maintenance/Construction'),
    (22, 'Brandon', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Maintenance/Construction'),
    (21, 'Bob', 'temp@gmail.com', (SELECT id FROM departments WHERE name = 'Machining'), 'Production', (SELECT id FROM jobs WHERE name = 'Production'), 'Maintenance/Construction');

INSERT INTO trainings (title, description, validity_period)
VALUES
    ('AS 9100D AWARNESS', 'EXTERNAL', 365),
    ('COUNTERFEIT', 'INTERNAL', 365),
    ('CI & IP AWARENESS', 'INTERNAL', 365),
    ('FOD', 'INTERNAL', 365),
    ('IQA TRAINING AS9100D', 'EXTERNAL', 365),
    ('SAFETY AWARENESS (PPE)', 'INTERNAL', 365),
    ('5S', 'INTERNAL', 365),
    ('MACHINING PHASE 1', 'INTERNAL', 365),
    ('MACHINING PHASE 2', 'INTERNAL', 365),
    ('PROCESS MANAGEMENT PLAN / PROCESS TRAVELER', 'INTERNAL', 365),
    ('NC PROGRAMME', 'INTERNAL', 365),
    ('MESUREMENT AND CALIBRATION', 'INTERNAL', 365),
    ('GD&T', 'INTERNAL', 365),
    ('ENGINEERING MANAGEMENT', 'INTERNAL', 365),
    ('TOOLS (JIG & FITURES)', 'INTERNAL', 365),
    ('DRAWING INTERPERTATION', 'INTERNAL', 365),
    ('QUALITY AWARNESS', 'INTERNAL', 365),
    ('DEBURING AND BUFFING', 'INTERNAL', 365),
    ('MES SYSTEM', 'INTERNAL', 365);

INSERT INTO employees_trainings (employee_id, training_id, status, start_date, end_date, expiry_date) VALUES
(22, (SELECT id FROM trainings WHERE title = 'SAFETY AWARENESS (PPE)'), 'Completed', '2024-01-01', '2024-01-31', '2025-01-31'),
(22, (SELECT id FROM trainings WHERE title = 'FOD'), 'Completed', '2022-10-01', '2022-10-02', '2023-11-27'),
(22, (SELECT id FROM trainings WHERE title = 'FOD'), 'Scheduled', '2024-09-01', '2024-09-28', '2025-09-28'),
(22, (SELECT id FROM trainings WHERE title = 'COUNTERFEIT'), 'Scheduled', '2024-09-01', '2024-09-29', '2025-09-29'),
(22, (SELECT id FROM trainings WHERE title = 'CI & IP AWARENESS'), 'Scheduled', '2024-09-01', '2024-10-20', '2025-10-20'),

(21, (SELECT id FROM trainings WHERE title = 'SAFETY AWARENESS (PPE)'), 'Completed', '2024-01-01', '2024-01-31', '2025-01-31'),
(21, (SELECT id FROM trainings WHERE title = 'FOD'), 'Completed', '2023-07-01', '2024-07-15', '2025-07-15'),
(21, (SELECT id FROM trainings WHERE title = 'IQA TRAINING AS9100D'), 'Scheduled', '2024-08-01', '2024-09-29', '2025-09-29'),
(21, (SELECT id FROM trainings WHERE title = '5S'), 'Scheduled', '2024-09-01', '2024-10-27', '2025-10-27'),

(504, (SELECT id FROM trainings WHERE title = 'GD&T'), 'Completed', '2024-01-01', '2024-01-31', '2025-01-31'),
(504, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 1'), 'Completed', '2024-01-01', '2024-01-31', '2025-01-31');

INSERT INTO relevant_trainings(employee_id, training_id, validity)
VALUES
(22, (SELECT id FROM trainings WHERE title = 'SAFETY AWARENESS (PPE)'), 'valid'),
(22, (SELECT id FROM trainings WHERE title = 'AS 9100D AWARNESS'), 'NA'),
(22, (SELECT id FROM trainings WHERE title = 'COUNTERFEIT'), 'NA'),
(22, (SELECT id FROM trainings WHERE title = 'CI & IP AWARENESS'), 'NA'),
(22, (SELECT id FROM trainings WHERE title = 'FOD'), 'expired'),

(21, (SELECT id FROM trainings WHERE title = 'SAFETY AWARENESS (PPE)'), 'valid'),
(21, (SELECT id FROM trainings WHERE title = 'FOD'), 'valid'),
(21, (SELECT id FROM trainings WHERE title = 'IQA TRAINING AS9100D'), 'NA'),
(21, (SELECT id FROM trainings WHERE title = '5S'), 'NA'),

(504, (SELECT id FROM trainings WHERE title = 'GD&T'), 'valid'),
(504, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 1'), 'valid');


-- -- Getting the basic employee info
-- SELECT
--     e.id,
--     e.name AS employee_name,
--     d.name AS department_name,
--     j.name AS job_name
-- FROM employees e
-- JOIN departments d ON e.department_id = d.id
-- JOIN jobs j ON e.job_id = j.id;

-- -- Getting the courses that are relevant to each employee
-- SELECT
--     rt.employee_id,
--     SELECT
--         rt.id,
--         rt.employee_id,
--         rt.validity,
--         t.title
--     FROM trainings t
--     JOIN relevant_trainings rt ON t.id = rt.training_id
--     ORDER BY rt.employee_id;

-- -- 
-- Given an employee id, search the employees_trainings table for the end date and expiry date of the training for the employee. However, the expiry date should only be returned if the status attribute in the employees_training table is set to completed. Also include the training title and id of each training found.

-- Search the employees_training table for the end date and expiry date of each row. If there are multiple rows that share the same employee id and training id, only return the row with the latest end date. The expiry date should only be returned if the status attribute in the employees_training table is set to completed. Also include the training title and id of each training found.

-- SELECT
--     et.training_id,
--     t.title,
--     et.end_date,
--     CASE
--         WHEN et.status = 'Completed' THEN et.expiry_date
--         ELSE NULL
--     END AS expiry_date
-- FROM employees_trainings et
-- JOIN trainings t ON et.training_id = t.id
-- WHERE et.employee_id = ?;

-- SELECT
--     et.employee_id,
--     et.training_id,
--     t.title,
--     IF(et.status = 'Completed', MAX(et.end_date), NULL) AS latest_end_date,
--     IF(et.status = 'Completed', MAX(et.expiry_date), NULL) AS expiry_date,
--     IF(et.status = 'Scheduled', MAX(et.start_date), NULL) AS scheduled_date
-- FROM employees_trainings et
-- JOIN trainings t ON et.training_id = t.id
-- GROUP BY et.employee_id, et.training_id, et.status
-- ORDER BY et.employee_id, et.training_id;