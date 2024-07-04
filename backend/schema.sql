CREATE DATABASE training_app;
USE training_app;

CREATE TABLE Employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(255) NOT NULL
);

INSERT INTO Employees (name, email, department)
VALUES
('Alice', 'alice@gmail.com', 'Precision Machine'),
('Bob', 'bob@gmail.com', 'Precision Machine'),
('Charlie', 'charlie@gmail.com', 'Boxbuild & Module Assembly'),
('David', 'david@gmail.com', 'Wire Harnessing'),
('Eve', 'eve@gmail.com', 'Sheet Metal, Fabrication, Spray & Powder Coating'),
('Frank', 'frank@gmail.com', 'Precision Machine'),
('Grace', 'grace@gmail.com', 'Precision Machine'),
('Heidi', 'heidi@gmail.com', 'Boxbuild & Module Assembly'),
('Ivan', 'ivan@gmail.com', 'Wire Harnessing'),
('Judy', 'judy@gmail.com', 'Sheet Metal, Fabrication, Spray & Powder Coating'),
('Mallory', 'mallory@gmail.com', 'Precision Machine'),
('Nina', 'nina@gmail.com', 'Precision Machine'),
('Oscar', 'oscar@gmail.com', 'Boxbuild & Module Assembly'),
('Peggy', 'peggy@gmail.com', 'Wire Harnessing'),
('Trent', 'trent@gmail.com', 'Sheet Metal, Fabrication, Spray & Powder Coating'),
('Victor', 'victor@gmail.com', 'Precision Machine');