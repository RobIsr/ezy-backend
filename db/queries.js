"use strict";

const database = require("../db/database");

const queries = {
    getAll: async function() {
        const db = await database.getDb();
        const result = await db.collection.find({}).toArray();

        await db.client.close();
        return result;
    },
    save: async function(doc) {
        const db = await database.getDb();
        const result = await db.collection.insertOne(doc);

        await db.client.close();
        return result;
    },
    update: async function(filter, doc, options) {
        const db = await database.getDb();
        const result = await db.collection.updateOne(filter, doc, options);

        await db.client.close();
        return result;
    }
};

module.exports = queries;
