"use strict";

require('dotenv-flow').config();

const mongo = require("mongodb").MongoClient;

let dsn = process.env.DATABASE_DSN;

const collectionName = "documents";

const database = {
    getDb: async function getDb() {
        // Configure connection to mongodb.
        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Connect to database and get the "documents" collection
        const db = await client.db();
        const collection = await db.collection(collectionName);

        // Return the connection and the collection.
        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
