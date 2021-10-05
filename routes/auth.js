var express = require('express');
var router = express.Router();
const authModel = require('../models/auth');

router.post('/login', async function(req, res) {
    authModel.login(req, res);
});

router.put('/register', async function(req, res) {
    authModel.register(req, res);
});

module.exports = router;
