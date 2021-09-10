var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.post('/', async function(req, res, next) {
    const db = await database.getDb();
    try {
        const doc = {
            type: "documents",
            name: req.body.name,
            html: req.body.html,
        };
        
        const result = await db.collection.insertOne(doc);
    
        if (result.acknowledged) {
            return res.status(201).json({ data: result.ops });
        }
    } catch (error) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: "/save",
                title: "Database error",
                detail: e.message
            }
        });
    } finally {
        await db.client.close();
    }
});

module.exports = router;