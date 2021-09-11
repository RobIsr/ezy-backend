"use strict";

const mongo = require("mongodb").MongoClient;
const config = require("./config.json");
const collectionName = "documents";

const database = {
    getDb: async function getDb () {
        // DSN for mongo db.
        let dsn = process.env.DBWEBB_DSN || `mongodb+srv://${config.username}:${config.password}@cluster0.inbl1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

        // DSN for running tests.
        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

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
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;