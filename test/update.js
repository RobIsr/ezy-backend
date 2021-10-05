"use strict";

/**
 * Test for /allDocs route.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const database = require("../db/database.js");
const server = require('../app.js');
const queries = require('../db/queries');

chai.should();

chai.use(chaiHttp);

var insertedId;

describe('update', () => {
    let testToken = "";

    before(async () => {
        await chai.request(server)
            .put("/register")
            .send({
                username: 'test',
                password: 'test',
            });

        await chai.request(server)
            .post("/login")
            .send({
                username: 'test',
                password: 'test',
            }).then((res) => {
                testToken = res.body.accessToken;
            });

        await chai.request(server)
            .post('/save')
            .set({ Authorization: testToken })
            .type('documents')
            .field({
                name: 'test_document',
                html: 'test',
            }).then((res) => {
                insertedId = res.body.data.insertedId + "";
            });
    });

    // Clean up database after completed tests.
    after(async () => {
        const db = await database.getDb();

        await db.collection.drop();
        await db.userCollection.drop();

        await db.client.close();
    });

    it('Check successful update operation on document.', (done) => {
        console.log("Before update: ", insertedId);
        chai.request(server)
            .put("/update")
            .set({ Authorization: testToken })
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
            .set({ Authorization: testToken })
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
