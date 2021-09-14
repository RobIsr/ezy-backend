"use strict";

/**
 * Test for /allDocs route.
 */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const database = require("../db/database.js");
const server = require('../src/app.js');
const queries = require('../db/queries');

chai.should();

chai.use(chaiHttp);

var insertedId;

describe('update', () => {
    //Insert one document used in the update uperation.
    before(async () => {
        const db = await database.getDb();
        var result = {};

        result = await db.collection.insertOne({
            name: "test_document",
            html: "test"
        })
            .catch((error) => {
                console.log(error);
            })
            .finally(async function() {
                await db.client.close();
            });
        insertedId = result.insertedId + "";
    });

    // Clean up database after completed tests.
    after(async () => {
        const db = await database.getDb();

        db.collection.deleteMany()
            .finally(async function() {
                await db.client.close();
            });
    });

    it('Check successful update operation on document.', (done) => {
        console.log("Before update: ", insertedId);
        chai.request(server)
            .put("/update")
            .send({
                _id: insertedId,
                name: 'updated-name',
                html: 'updated-html',
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.an("object");
                res.body.data.matchedCount.should.be.above(0);
                res.body.data.modifiedCount.should.be.above(0);
                done();
            });
    });

    it('Check for update 500 error', (done) => {
        const mError = new Error('stub: Internal server error');
        const updateStub = sinon.stub(queries, 'update').rejects(mError);
        const filter = { _id: "1" };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                name: "test_doc",
                html: "test"
            },
        };

        updateStub.withArgs(filter, updateDoc, options);

        updateStub(filter, updateDoc, options);

        chai.request(server)
            .put('/update')
            .send({
                _id: "1",
                name: 'updated-name',
                html: 'updated-html',
            })
            .end((err, res) => {
                sinon.assert.calledWith(updateStub);
                res.should.have.status(500);
                updateStub.restore();
                done();
            });
    });
});
