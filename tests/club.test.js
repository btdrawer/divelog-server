const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../app');
const clubData = require('./testData/club');
const {userIds, tokens} = require('./before/before');

chai.use(chaiHttp);

let {club0, club1} = clubData;

let clubIds = {
    club0: '',
    club1: ''
};

describe('/club', () => {
    describe('New club', () => {
        it('should add a new club', (done) => {
            chai.request(app)
                .post('/club')
                .send(club0)
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');

                    done();
                });
        });

        it('should add a new club', (done) => {
            chai.request(app)
                .post('/club')
                .send(club1)
                .send(tokens.user1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');

                    done();
                });
        });

        it('should fail to add a club if name is missing', (done) => {
            chai.request(app)
                .post('/club')
                .send({location: 'Plymouth', manager: user0.id})
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(500);

                    done();
                });
        });

        it('should fail to add a club if location is missing', (done) => {
            chai.request(app)
                .post('/club')
                .send({name: 'c', manager: user0.id})
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(500);

                    done();
                });
        });

        it('should fail to add a club if manager is missing', (done) => {
            chai.request(app)
                .post('/club')
                .send({name: 'c', location: 'Plymouth'})
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(500);

                    done();
                });
        });

        it('should add the same club twice', (done) => {
            chai.request(app)
                .post('/club')
                .send(club0)
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');

                    done();
                });
        });
    });

    describe('List all clubs', () => {
        it('should get a list of all clubs', (done) => {
            chai.request(app)
                .get('/club')
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    res.body.should.be.a('array');

                    res.body.map((c) => {
                        c.should.have.property('_id');
                        c.should.have.property('name');
                        c.should.have.property('location');
                    });

                    clubIds.club0 = res.body[0];
                    clubIds.club1 = res.body[1];

                    done();
                });
        });
    });

    describe('Add club manager', () => {
        it('should return 500 if manager does not exist', (done) => {
            chai.request(app)
                .post('/club/newClubManager/' + clubId0 + '/-1')
                .send({existingManagerId: user0.id, existingManagerPassword: user0.password})
                .end((err, res) => {
                    res.should.have.status(500);

                    done();
                });
        });

        it('should return 404 if manager not supplied', (done) => {
            chai.request(app)
                .post('/club/newClubManager/' + clubId0)
                .send({existingManagerId: user0.id, existingManagerPassword: user0.password})
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                });
        });

        it('should return 500 if existing manager password incorrect', (done) => {
            chai.request(app)
            .post('/club/newClubManager/' + clubId0 + '/' + user1.id)
                .send({existingManagerId: user0.id, existingManagerPassword: 'aaaaaa'})
                .end((err, res) => {
                    res.should.have.status(500);

                    done();
                });
        });

        it('should return 500 if existing manager does not exist', (done) => {
            chai.request(app)
                .post('/club/newClubManager/' + clubId0 + '/' + user1.id)
                .send({existingManagerId: '-1', existingManagerPassword: user0.password})
                .end((err, res) => {
                    res.should.have.status(500);

                    done();
                });
        });

        it('should return 500 if existing manager id missing', (done) => {
            chai.request(app)
                .post('/club/newClubManager/' + clubId0 + '/' + user1.id)
                .send({existingManagerPassword: user0.password})
                .end((err, res) => {
                    res.should.have.status(500);

                    done();
                });
        });

        it('should return 500 if existing manager password missing', (done) => {
            chai.request(app)
                .post('/club/newClubManager/' + clubId0 + '/' + user1.id)
                .send({existingManagerId: user0.id})
                .end((err, res) => {
                    res.should.have.status(500);

                    done();
                });
        });

        it('should add a new club manager', (done) => {
            chai.request(app)
                .post('/club/newClubManager/' + clubId0 + '/' + user1.id)
                .send({existingManagerId: user0.id, existingManagerPassword: user0.password})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');

                    done();
                });
        });
    });

    describe('/club/searchClubsByName', () => {
        it('should get a list of all clubs whose names include "a"', (done) => {
            chai.request(app)
                .get('/club/searchClubsByName/a')
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    res.body.should.be.a('array');
                    res.body.should.have.length(2);

                    res.body.map((c) => {
                        c.should.have.property('id');
                        c.should.have.property('name');
                        c.should.have.property('location');

                        c.name.should.equal('a');
                    });

                    done();
                });
        });

        it('should get a list of all clubs whose names include "b"', (done) => {
            chai.request(app)
                .get('/club/searchClubsByName/b')
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    res.body.should.be.a('array');
                    res.body.should.have.length(1);

                    res.body[0].should.have.property('id');
                    res.body[0].should.have.property('name');
                    res.body[0].should.have.property('location');

                    res.body[0].name.should.equal('b');

                    done();
                });
        });

        it('should return 404 if no clubs found', (done) => {
            chai.request(app)
                .get('/club/searchClubsByName/c')
                .end((err, res) => {
                    res.should.have.status(404);
                    
                    res.body.should.be.a('array');
                    res.body.should.have.length(0);

                    done();
                });
        });
    });

    describe('/club/searchClubsByLocation', () => {
        it('should get a list of all clubs whose locations resemble "Plymouth"', (done) => {
            chai.request(app)
                .get('/club/searchClubsByLocation/Plymouth')
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    res.body.should.be.a('array');
                    res.body.should.have.length(2);

                    res.body.map((c) => {
                        c.should.have.property('id');
                        c.should.have.property('name');
                        c.should.have.property('location');

                        c.location.should.equal('Plymouth');
                    });

                    done();
                });
        });

        it('should get a list of all clubs whose locations resemble "Portland, Hampshire"', (done) => {
            chai.request(app)
                .get('/club/searchClubsByLocation/Portland, Hampshire')
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    res.body.should.be.a('array');
                    res.body.should.have.length(1);

                    res.body[0].should.have.property('id');
                    res.body[0].should.have.property('name');
                    res.body[0].should.have.property('location');

                    res.body[0].location.should.equal('Portland, Hampshire');

                    done();
                });
        });

        it('should return 404 if no clubs found', (done) => {
            chai.request(app)
                .get('/club/searchClubsByLocation/c')
                .end((err, res) => {
                    res.should.have.status(404);
                    
                    res.body.should.be.a('array');
                    res.body.should.have.length(0);

                    done();
                });
        });
    });

    describe('/club/getClub', () => {
        it('should get a club', (done) => {
            chai.request(app)
                .get('/club/getClub/' + clubId0)
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    res.body.should.be.a('array');
                    res.body.should.have.length(1);

                    res.body[0].should.have.property('id');
                    res.body[0].should.have.property('name');
                    res.body[0].should.have.property('location');

                    res.body[0].name.should.equal('a');
                    res.body[0].location.should.equal('Plymouth');

                    done();
                });
        });

        it('should get a club', (done) => {
            chai.request(app)
                .get('/club/getClub/' + clubId1)
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    res.body.should.be.a('array');
                    res.body.should.have.length(1);

                    res.body[0].should.have.property('id');
                    res.body[0].should.have.property('name');
                    res.body[0].should.have.property('location');

                    res.body[0].name.should.equal('b');
                    res.body[0].location.should.equal('Portland, Hampshire');

                    done();
                });
        });

        it('should return 404 if club not found', (done) => {
            chai.request(app)
                .get('/club/getClub/-1')
                .end((err, res) => {
                    res.should.have.status(404);
                    
                    res.body.should.be.a('array');
                    res.body.should.have.length(0);

                    done();
                });
        });
    });

    describe('/club/getClubAndManagers', () => {
        it('should get a club and its managers', (done) => {
            chai.request(app)
                .get('/club/getClubAndManagers/' + clubId0)
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    res.body.should.be.a('array');
                    res.body.should.have.length(2);

                    res.body.map((c) => {
                        c.should.have.property('id');
                        c.should.have.property('name');
                        c.should.have.property('location');
                        c.should.have.property('user');

                        c.name.should.equal('a');
                        c.location.should.equal('Plymouth');
                    });

                    res.body[0].user.should.equal(user0.id);
                    res.body[1].user.should.equal(user1.id);

                    done();
                });
        });

        it('should return 404 if club not found', (done) => {
            chai.request(app)
                .get('/club/getClub/-1')
                .end((err, res) => {
                    res.should.have.status(404);
                    
                    res.body.should.be.a('array');
                    res.body.should.have.length(0);

                    done();
                });
        });
    });

    describe('/club/updateClub', () => {
        it('should update club', (done) => {
            chai.request(app)
                .post('/club/updateClub/' + clubId0)
                .send({
                    userId: user0.id,
                    password: user0.password,
                    newDetails: {
                        name: 'a1',
                        location: 'Plymouth, UK'
                    }
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    done();
                });
        });

        it('should update club if only one new detail added', (done) => {
            chai.request(app)
                .post('/club/updateClub/' + clubId0)
                .send({
                    userId: user0.id,
                    password: user0.password,
                    newDetails: {
                        name: 'a2'
                    }
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    done();
                });
        });

        it('should return 500 if manager details are incorrect', (done) => {
            chai.request(app)
                .post('/club/updateClub/' + clubId0)
                .send({
                    userId: user0.id,
                    password: 'aaaaaa',
                    newDetails: {
                        name: 'a3'
                    }
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('array');

                    done();
                });
        });

        it('should return 500 if manager id is missing', (done) => {
            chai.request(app)
                .post('/club/updateClub/' + clubId0)
                .send({
                    password: user0.password,
                    newDetails: {
                        name: 'a3'
                    }
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('array');

                    done();
                });
        });

        it('should return 500 if manager password is missing', (done) => {
            chai.request(app)
                .post('/club/updateClub/' + clubId0)
                .send({
                    userId: user0.password,
                    newDetails: {
                        name: 'a3'
                    }
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('array');

                    done();
                });
        });
    });

    describe('/club/deleteClub', () => {
        it('should delete club', (done) => {
            chai.request(app)
                .delete('/club/deleteClub/' + clubId0)
                .send({
                    userId: user0.id,
                    password: user0.password
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    done();
                });
        });

        it('should return 500 if manager details are incorrect', (done) => {
            chai.request(app)
                .delete('/club/deleteClub/' + clubId1)
                .send({
                    userId: user0.id,
                    password: 'aaaaaa'
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');

                    done();
                });
        });

        it('should return 500 if manager id is missing', (done) => {
            chai.request(app)
                .delete('/club/deleteClub/' + clubId1)
                .send({
                    password: user0.password
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');

                    done();
                });
        });

        it('should return 500 if manager password is missing', (done) => {
            chai.request(app)
                .delete('/club/deleteClub/' + clubId1)
                .send({
                    userId: user0.id
                })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');

                    done();
                });
        });

        it('should delete club', (done) => {
            chai.request(app)
                .delete('/club/deleteClub/' + clubId1)
                .send({
                    userId: user1.id,
                    password: user1.password
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    done();
                });
        });

        it('should delete club', (done) => {
            chai.request(app)
                .delete('/club/deleteClub/' + clubId2)
                .send({
                    userId: user0.id,
                    password: user0.password
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    done();
                });
        });
    });
});