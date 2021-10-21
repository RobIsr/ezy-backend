require('dotenv-flow').config();

var express = require('express');
var router = express.Router();
const dataModel = require('../models/data');
const jwt = require('jsonwebtoken');

router.get('/allDocs', async function(req, res) {
    checkToken(req, res, () => {
        dataModel.allDocs(req, res);
    });
});

router.post('/save', async function(req, res) {
    checkToken(req, res, () => {
        dataModel.save(req, res);
    });
});

router.put('/update', async function(req, res) {
    checkToken(req, res, () => {
        dataModel.update(req, res);
    });
});

router.get('/allUsers', async function(req, res) {
    checkToken(req, res, () => {
        dataModel.allUsers(req, res);
    });
});

router.post('/addComment', async function(req, res) {
    checkToken(req, res, () => {
        dataModel.addComment(req, res);
    });
});

router.post('/generatePdf', async function(req, res) {
    checkToken(req, res, () => {
        dataModel.generatePdf(req, res);
    });
});

router.post('/sendInvite', async function(req, res) {
    checkToken(req, res, () => {
        dataModel.sendInvite(req, res);
    });
});

function checkToken(req, res, next) {
    const jwtHeader = req.headers.authorization;

    if (jwtHeader == null) {
        return res.sendStatus(401);
    }

    jwt.verify(jwtHeader, process.env.JWT_SECRET, function(err) {
        if (err) {
            return res.sendStatus(403);
        }

        // Valid token send on the request
        next();
    });
}

module.exports = router;
