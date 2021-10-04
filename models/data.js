const { ObjectId } = require('bson');
const jwt_decode = require('jwt-decode');
const queries = require("../db/queries");

const data = {
    allDocs: async function(req, res) {
        const jwtHeader = req.headers.authorization;
        const decodedJwt = jwt_decode(jwtHeader);

        try {
            // Get all documents from the collection.
            const resultSet = await queries.getAll();

            var result = [];

            resultSet.forEach((doc) => {
                if (doc.allowedUsers) {
                    if (doc.allowedUsers.includes(decodedJwt.username)) {
                        result.push(doc);
                    }
                }
            });
            
            console.log('Result: ', result);
            // Return status 200 supplying the data.
            return res.status(200).json({ data: result });
        } catch (error) {
            console.log(error);
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
        const decodedJwt = jwt_decode(jwtHeader);

        try {
            // Document to be inserted.
            const doc = {
                _id: req.body._id,
                type: "documents",
                allowedUsers: [decodedJwt.username],
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
    },

    updateAllowedUsers: async function(req, res) {
        const jwtHeader = req.headers.authorization;
        try {
            // Filter to search find the document requested by id.
            const filter = { _id: ObjectId(req.body._id) };
            
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: false };
            // create a document that sets name and html attributes of the document.
            const updateDoc = {
                $addToSet: {
                    allowedUsers: req.body.user,
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
                    source: "/updateAllowesUsers",
                    title: "Database error",
                    detail: error.message
                }
            });
        }
    },

    removeAllowedUser: async function(req, res) {
        const jwtHeader = req.headers.authorization;
        try {
            // Filter to search find the document requested by id.
            const filter = { _id: ObjectId(req.body._id) };
            
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: false };
            // create a document that sets name and html attributes of the document.
            const updateDoc = {
                $pull: {
                    allowedUsers: req.body.user,
                },
            };
            console.log("Result: ", updateDoc);

            // Find the document and update its data.
            const result = await queries.update(filter, updateDoc, options);
            console.log("Result: ", result);
            //Check for successful update operation and return status 200.
            if (result.acknowledged) {
                return res.status(200).json({ data: result });
            }
        } catch (error) {
            // Send database error specifying the route concerned.
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/removeAllowesUser",
                    title: "Database error",
                    detail: error.message
                }
            });
        }
    },


    getAllowedUsernames: async function(req, res) {
        try {
            const filter = { _id: ObjectId(req.params.id) };
            // Find the document and update its data.
            const result = await queries.getAllowedUsers(filter);
            console.log(result);
            return res.status(200).json({ data: result });

            //Check for successful update operation and return status 200.
            // if (result.acknowledged) {
            //     return res.status(200).json({ data: result });
            // }
        } catch (error) {
            // Send database error specifying the route concerned.
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/allowedUsers",
                    title: "Database error",
                    detail: error.message
                }
            });
        }
    },


    allUsers: async function(req, res) {
        const jwtHeader = req.headers.authorization;
        const decodedJwt = jwt_decode(jwtHeader);

        try {
            // Get all documents from the collection.
            const resultSet = await queries.getAllUsers();
            
            console.log('Result: ', resultSet);
            // Return status 200 supplying the data.
            return res.status(200).json({ data: resultSet });
        } catch (error) {
            console.log(error);
            // Return error specifying the route concerned.
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/allUsers",
                    title: "Database error",
                    detail: error.message
                }
            });
        }
    },
}

module.exports = data;