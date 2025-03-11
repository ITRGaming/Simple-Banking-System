const express = require('express');
const dbConnect = require('./model/db');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const userRouter = require('./routes/user');
const bankerRouter = require('./routes/banker');
const customerRouter = require('./routes/customer');

const corsOptions = {
    origin: 'https://simple-banking-system-3vvr-e9z3zt5ut-itrgamings-projects.vercel.app', // Replace with your frontend's domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to send cookies or authorization headers
    optionsSuccessStatus: 204, // For preflight requests
};

const app = express();
app.use(express.json());
// app.use(cors(corsOptions));
app.use(cors());
app.use('', userRouter);
app.use('/banker', bankerRouter);
app.use('/customer', customerRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Enpointe.io API');
});
    


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