var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.get('/', async function(req, res, next) {
    const db = await database.getDb();

    try {
        const resultSet = await db.collection.find({}).toArray();

        return res.status(200).json({ data: resultSet });
    } catch(error) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: "/allDocs",
                title: "Database error",
                detail: e.message
            }
        });
    } finally {
        await db.client.close();
    }
    
});

module.exports = router;
