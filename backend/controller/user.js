const dbConnect = require('../model/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = dbConnect();

async function handleUserLogin(req, res) {
    const { username, password, role } = req.body;
    const query = `SELECT * FROM Users where username = ? and role = ?`;
    db.query(query, [username, role], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'An unexpected error occurred' });
        } else {
            if (result.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            } else {
                if (password === result[0].password) {
                        const { id, role } = result[0];
                        const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
                        return res.status(200).json({ token });
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
                            Role = 'customer';`;
            db.query(query, (err, result) => {
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
                const { user_id } = req.body;
                const query = `SELECT * AS trannsactions FROM Accounts WHERE user_id = ?`;
                db.query(query, [user_id], (err, result) => {
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

module.exports = { handleUserLogin, handleFetchAccounts, handleTransaction };