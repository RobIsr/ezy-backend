"use strict";

/**
 * Test for /allDocs route.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const database = require('../db/database');
const server = require('../app.js');
const helpers = require('./helpers');
const expect = chai.expect;

chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {
    // Clean up database after completed tests.
    after(async () => {
        const db = await database.getDb();

        await helpers.dropDb(db);
    });

    it('Registers new user', (done) => {
        chai.request(server)
            .put('/register')
            .send({
                username: "test@test.com",
                password: "test"
            })
            .end(() => {
                helpers.getAll().then((users) => {
                    try {
                        users.should.be.an("array");
                        users.length.should.be.equal(1);
                        users[0].username.should.equal("test@test.com");
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
            });
    });

    it('Logs user in', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                username: "test@test.com",
                password: "test"
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property("accessToken");
                res.body.accessToken.should.not.equal("");
                done();
            });
    });
});
