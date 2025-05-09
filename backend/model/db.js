const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function dbConnect() {
    const dbPath = path.resolve(__dirname, '../database/banking_system.db'); // Adjust the path as needed
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to SQLite database:', err.message);
        } else {
            console.log('Database is connected');
        }
    });
    return db;
}

module.exports = dbConnect;