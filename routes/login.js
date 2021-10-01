"use strict";

var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

const queries = require("../db/queries");

router.post('/', async function(req, res) {
    let user = await queries.getPasswordForUser(req.body.username);
    let passwordHash = user.password;

    bcrypt.compare(req.body.password, passwordHash, function(err, result) {
        if (result) {
            // Generate an access token
            const accessToken = jwt.sign({ username: user.username }, config.jwt_secret);
            
            // Send generated acess token as response to client.
            return res.json({accessToken});
        } else {
            return res.status(401).json({ data: "Login failed!" });
        }
    });
});

module.exports = router;