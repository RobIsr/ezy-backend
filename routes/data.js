var express = require('express');
var router = express.Router();
const dataModel = require('../models/data');

router.get('/allDocs', async function(req, res) {
    dataModel.allDocs(req, res);
});

router.post('/save', async function(req, res) {
    dataModel.save(req, res);
});

router.put('/update', async function(req, res) {
    dataModel.update(req, res);
});

module.exports = router;