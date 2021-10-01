const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const queries = require("../db/queries");

const saltRounds = 10;

const auth = {

    login: async function(req, res) {
        let user = await queries.getPasswordForUser(req.body.username);
        let passwordHash = user.password;
    
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
        bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
            try {
                // Document to be inserted.
                const user = {
                    type: "user",
                    username: req.body.username,
                    password: hash,
                };
    
                console.log(user);
        
                // Insert document
                const result = await queries.register(user);
        
                // Check for successful operation and return status 200.
                if (result.acknowledged) {
                    return res.status(201).json({ data: result });
                }
            } catch (error) {
                //Return error specifying route concerned.
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