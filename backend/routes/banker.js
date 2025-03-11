const express = require('express');
const { handleFetchAccounts } = require('../controller/user');

const router = express.Router();

router.post('/accounts', async(req, res) => {
    try {
        await handleFetchAccounts(req, res);
    }catch (error) {
        console.error('Error login user:', error);
        res.status(500).json({ error: 'Error login user' });
    }
});



module.exports = router;