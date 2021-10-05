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

describe('allDocs', () => {
    let testToken = "";

    //Insert one document used to check in the tests.
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
                return;
            });

        await chai.request(server)
            .post('/save')
            .set({ Authorization: testToken })
            .type('documents')
            .field({
                name: 'test-name',
                html: 'test-html',
            });
    });

    // Clean up database after completed tests.
    after(async () => {
        const db = await database.getDb();

        await db.collection.drop();
        await db.userCollection.drop();

        await db.client.close();
    });

    it('Check successful retrieval of all documents', (done) => {
        chai.request(server)
            .get("/allDocs")
            .set({ Authorization: testToken })
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
            .set({ Authorization: testToken })
            .end((err, res) => {
                sinon.assert.calledWith(allDocsStub);
                res.should.have.status(500);
                allDocsStub.restore();
                done();
            });
    });
});
