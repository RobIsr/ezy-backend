var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.post('/', async function(req, res, next) {
    const db = await database.getDb();
    
    const doc = {
        name: req.body.name,
        html: req.body.html,
    };
    
    const result = await db.collection.insertOne(doc);

    if (result.acknowledged) {
        return res.status(201).json({ data: result.ops });
    }

    await db.client.close();
});

module.exports = router;