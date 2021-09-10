const { ObjectId } = require('bson');
var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.put('/', async function(req, res) {
    const db = await database.getDb();
    try {
        const filter = { _id: ObjectId(req.body._id) };
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: true };
        // create a document that sets the plot of the movie
        const updateDoc = {
        $set: {
            name: req.body.name,
            html: req.body.html
        },
        };
        const result = await db.collection.updateOne(filter, updateDoc, options);
        console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        );
        if (result.acknowledged) {
            return res.status(201).json({ data: result.ops });
        }
    } catch(error) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: "/update",
                title: "Database error",
                detail: e.message
            }
        });
    } finally {
        await db.client.close();
    }
});

module.exports = router;