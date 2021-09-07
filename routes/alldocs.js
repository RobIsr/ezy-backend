var express = require('express');
var router = express.Router();
const database = require("../db/database");

router.get('/', async function(req, res, next) {
    const db = await database.getDb();
    const resultSet = await db.collection.find({}).toArray();

    await db.client.close();

    return res.status(200).json({ data: resultSet });
});

module.exports = router;
