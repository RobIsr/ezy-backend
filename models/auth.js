const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const queries = require("../db/queries");

const saltRounds = 10;

const auth = {

    login: async function(req, res) {
        let user = await queries.getPasswordForUser(req.body.username);
        let passwordHash = "";

        if (user) {
            passwordHash = user.password;
        }
    
        bcrypt.compare(req.body.password, passwordHash, function(err, result) {
            if (result) {
                // Generate an access token
                const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
                
                // Send generated acess token as response to client.
                return res.json({accessToken});
            } else {
                return res.status(401).json({ data: "Login failed!" });
            }
        });
    },

    register: async function(req, res) {
        const jwtHeader = req.headers.authorization;
        bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
            try {
                // Filter to search find the document requested by id.
                const filter = { username: req.body.username };
                
                // this option instructs the method to create a document if no documents match the filter
                const options = { upsert: true };
                // create a document that sets name and html attributes of the document.
                const updateDoc = {
                    $setOnInsert: {
                        type: "user",
                        username: req.body.username,
                        password: hash,
                    },
                };

                // Find the document and update its data.
                const result = await queries.register(filter, updateDoc, options);
                if (result.upsertedId) {
                    return res.status(200).json({ data: "Registration successful, you can now login." });
                } else {
                    return res.status(409).json({ data: "Username already exists..." });
                }
            } catch (error) {
                // Send database error specifying the route concerned.
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "Database error",
                        detail: error.message
                    }
                });
            }
        });
    }
}

module.exports = auth;