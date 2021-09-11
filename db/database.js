"use strict";

const mongo = require("mongodb").MongoClient;
if(!process.env.DOCKER && process.env.NODE_ENV === "production") {
    const config = require("./config.json");
}
const collectionName = "documents";

const database = {
    getDb: async function getDb () {
        // DSN for mongo db local instance.
        let dsn = process.env.DBWEBB_DSN || "mongodb://localhost:27017/documents";
        console.log("DSN: " , dsn);
        // DSN for running tests.
        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        //DSN for running instance of mongodb connected to Atlas
        if (process.env.NODE_ENV === 'production') {
            dsn = `mongodb+srv://${config.username}:${config.password}@cluster0.inbl1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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