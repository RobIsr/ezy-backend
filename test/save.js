"use strict";

/**
 * Test for /save route.
 */

const database = require("../db/database.js");

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const server = require('../app.js');
const queries = require('../db/queries');

chai.should();

chai.use(chaiHttp);

describe('save', () => {
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
                return;
            });
    });

    after(async () => {
        const db = await database.getDb();

        await db.userCollection.drop();

        await db.client.close();
    });

    it('Check success', (done) => {
        chai.request(server)
            .post('/save')
            .set({ Authorization: testToken })
            .type('documents')
            .field({
                name: 'test-name',
                html: 'test-html',
            }).end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });

    // it('Check data count to make sure one document was inserted.', (done) => {
    //     chai.request(server)
    //         .get("/allDocs")
    //         .set({ Authorization: testToken })
    //         .end((err, res) => {
    //             console.log(res.body);
    //             res.should.have.status(200);
    //             res.body.should.be.an("object");
    //             res.body.data.should.be.an("array");
    //             res.body.data.length.should.be.equal(1);
    //             done();
    //         });
    // });

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
            .set({ Authorization: testToken })
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
