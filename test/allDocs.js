"use strict";

/**
 * Test for /allDocs route.
 */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app.js');

chai.should();

chai.use(chaiHttp);

describe('allDocs', () => {
    describe('GET /allDocs', () => {
        it('Check success', (done) => {
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
    });
});
