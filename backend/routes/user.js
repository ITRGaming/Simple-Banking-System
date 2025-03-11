const express = require('express');
const { handleUserLogin } = require('../controller/user');

const router = express.Router();

router.post('/login', async(req, res) => {
    try {
        await handleUserLogin(req, res);
    }catch (error) {
        console.error('Error login user:', error);
        res.status(500).json({ error: 'Error login user' });
    }
});

module.exports = router;