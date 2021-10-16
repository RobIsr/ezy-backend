"use strict";

const database = require("../db/database");

const queries = {
    getUser: async function(username) {
        const db = await database.getDb();
        const result = await db.userCollection.findOne({username: username});

        await db.client.close();
        console.log(result);
        return result;
    },
    save: async function(filter, doc, options) {
        const db = await database.getDb();
        const result = await db.userCollection.updateOne(filter, doc, options);

        await db.client.close();
        return result;
    },
    update: async function(username, docId, name, html) {
        const db = await database.getDb();
        const result = await db.userCollection.updateOne(
            { username: username, "documents._id": docId },
            { $set: {
                "documents.$.html": html,
                "documents.$.name": name
            }}
        );

        console.log(result);

        await db.client.close();
        return result;
    },
    register: async function(filter, user, options) {
        const db = await database.getDb();
        const result = await db.userCollection.updateOne(filter, user, options);

        await db.client.close();
        return result;
    },
    getPasswordForUser: async function(username) {
        const db = await database.getDb();
        const result = await db.userCollection.findOne({username: username});

        return result;
    },
    getAllowedUsers: async function(username, docId) {
        const db = await database.getDb();
        const result = await db.userCollection.findOne(
            { username: username, "documents._id": docId },
        );

        await db.client.close();
        return result.documents.find(doc => doc._id === docId);
    },
    getOneDocument: async function(username, docId) {
        const db = await database.getDb();
        const result = await db.userCollection.findOne(
            { username: username, "documents._id": docId },
        );

        await db.client.close();
        return result.documents;
    },
    getAllUsers: async function(username) {
        const db = await database.getDb();
        const result = await db.userCollection
            .find({ username: { $ne: username } })
            .project({password: 0}).toArray();

        await db.client.close();
        return result;
    },
    addAllowedUser: async function(owner, username, docId) {
        const db = await database.getDb();
        const result = await db.userCollection.updateOne(
            { username: owner, "documents._id": docId },
            { $addToSet: {
                "documents.$.allowedUsers": username,
            },
            },
        );

        await db.client.close();
        return result;
    },
    removeAllowedUser: async function(owner, username, docId) {
        const db = await database.getDb();
        const result = await db.userCollection.updateOne(
            { username: owner, "documents._id": docId },
            { $pull: {
                "documents.$.allowedUsers": username,
            },
            },
        );

        await db.client.close();
        return result;
    },
};

module.exports = queries;
