const { ObjectId } = require('bson');
const jwtDecode = require('jwt-decode');
const queries = require("../db/queries");
const puppeteer = require("puppeteer");
const mailgun = require("mailgun-js");

const data = {
    save: async function(req, res) {
        const jwtHeader = req.headers.authorization;
        const decodedJwt = jwtDecode(jwtHeader);

        let newId = new ObjectId();
        // Document to be inserted.
        const doc = {
            _id: newId,
            type: req.body.type,
            owner: decodedJwt.username,
            allowedUsers: [],
            name: req.body.name,
            html: req.body.html,
        };

        // Filter to search find the document requested by id.
        const filter = { username: decodedJwt.username };

        // this option instructs the method to create a document if no
        // documents match the filter
        const options = { upsert: true };

        // create a document that sets name and html attributes of the document.
        const updateDoc = {
            $addToSet: {
                documents: doc,
            },
        };

        try {
            // Insert document
            const result = await queries.save(filter, updateDoc, options);

            // Check for successful operation and return status 200.
            if (result.acknowledged) {
                return res.status(201).json({ data: result, insertedId: newId });
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
        const decodedJwt = jwtDecode(jwtHeader);

        try {
            // Find the document and update its data.
            const result = await queries.update(
                decodedJwt.username,
                ObjectId(req.body._id),
                req.body.name,
                req.body.html
            );

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

    allUsers: async function(req, res) {
        const jwtHeader = req.headers.authorization;
        const decodedJwt = jwtDecode(jwtHeader);

        try {
            // Get all documents from the collection.
            const resultSet = await queries.getAllUsers(decodedJwt.username);

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

    generatePdf: async function(req, res) {
        try {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();

            await page.setContent(req.body.html);

            const pdfBuffer = await page.pdf();

            await page.close();
            await browser.close();

            res.send(pdfBuffer);
        } catch (error) {
            console.log(error);
            // Return error specifying the route concerned.
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/generatePdf",
                    title: "Puppeteer error",
                    detail: error.message
                }
            });
        }
    },

    sendInvite(req, res) {
        const mg = mailgun({
            apiKey: process.env.MAILGUN_SECRET, domain: process.env.MAILGUN_DOMAIN
        });
        const data = {
            from: req.body.sender,
            to: req.body.email,
            subject: "Invitation",
            html: `<h2>Hello,</h2>
            <p>You have been invited to join editing on a document in EzyEditor.</p><br>
            <p>If you already have an account follow the link below and log in. If</p>
            <p>not then follow the link and register with the email adress on which</p>
            <p>you recieved this email. You will then have access to the document.<br>
            <a href='https://www.student.bth.se/~rois20/editor/#/register'>Click here to join</a>`,
        };

        try {
            mg.messages().send(data, function (error, body) {
                console.log(body);
                return res.status(200).json({ data: body });
            });
        } catch (error) {
            console.log(error);
            // Return error specifying the route concerned.
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/sendInvite",
                    title: "Mailgun error",
                    detail: error.message
                }
            });
        }
    }
};

module.exports = data;
