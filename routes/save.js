"use strict";

var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.post('/', async function(req, res) {
    const db = await database.getDb();

    try {
        // Document to be inserted.
        const doc = {
            type: "documents",
            name: req.body.name,
            html: req.body.html,
        };

        // Insert document
        const result = await db.collection.insertOne(doc);

        // Check for successful operation and return status 200.
        if (result.acknowledged) {
            return res.status(201).json({ data: result.ops });
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
    } finally {
        // Close connection.
        await db.client.close();
    }
});

module.exports = router;
