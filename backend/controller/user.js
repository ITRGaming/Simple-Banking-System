const dbConnect = require('../model/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = dbConnect();

async function handleUserLogin(req, res) {
    const { username, password, role } = req.body;
    const query = `SELECT * FROM Users WHERE username = ? AND role = ?`;
    db.get(query, [username, role], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'An unexpected error occurred' });
        } else {
            if (!result) {
                return res.status(404).json({ error: 'User not found' });
            } else {
                if (password === result.password) {
                    const { id, role } = result;
                    const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    return res.status(200).json({ token, id });
                } else {
                    return res.status(401).json({ error: 'Invalid password' });
                }
            }
        }
    });
}

async function handleFetchAccounts(req, res) {
    const auth = req.body.headers.Authorization;
    const token = auth.split(' ')[1];
    if (!token) {
        res.status(404).json({ error: 'Token Not Found' });
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: 'jwt expired' });
        } else {
            const query = `SELECT
                            u.id AS user_id,
                            u.username,
                            u.email,
                            (
                                SELECT COALESCE(SUM(amount), 0)
                                FROM Accounts
                                WHERE user_id = u.id AND transaction_type = 'deposit'
                            ) -
                            (
                                SELECT COALESCE(SUM(amount), 0)
                                FROM Accounts
                                WHERE user_id = u.id AND transaction_type = 'withdrawal'
                            ) AS final_amount
                            FROM
                                Users u
                            WHERE
                                role = 'customer';`;
            db.all(query, [], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'An unexpected error occurred' });
                } else {
                    res.status(200).json(result);
                }
            });
        }
    });
}

async function handleTransactionData(req, res) {
    const token = req.body.token;
    if (!token) {
        res.status(404).json({ error: 'Token Not Found' });
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: 'jwt expired' });
        } else {
            const { user_id } = req.body;
            const query = `SELECT
                            a.*,  
                            (
                                SELECT COALESCE(SUM(amount), 0)
                                FROM Accounts
                                WHERE user_id = a.user_id AND transaction_type = 'deposit'
                            ) -
                            (
                                SELECT COALESCE(SUM(amount), 0)
                                FROM Accounts
                                WHERE user_id = a.user_id AND transaction_type = 'withdrawal'
                            ) AS final_amount
                            FROM
                                Accounts a 
                            WHERE
                                a.user_id = ?;`;
            db.all(query, [user_id], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'An unexpected error occurred' });
                } else {
                    res.status(200).json(result);
                }
            });
        }
    });
}

async function handleTransaction(req, res) {
    const token = req.body.token;
    if (!token) {
        res.status(404).json({ error: 'Token Not Found' });
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: 'jwt expired' });
        } else {
            const { user_id, transaction_type, amount } = req.body;
            const query = `INSERT INTO Accounts (user_id, transaction_type, amount) VALUES (?, ?, ?);`;
            db.run(query, [user_id, transaction_type, amount], function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'An unexpected error occurred' });
                } else {
                    res.status(200).json({ message: 'Transaction successful', result: { id: this.lastID } });
                }
            });
        }
    });
}

module.exports = { handleUserLogin, handleFetchAccounts, handleTransactionData, handleTransaction };