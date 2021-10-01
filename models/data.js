const { ObjectId } = require('bson');
const queries = require("../db/queries");

const data = {
    allDocs: async function(req, res) {
        const jwtHeader = req.headers.authorization;
        console.log(jwtHeader);
        try {
            // Get all documents from the collection.
            const resultSet = await queries.getAll();
    
            // Return status 200 supplying the data.
            return res.status(200).json({ data: resultSet });
        } catch (error) {
            // Return error specifying the route concerned.
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/allDocs",
                    title: "Database error",
                    detail: error.message
                }
            });
        }
    },

    save: async function(req, res) {
        const jwtHeader = req.headers.authorization;
        console.log(jwtHeader);
        try {
            // Document to be inserted.
            const doc = {
                _id: req.body._id,
                type: "documents",
                name: req.body.name,
                html: req.body.html,
            };
    
            // Insert document
            const result = await queries.save(doc);
    
            // Check for successful operation and return status 200.
            if (result.acknowledged) {
                return res.status(201).json({ data: result });
            }
        } catch (error) {
            //Return error specifying route concerned.
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/save",
                    title: "Database error",
                    detail: error.message
                }
            });
        }
    },

    update: async function(req, res) {
        const jwtHeader = req.headers.authorization;
        console.log(jwtHeader);
        try {
            // Filter to search find the document requested by id.
            const filter = { _id: ObjectId(req.body._id) };
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            // create a document that sets name and html attributes of the document.
            const updateDoc = {
                $set: {
                    name: req.body.name,
                    html: req.body.html
                },
            };
    
            // Find the document and update its data.
            const result = await queries.update(filter, updateDoc, options);
    
            //Check for successful update operation and return status 200.
            if (result.acknowledged) {
                return res.status(200).json({ data: result });
            }
        } catch (error) {
            // Send database error specifying the route concerned.
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/update",
                    title: "Database error",
                    detail: error.message
                }
            });
        }
    }
}

module.exports = data;