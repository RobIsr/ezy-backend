"use strict";

var express = require('express');
var router = express.Router();
const queries = require("../db/queries");

router.post('/', async function(req, res) {
    try {
        // Document to be inserted.
        const doc = {
            _id: req.body._id,
            type: "documents",
            name: req.body.name,
            html: req.body.html,
        };

        // Insert document
        const result = await queries.save(doc);

        // Check for successful operation and return status 200.
        if (result.acknowledged) {
            return res.status(201).json({ data: result });
        }
    } catch (error) {
        //Return error specifying route concerned.
        return res.status(500).json({
            errors: {
                status: 500,
                source: "/save",
                title: "Database error",
                detail: error.message
            }
        });
    }
});

module.exports = router;
