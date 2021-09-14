"use strict";

/**
 * Test for /save route.
 */

process.env.NODE_ENV = 'test';

const database = require("../db/database.js");

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const server = require('../src/app.js');
const queries = require('../db/queries');

chai.should();

chai.use(chaiHttp);

describe('save', () => {
    after(async () => {
        const db = await database.getDb();

        db.collection.deleteMany()
            .finally(async function() {
                await db.client.close();
            });
    });

    it('Check success', (done) => {
        chai.request(server)
            .post('/save')
            .type('documents')
            .field({
                name: 'test-name',
                html: 'test-html',
            }).end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });

    it('Check data count to make sure one document was inserted.', (done) => {
        chai.request(server)
            .get("/allDocs")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("object");
                res.body.data.should.be.an("array");
                res.body.data.length.should.be.equal(1);
                done();
            });
    });

    it('Check for 500 error on /save', (done) => {
        const mError = new Error('stub: Internal server error');
        const saveStub = sinon.stub(queries, 'save').rejects(mError);

        const doc = {
            type: "documents",
            name: "test doc",
            html: "test",
        };

        saveStub.withArgs(doc);
        saveStub(doc);

        chai.request(server)
            .post('/save')
            .field({
                name: 'test-name',
                html: 'test-html',
            })
            .end((err, res) => {
                sinon.assert.calledWith(saveStub);
                res.should.have.status(500);
                saveStub.restore();
                done();
            });
    });
});
