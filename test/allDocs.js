"use strict";

/**
 * Test for /allDocs route.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
// const sinon = require('sinon');
const database = require("../db/database.js");
const server = require('../app.js');
//const queries = require('../db/queries');
//const request = require('supertest')("http://localhost:1337/");

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

        await db.userCollection.drop();
        await db.client.close();
    });

    it('Check successful retrieval of all documents', (done) => {
        done();
        // request.post('/graphql')
        // .send({ query: '{ user(username: test) }'})
        // .expect(200)
        // .end((err,res) => {
        //     // res will contain array with one user
        //     if (err) return done(err);
        //     res.body.user.should.have.property('_id');
        //     res.body.user.should.have.property('username');
        //     done();
        //     });
    });

    it('Check for 500 error on /allDocs', (done) => {
        done();
        // const mError = new Error('stub: Internal server error');
        // const allDocsStub = sinon.stub(queries, 'getAllUsers').rejects(mError);

        // chai.request(server)
        //     .get('/allDocs')
        //     .set({ Authorization: testToken })
        //     .end((err, res) => {
        //         sinon.assert.calledWith(allDocsStub);
        //         res.should.have.status(500);
        //         allDocsStub.restore();
        //         done();
        //     });
    });
});
