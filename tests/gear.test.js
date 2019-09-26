const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../app');
const users = require('./testData/user');

chai.use(chaiHttp);

var gear0 = {
    brand: 'A', 
    name: 'A1', 
    type: 'Computer', 
};

var gear1 = {
    name: 'a', 
    type: 'c'
};

var gear2 = {
    name: 'B', 
    brand: 'B1', 
    type: 'Wetsuit', 
};

var gearId0;
var gearId1;
var user0 = users.user0;
var user1 = users.user1;

describe('Gear', () => {
    describe('Initialisation', () => {
        it('should receive user IDs and initialise data for rest of test', (done) => {
            chai.request(app)
                .get('/users')
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    user0.id = res.body[0].id;
                    user1.id = res.body[1].id;

                    gear0.ownerId = user0.id;
                    gear2.ownerId = user0.id;

                    done();
                });
        });
    });

    describe('Create gear', () => {
        it('should create new gear', (done) => {
            chai.request(app)
                .post('/gear')
                .send(gear0)
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    done();
                });
        });

        it('should create new gear', (done) => {
            chai.request(app)
                .post('/gear')
                .send(gear2)
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    done();
                });
        });
    });

    describe('Get all user gear', () => {
        it('should get all gear from a particular user', (done) => {
            chai.request(app)
                .get('/gear')
                .send({
                    ownerId: user0.id
                })
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a('array');
                    res.body.should.have.length(2);

                    res.body[0].should.have.property('brand');
                    res.body[0].should.have.property('name');
                    res.body[0].should.have.property('type');
                    res.body[0].should.have.property('id');
                    res.body[0].should.have.property('ownerId');

                    res.body[0].brand.should.equal('A');
                    res.body[0].name.should.equal('A1');
                    res.body[0].type.should.equal('Computer');
                    res.body[0].ownerId.should.equal(user0.id);

                    res.body[1].should.have.property('brand');
                    res.body[1].should.have.property('name');
                    res.body[1].should.have.property('type');
                    res.body[1].should.have.property('id');
                    res.body[1].should.have.property('ownerId');

                    res.body[1].brand.should.equal('B1');
                    res.body[1].name.should.equal('B');
                    res.body[1].type.should.equal('Wetsuit');
                    res.body[1].ownerId.should.equal(user0.id);

                    gearId0 = res.body[0].id;
                    gearId1 = res.body[1].id;

                    done();
                });
        });

        it('should return 404 if user does not exist', (done) => {
            chai.request(app)
                .get('/gear/-1')
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                });
        });

        it('should return 401 if password is incorrect', (done) => {
            chai.request(app)
                .get('/gear/' + user0.password)
                .send({
                    username: user0.username,
                    password: 'aaaaaa'
                })
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('should return 404 if user does not have any gear', (done) => {
            chai.request(app)
                .get('/gear/' + user1.id)
                .send(user1)
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                });
        });
    });

    describe('Get gear', () =>{
        it('should get gear', (done) => {
            chai.request(app)
                .get('/gear/' + gearId0)
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a('array');
                    res.body.should.have.length(1);

                    res.body[0].should.have.property('brand');
                    res.body[0].should.have.property('name');
                    res.body[0].should.have.property('type');
                    res.body[0].should.have.property('id');
                    res.body[0].should.have.property('ownerId');

                    res.body[0].brand.should.equal('A');
                    res.body[0].name.should.equal('A1');
                    res.body[0].type.should.equal('Computer');
                    res.body[0].ownerId.should.equal(user0.id);

                    done();
                });
        });

        it('should return 401 if user does not exist', (done) => {
            chai.request(app)
                .get('/gear/' + gearId0)
                .send({
                    username: 'ashjfjkadshfkj', 
                    password: user0.password
                })
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('should return 404 if user does not match gear', (done) => {
            chai.request(app)
                .get('/gear/' + gearId0)
                .send(user1)
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                });
        });

        it('should return 400 if password does not exist', (done) => {
            chai.request(app)
                .get('/gear/' + gearId0)
                .send({
                    username: user0.username
                })
                .end((err, res) => {
                    res.should.have.status(400);

                    done();
                });
        });

        it('should return 401 if password is incorrect', (done) => {
            chai.request(app)
                .get('/gear/' + gearId0)
                .send({
                    username: user0.username, 
                    password: 'aaaaaa'
                })
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('should return 404 if gear does not exist', (done) => {
            chai.request(app)
                .get('/gear/-1')
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                });
        });
    });

    describe('Update gear', () => {
        it('should successfully change all gear details', (done) => {
            chai.request(app)
                .put('/gear/' + gearId0)
                .send({
                    new_properties: {
                        brand: 'C',
                        name: 'C1',
                        type: 'Watch'
                    }
                })
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                })
        });

        it('should successfully change one detail', (done) => {
            chai.request(app)
                .put('/gear/' + gearId0)
                .send({
                    new_properties: {
                        name: 'C2'
                    }
                })
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('should return 401 if username is incorrect', (done) => {
            chai.request(app)
                .put('/gear/' + gearId0)
                .send({
                    new_properties: {
                        name: 'C3'
                    }
                })
                .send({
                    username: 'sahkshakf',
                    password: user0.password
                })
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('should return 401 if password is incorrect', (done) => {
            chai.request(app)
                .put('/gear/' + gearId0)
                .send({
                    new_properties: {
                        name: 'C3'
                    }
                })
                .send({
                    username: user0.username,
                    password: 'shadfjkhasjfkh'
                })
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('should return 400 if username is missing', (done) => {
            chai.request(app)
                .put('/gear/' + gearId0)
                .send({
                    new_properties: {
                        name: 'C3'
                    }
                })
                .send({
                    password: user0.password
                })
                .end((err, res) => {
                    res.should.have.status(400);

                    done();
                });
        });

        it('should return 400 if password is missing', (done) => {
            chai.request(app)
                .put('/gear/' + gearId0)
                .send({
                    new_properties: {
                        name: 'C3'
                    }
                })
                .send({
                    username: user0.username
                })
                .end((err, res) => {
                    res.should.have.status(400);

                    done();
                });
        });
    });

    describe('Delete gear', () => {
        it('should return 401 if username is incorrect', (done) => {
            chai.request(app)
                .delete('/gear/' + gearId0)
                .send({
                    username: 'sdasf',
                    password: user0.password
                })
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('should return 401 if password is incorrect', (done) => {
            chai.request(app)
                .delete('/gear/' + gearId0)
                .send({
                    username: user0.username,
                    password: 'safhjsghjfg'
                })
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('should return 400 if username is missing', (done) => {
            chai.request(app)
                .delete('/gear/' + gearId0)
                .send({
                    password: user0.password
                })
                .end((err, res) => {
                    res.should.have.status(400);

                    done();
                });
        });

        it('should return 400 if password is missing', (done) => {
            chai.request(app)
                .delete('/gear/' + gearId0)
                .send({
                    username: user0.username
                })
                .end((err, res) => {
                    res.should.have.status(400);

                    done();
                });
        });

        it('should successfully delete gear', (done) => {
            chai.request(app)
                .delete('/gear/' + gearId0)
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('should successfully delete gear', (done) => {
            chai.request(app)
                .delete('/gear/' + gearId1)
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });
    });
});