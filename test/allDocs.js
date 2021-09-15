"use strict";

/**
 * Test for /allDocs route.
 */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const database = require("../db/database.js");
const server = require('../app.js');
const queries = require('../db/queries');

chai.should();

chai.use(chaiHttp);

describe('allDocs', () => {
    //Insert one document used to check in the tests.
    before(async () => {
        const db = await database.getDb();

        await db.collection.insertOne({
            name: "test_document",
            html: "test"
        }).finally(async function() {
            await db.client.close();
        });
    });

    // Clean up database after completed tests.
    after(async () => {
        const db = await database.getDb();

        db.collection.deleteMany({})
            .catch(function(error) {
                console.log(error);
            })
            .finally(async function() {
                await db.client.close();
            });
    });

    it('Check successful retrieval of all documents', (done) => {
        chai.request(server)
            .get("/allDocs")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("object");
                res.body.data.should.be.an("array");
                res.body.data.length.should.be.above(0);
                done();
            });
    });

    it('Check for 500 error on /allDocs', (done) => {
        const mError = new Error('stub: Internal server error');
        const allDocsStub = sinon.stub(queries, 'getAll').rejects(mError);

        chai.request(server)
            .get('/allDocs')
            .end((err, res) => {
                sinon.assert.calledWith(allDocsStub);
                res.should.have.status(500);
                sinon.restore();
                done();
            });
    });
});
