const express = require('express');
const { handleUserLogin, handleTransactionData } = require('../controller/user');

const router = express.Router();

router.post('/login', async(req, res) => {
    try {
        await handleUserLogin(req, res);
    }catch (error) {
        console.error('Error login user:', error);
        res.status(500).json({ error: 'Error login user' });
    }
});

router.post('/transaction', async(req, res) => {
    try {
        await handleTransactionData(req, res);
    }catch (error) {
        console.error('Error login user:', error);
        res.status(500).json({ error: 'Error login user' });
    }
});

module.exports = router;