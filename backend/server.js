const express = require('express');
const dbConnect = require('./model/db');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const userRouter = require('./routes/user');
const bankerRouter = require('./routes/banker');

const app = express();
app.use(express.json());
app.use(cors());
app.use('', userRouter);
app.use('/banker', bankerRouter);
    


const db = dbConnect();
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// db();

const secretKey = process.env.JWT_SECRET || 'Enpointe.io';

const port = process.env.PORT || 5000; 

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});