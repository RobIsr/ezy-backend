const queries = require('../db/queries');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('bson');

const saltRounds = 10;

let insertedId = "";

const database = {
    initUser: async () => {
        bcrypt.hash("test", saltRounds, async function(err, hash) {
            const filter = { username: "test@test.com" };
            const options = { upsert: true };
            const updateDoc = {
                $setOnInsert: {
                    type: "user",
                    username: "test@test.com",
                    password: hash,
                    documents: []
                },
            };

            return queries.register(filter, updateDoc, options);
        });
    },
    login: () => {
        return jwt.sign({ username: "test@test.com" }, process.env.JWT_SECRET);
    },
    insertOne: async () => {
        let newId = new ObjectId();
        // Document to be inserted.
        const doc = {
            _id: newId,
            type: "text",
            owner: "test@test.com",
            allowedUsers: [],
            name: "test-doc",
            html: "test",
        };

        // Filter to search find the document requested by id.
        const filter = { username: "test@test.com" };

        // this option instructs the method to create a document if no
        // documents match the filter
        const options = { upsert: true };

        // create a document that sets name and html attributes of the document.
        const updateDoc = {
            $addToSet: {
                documents: doc,
            },
        };

        await queries.save(filter, updateDoc, options);

        insertedId = newId;
    },
    getAll: async () => {
        // Get all users from the collection.
        const users = await queries.getAllUsers();

        return users;
    },
    dropDb: async (db) => {
        await db.userCollection.drop();
        await db.client.close();
    },
    getInsertedId: () => {
        return insertedId;
    }
};

module.exports = database;
