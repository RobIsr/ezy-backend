"use strict";

var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const queries = require("../db/queries");

router.post('/', async function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
        try {
            // Document to be inserted.
            const user = {
                type: "user",
                username: req.body.username,
                password: hash,
            };

            console.log(user);
    
            // Insert document
            const result = await queries.register(user);
    
            // Check for successful operation and return status 200.
            if (result.acknowledged) {
                return res.status(201).json({ data: result });
            }
        } catch (error) {
            //Return error specifying route concerned.
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/register",
                    title: "Database error",
                    detail: error.message
                }
            });
        }
    });
});

module.exports = router;
