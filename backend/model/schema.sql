CREATE DATABASE Bank;

USE Bank;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'banker') NOT NULL
);

CREATE TABLE Accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    transaction_type ENUM('deposit', 'withdrawal') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- INSERT INTO Users (username, email, password, role) VALUES ('banker1', 'banker1@gmail.com', 'test@123', 'banker'), ('customer1', 'customer1@gmail.com', 'test@123',
-- 'customer');

-- INSERT INTO Accounts (user_id, transaction_type, amount) VALUES (2, 'deposit', 0.00);