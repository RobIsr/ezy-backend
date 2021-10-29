"use strict";

/**
 * Test for /allDocs route.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const database = require('../db/database');
const server = require('../app.js');
const helpers = require('./helpers');

chai.should();

chai.use(chaiHttp);

describe('allDocs', () => {
    let testToken = "";

    before(async () => {
        await helpers.initUser();
        testToken = helpers.login();

        await helpers.insertOne();
    });

    // Clean up database after completed tests.
    after(async () => {
        const db = await database.getDb();

        await helpers.dropDb(db);
    });

    it('Check successful retrieval of all documents', (done) => {
        chai.request(server)
            .post('/graphql')
            .set({ Authorization: testToken })
            .send({ query: `
            {
                allDocuments(username: "test@test.com") {
                _id
                owner
                type
                allowedUsers
                name
                html
                }
            }
            `})
            .end((err, res) => {
                const resObject = JSON.parse(res.text);
                const allDocs = resObject.data.allDocuments;

                res.should.have.status(200);
                allDocs.should.be.an("array");
                allDocs.length.should.be.equal(1);
                allDocs[0].name.should.equal("test-doc");
                allDocs[0].html.should.equal("test");
                done();
            });
    });
});

describe('Add and update document', () => {
    let testToken = "";
    let idToUpdate = null;

    before(async () => {
        await helpers.initUser();
        testToken = helpers.login();

        await helpers.insertOne();
    });

    // Clean up database after completed tests.
    after(async () => {
        const db = await database.getDb();

        await helpers.dropDb(db);
    });

    it('Inserts one document', (done) => {
        chai.request(server)
            .post('/save')
            .set({ Authorization: testToken })
            .send({
                "type": "text",
                "name": "test-2",
                "html": "test"
            }).end(() => {
                helpers.getAll().then(
                    (users) => {
                        const documents = users[0].documents;

                        idToUpdate = documents[0]._id;
                        try {
                            documents.should.be.an("array");
                            documents.length.should.be.equal(2);
                            documents[1].name.should.equal("test-2");
                            documents[1].html.should.equal("test");
                            done();
                        } catch (error) {
                            done(error);
                        }
                    });
            });
    });

    it('Updates one document', (done) => {
        chai.request(server)
            .put('/update')
            .set({ Authorization: testToken })
            .send({
                "_id": idToUpdate,
                "name": "test-updated",
                "html": "test-updated"
            }).end(() => {
                helpers.getAll().then(
                    (users) => {
                        const documents = users[0].documents;

                        try {
                            documents.should.be.an("array");
                            documents.length.should.be.equal(2);
                            documents[0].name.should.equal("test-updated");
                            documents[0].html.should.equal("test-updated");
                            done();
                        } catch (error) {
                            done(error);
                        }
                    });
            });
    });

    it('Inserts documents with correct type', (done) => {
        // Insert text document
        chai.request(server)
            .post('/save')
            .set({ Authorization: testToken })
            .send({
                "type": "text",
                "name": "test-2",
                "html": "test"
            });

        // Insert code document.
        chai.request(server)
            .post('/save')
            .set({ Authorization: testToken })
            .send({
                "type": "code",
                "name": "code-2",
                "html": "code"
            }).end(() => {
                helpers.getAll().then(
                    (users) => {
                        const documents = users[0].documents;

                        try {
                            documents.should.be.an("array");
                            documents.length.should.be.equal(3);
                            documents[1].type.should.equal("text");
                            documents[2].type.should.equal("code");
                            done();
                        } catch (error) {
                            done(error);
                        }
                    });
            });
    });
});

describe('Creation of pdf', () => {
    let testToken = "";

    before(async () => {
        await helpers.initUser();
        testToken = helpers.login();
    });

    // Clean up database after completed tests.
    after(async () => {
        const db = await database.getDb();

        await helpers.dropDb(db);
    });

    it('Successfully creates PDF', (done) => {
        chai.request(server)
            .post('/generatePdf')
            .set({ Authorization: testToken })
            .send({
                "html": "<p>Test</p>",
            }).then((res) => {
                try {
                    res.status.should.equal(200);
                    res.type.should.equal("application/octet-stream");
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });
});

describe('Email invitation', () => {
    let testToken = "";

    before(async () => {
        await helpers.initUser();
        testToken = helpers.login();
    });

    // Clean up database after completed tests.
    after(async () => {
        const db = await database.getDb();

        await helpers.dropDb(db);
    });

    it('Sends email invite', (done) => {
        chai.request(server)
            .post('/sendInvite')
            .set({ Authorization: testToken })
            .send({
                "sender": "test@test.com",
                "email": "recipient@recipient.com"
            }).then(async (res) => {
                try {
                    res.status.should.equal(200);
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });
});
