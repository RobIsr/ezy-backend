// "use strict";

/**
 * Test for errors in routes.
 */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

describe('errors', () => {
    it('Check 404 error on bad route', (done) => {
        chai.request(server)
            .get('/bad_route')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
});
