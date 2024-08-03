CREATE DATABASE IF NOT EXISTS training_app;
USE training_app;

CREATE TABLE user_credentials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE employees (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL DEFAULT 'temp@gmail.com',
    hire_date DATE,
    designation VARCHAR(255)
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

INSERT INTO employees (id, name, email, hire_date, designation)
VALUES
    (294, 'Robert Destreza', 'robert@example.com', '2022-01-15', 'Production Machining HOD'),
    (523, 'Ashikin Binti Ibrahim', 'ashikin@example.com', '2021-05-20', 'Production/MES Planner'),
    (897, 'Min Htet Kyaw', 'min@example.com', '2020-08-10', 'Assistant Planner'),
    (923, 'Myat Naing Maw', 'myat@example.com', '2019-11-30', 'Material Planner'),
    (969, 'Ernest Bryan Buenacida', 'ernest@example.com', '2020-07-25', 'MES Planner'),
    (363, 'Mangawang Benjo Tejada', 'mangawang@example.com', '2021-03-10', 'Production Supervisor (Machining)'),
    (875, 'Fery Suwandri Wijaya', 'fery@example.com', '2019-06-15', 'Big Format Leader'),
    (878, 'Heri Nurul Huda', 'heri@example.com', '2018-09-01', 'Big Format Machinist Setter'),
    (968, 'Franclin Cole Vitug', 'franclin@example.com', '2020-04-20', 'CNC Machine Operator'),
    (530, 'Danial Haikal Bin Badrol Sham', 'danial@example.com', '2021-11-05', 'Fanuc Leader/Machinist'),
    (862, 'Dileep Kumar', 'dileep@example.com', '2018-12-30', 'Fanuc Machinist Setter'),
    (815, 'Zaw Lin Naing', 'zaw@example.com', '2019-01-18', 'CNC Machine Operator'),
    (694, 'Khaing Soe Wai', 'khaing@example.com', '2020-02-25', 'CNC Machine Operator'),
    (937, 'Tin Lin Aung', 'tin@example.com', '2019-05-14', 'CNC Machine Operator'),
    (811, 'Gopinathan Nair Anish Kumar', 'gopinathan@example.com', '2021-07-07', 'Slim3N Leader/Machinist'),
    (510, 'Chand Dhan Bahadur', 'chand@example.com', '2018-11-11', 'CNC Machine Operator'),
    (680, 'Gauj Kazi', 'gauj@example.com', '2019-08-22', 'CNC Machine Operator'),
    (894, 'San Ko Win', 'san@example.com', '2021-09-09', 'CNC Machine Operator'),
    (539, 'Bashir Muhammad', 'bashir@example.com', '2020-10-20', 'CNC Machine Operator'),
    (781, 'Kottaisamy Arjunan', 'kottaisamy@example.com', '2018-03-30', 'PS105 Leader/Machinist'),
    (802, 'Basanta Rai', 'basanta@example.com', '2019-04-18', 'CNC Machine Operator'),
    (682, 'Mir Rabby Saddam', 'mir@example.com', '2021-06-24', 'CNC Machine Operator'),
    (944, 'Tham Wai Seng', 'tham@example.com', '2020-12-15', 'J300 Machinist Setter'),
    (895, 'Kaung Khant Zaw', 'kaung@example.com', '2019-07-19', 'CNC Machine Operator'),
    (2, 'See Seng Giap', 'see@example.com', '2020-11-23', 'Production Supervisor (Conventional)'),
    (23, 'Muhamad Al Amin Bin Md Surep', 'muhamadal@example.com', '2021-03-14', 'Buffer Leader'),
    (392, 'Muhammad Riduan Bin Mohd Misman', 'muhammadriduan@example.com', '2022-02-28', 'Buffer'),
    (645, 'Mohd Shahrul Nizam Bin Nordin', 'mohdshahrul@example.com', '2021-12-10', 'Buffer'),
    (790, 'Aung Myint Thein', 'aung@example.com', '2020-05-20', 'Buffer'),
    (490, 'Surindra Mahato', 'surindra@example.com', '2021-08-09', 'Buffer'),
    (349, 'Manlabian Ernesto JR Ramon', 'manlabian@example.com', '2018-01-15', 'Tool Crib Leader'),
    (805, 'Mahesh Nepali', 'mahesh@example.com', '2021-04-22', 'Tooling operator'),
    (678, 'Hossain MD Jubayer', 'hossain@example.com', '2020-09-18', 'Conventional Grinding'),
    (703, 'Myo Min Oo', 'myo@example.com', '2019-12-12', 'Saw cut'),
    (733, 'Phyo That Hlaing', 'phyo@example.com', '2021-01-24', 'Chip Cleaner'),
    (832, 'Aktaruzzaman Md', 'aktaruzzaman@example.com', '2020-06-13', 'Chip Cleaner'),
    (838, 'Rayhan Md', 'rayhan@example.com', '2021-10-08', 'Chip Cleaner'),
    (177, 'Muhammad Syafiq Bin Abdul Razak', 'muhammadsyafiq@example.com', '2021-11-28', 'Assembly Leader'),
    (587, 'Jaiswal Pashupati Nath', 'jaiswal@example.com', '2019-04-25', 'Assembly'),
    (69, 'Mohd Sapuan Bin Othmar', 'mohdsapuan@example.com', '2018-07-16', 'Maintenance Leader'),
    (812, 'Htet Wai Oo', 'htet@example.com', '2020-03-22', 'Maintenance'),
    (693, 'Kyaw San Htwe', 'kyaw@example.com', '2019-08-11', 'Maintenance'),
    (833, 'Hosion MD Saddam', 'hosion@example.com', '2021-07-19', 'Maintenance/Construction'),
    (935, 'Thein Kyaw', 'thein@example.com', '2020-10-21', 'Maintenance/Construction'),
    (978, 'Rukesh a/l Ravendran', 'rukesh@example.com', '2021-12-30', 'Machinist'),
    (504, 'Sah Fulgendra', 'sah@example.com', '2020-11-03', 'Maintenance/Construction'),
    (22, 'Brandon', 'brandon@example.com', '2021-09-27', 'Maintenance/Construction'),
    (21, 'Bob', 'bob@example.com', '2020-04-14', 'Maintenance/Construction');

INSERT INTO trainings (title, description, validity_period)
VALUES
    ('AS 9100D AWARENESS', 'EXTERNAL', 365),
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

INSERT INTO relevant_trainings(employee_id, training_id, validity)
VALUES
(22, (SELECT id FROM trainings WHERE title = 'COUNTERFEIT'), 'NA'),
(22, (SELECT id FROM trainings WHERE title = 'MEASUREMENT AND CALIBRATION'), 'NA'),
(22, (SELECT id FROM trainings WHERE title = 'FOD'), 'Expired'),
(22, (SELECT id FROM trainings WHERE title = 'DEBURING AND BUFFING'), 'Valid'),

(21, (SELECT id FROM trainings WHERE title = 'SAFETY AWARENESS (PPE)'), 'Valid'),
(21, (SELECT id FROM trainings WHERE title = 'FOD'), 'Valid'),
(21, (SELECT id FROM trainings WHERE title = 'IQA TRAINING AS9100D'), 'NA'),

(504, (SELECT id FROM trainings WHERE title = 'GD&T'), 'Valid'),
(504, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 1'), 'Valid'),
(504, (SELECT id FROM trainings WHERE title = 'MEASUREMENT AND CALIBRATION'), 'Valid'),

(23, (SELECT id FROM trainings WHERE title = 'DEBURING AND BUFFING'), 'Valid'),
(23, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 1'), 'Valid'),

(587, (SELECT id FROM trainings WHERE title = 'COUNTERFEIT'), 'Expired'),
(587, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 1'), 'Valid'),
(587, (SELECT id FROM trainings WHERE title = 'MACHINING PHASE 2'), 'Valid'),

(2, (SELECT id FROM trainings WHERE title = 'PROCESS MANAGEMENT PLANNING'), 'Valid'),
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
