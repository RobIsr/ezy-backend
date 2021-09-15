"use strict";

/**
 * Test for /allDocs route.
 */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

describe('index /', () => {
    it('Check index route for 200 status', (done) => {
        chai.request(server)
            .get("/")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
