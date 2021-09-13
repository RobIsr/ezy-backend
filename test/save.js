"use strict";

/**
 * Test for /save route.
 */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app.js');

chai.should();

chai.use(chaiHttp);

describe('save', () => {
    describe('POST /save', () => {
        it('Check success', (done) => {
            chai.request(server)
                .post('/save')
                .type('documents')
                .field({
                    '_id': '1',
                    'name': 'test-name',
                    'html': 'test-html',
                }).end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
    });
});
