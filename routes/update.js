"use strict";

const { ObjectId } = require('bson');
var express = require('express');
var router = express.Router();
const queries = require('../db/queries');

router.put('/', async function(req, res) {
    try {
        // Filter to search find the document requested by id.
        const filter = { _id: ObjectId(req.body._id) };
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: true };
        // create a document that sets name and html attributes of the document.
        const updateDoc = {
            $set: {
                name: req.body.name,
                html: req.body.html
            },
        };

        // Find the document and update its data.
        const result = await queries.update(filter, updateDoc, options);

        //Check for successful update operation and return status 200.
        if (result.acknowledged) {
            return res.status(200).json({ data: result });
        }
    } catch (error) {
        // Send database error specifying the route concerned.
        return res.status(500).json({
            errors: {
                status: 500,
                source: "/update",
                title: "Database error",
                detail: error.message
            }
        });
    }
});

module.exports = router;
