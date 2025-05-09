const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const userRouter = require('./routes/user');
const bankerRouter = require('./routes/banker');
const customerRouter = require('./routes/customer');
require('dotenv').config();

const app = express();
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(cors());
} else {
    const corsOptions = {
        origin: (origin, callback) => {
            const allowedOrigins = process.env.ORIGIN.split(',');
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: 204,
    };
    app.use(cors(corsOptions));
}
app.use('', userRouter);
app.use('/banker', bankerRouter);
app.use('/customer', customerRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Enpointe.io API');
});


// db();

const secretKey = process.env.JWT_SECRET || 'Enpointe.io';

const port = process.env.PORT || 5000; 

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});