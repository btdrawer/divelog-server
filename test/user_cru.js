const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../app');
const users = require('./user_details');

chai.use(chaiHttp);

var user0 = users.user0,
user1 = users.user1,
user2 = users.user2;

describe('User', () => {
    describe('Create user', () => {
        it('should create a new user', (done) =>{
            chai.request(app)
                .post('/users')
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    done();
                });
        });

        it('should create a new user', (done) =>{
            chai.request(app)
                .post('/users')
                .send(user1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    done();
                });
        });

        it('should create a new user', (done) =>{
            chai.request(app)
                .post('/users')
                .send(user2)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    done();
                });
        });
    });

    describe('Get user by username', () => {
        it('should get a user by username', (done) =>{
            chai.request(app)
                .get('/users/username/' + user0.username)
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a('object');

                    res.body.should.have.property('id');
                    res.body.should.have.property('username');
                    res.body.should.have.property('password');

                    res.body.username.should.equal(user0.username);

                    user0['id'] = res.body.id;

                    done();
                });
        });

        it('should fail to get a user if username does not exist', (done) =>{
            chai.request(app)
                .get('/users/username/aaasdfjjbojj')
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                });
        });
    });

    describe('Get user by ID', () => {
        it('should get a user by ID', (done) =>{
            chai.request(app)
                .get('/users/id/' + user0.id)
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a('object');

                    res.body.should.have.property('id');
                    res.body.should.have.property('username');
                    res.body.should.have.property('password');

                    res.body.username.should.equal(user0.username);

                    done();
                });
        });

        it('should fail to get a user if ID does not exist', (done) =>{
            chai.request(app)
                .get('/users/id/-1')
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                });
        });
    });

    describe('Get all users', () => {
        it('should get all users', (done) =>{
            chai.request(app)
                .get('/users')
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a('array');
                    res.body.should.have.length(3);

                    done();
                });
        });
    });

    describe('Update user', () => {
        let user0a = {
            username: 'user0a',
            password: 'passw0rd'
        };

        it('should update username and password', (done) => {
            chai.request(app)
                .put('/users/' + user0.id)
                .send({
                    new_properties: user0a
                })
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('should update username', (done) => {
            chai.request(app)
                .put('/users/' + user0.id)
                .send({
                    new_properties: {
                        username: user0.username
                    }
                })
                .send(user0a)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('should update password', (done) => {
            chai.request(app)
                .put('/users/' + user0.id)
                .send({
                    new_properties: {
                        password: user0.password
                    }
                })
                .send({
                    username: user0.username,
                    password: user0a.password
                })
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('should return 404 if user does not exist', (done) => {
            chai.request(app)
                .put('/users/-1')
                .send({
                    new_properties: {
                        password: 'passw0rd'
                    }
                })
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                });
        });

        it('should return 401 if password is incorrect', (done) => {
            chai.request(app)
                .put('/users/' + user0.id)
                .send({
                    new_properties: {
                        password: 'passw0rd'
                    }
                })
                .send({
                    username: user0.username,
                    password: 'sabhjfsajbfds'
                })
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('should return 400 if password is missing', (done) => {
            chai.request(app)
                .put('/users/' + user0.id)
                .send({
                    new_properties: {
                        username: 'user0b'
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
});