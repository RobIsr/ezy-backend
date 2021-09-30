"use strict";

var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');

const queries = require("../db/queries");

router.post('/', async function(req, response) {
    console.log(req.body);
    let user = await queries.getPasswordForUser(req.body.username);

    console.log(user);

    let passwordHash = user.password;

    console.log(passwordHash);

    bcrypt.compare(req.body.password, passwordHash, function(err, res) {
        console.log(res);
        if (res) {
            return response.status(200).json({ data: "Login success!" });
        } else {
            return response.status(401).json({ data: "Login failed!" });
        }
    });
});

module.exports = router;
