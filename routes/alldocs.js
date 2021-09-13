"use strict";

var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.get('/', async function(req, res) {
    const db = await database.getDb();

    try {
        // Get all documents from the collection.
        const resultSet = await db.collection.find({}).toArray();

        // Return status 200 supplying the data.
        return res.status(200).json({ data: resultSet });
    } catch (error) {
        // Return error specifying the route concerned.
        return res.status(500).json({
            errors: {
                status: 500,
                source: "/allDocs",
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
