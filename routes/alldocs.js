"use strict";

var express = require('express');
var router = express.Router();
const queries = require("../db/queries");

router.get('/', async function(req, res) {
    try {
        // Get all documents from the collection.
        const resultSet = await queries.getAll();

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
    }
});

module.exports = router;
