CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('customer', 'banker')) NOT NULL
);

CREATE TABLE Accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    transaction_type TEXT CHECK(transaction_type IN ('deposit', 'withdrawal')) NOT NULL,
    amount REAL NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- INSERT INTO Users (username, email, password, role) VALUES ('banker1', 'banker1@gmail.com', 'test@123', 'banker'), ('customer1', 'customer1@gmail.com', 'test@123', 'customer');

-- INSERT INTO Accounts (user_id, transaction_type, amount) VALUES (2, 'deposit', 0.00);