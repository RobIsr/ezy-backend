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

router.get('/allowedUsers/:id', async function(req, res) {
    checkToken(req, res, () => {
        dataModel.getAllowedUsernames(req, res);
    });
});

router.get('/allUsers', async function(req, res) {
    checkToken(req, res, () => {
        dataModel.allUsers(req, res);
    });
});

router.put('/updateAllowedUsers', async function(req, res) {
    checkToken(req, res, () => {
        dataModel.updateAllowedUsers(req, res);
    });
});

router.put('/removeAllowedUser', async function(req, res) {
    checkToken(req, res, () => {
        dataModel.removeAllowedUser(req, res);
    });
});

function checkToken(req, res, next) {
    const jwtHeader = req.headers.authorization;

    console.log(jwtHeader);

    if (jwtHeader == null) {
        return res.sendStatus(401);
    }

    jwt.verify(jwtHeader, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            return res.sendStatus(403);
        }

        // Valid token send on the request
        next();
    });
}

module.exports = router;