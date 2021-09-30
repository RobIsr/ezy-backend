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
    },
    register: async function(user) {
        const db = await database.getDb();
        const result = await db.userCollection.insertOne(user);

        await db.client.close();
        return result;
    },
    getPasswordForUser: async function(username) {
        const db = await database.getDb();
        const result = await db.userCollection.findOne({username : username});
        return result;
    }
};

module.exports = queries;
