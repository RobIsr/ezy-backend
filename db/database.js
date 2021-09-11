"use strict";

const mongo = require("mongodb").MongoClient;

let dsn = "";

if (process.env.NODE_ENV === "production") {
    const config = require("./config.json");
    dsn = `mongodb+srv://${config.username}:${config.password}@cluster0.inbl1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
}

const collectionName = "documents";

const database = {
    getDb: async function getDb () {

        if (process.env.DOCKER) {
            // DSN for mongo db in docker.
            dsn = process.env.DBWEBB_DSN;
        }

        if (process.env.NODE_ENV === "local") {
            dsn = "mongodb://localhost:27017/documents";
        }
        
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