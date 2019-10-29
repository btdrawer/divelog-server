const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../src/app');
const userData = require('./testData/user');

chai.use(chaiHttp);

let {user0, user1, user2} = userData;

let userIds = {
    user0: '',
    user1: '',
    user2: ''
};

let tokens = {
    user0: '',
    user1: '',
    user2: ''
};

describe('User', () => {
    describe('Create user', () => {
        it('should create a new user', (done) =>{
            chai.request(app)
                .post('/user')
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    userIds.user0 = res.body._id;
                    tokens.user0 = res.body.token;

                    done();
                });
        });

        it('should create a new user', (done) =>{
            chai.request(app)
                .post('/user')
                .send(user1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    userIds.user1 = res.body._id;
                    tokens.user1 = res.body.token;

                    done();
                });
        });

        it('should create a new user', (done) =>{
            chai.request(app)
                .post('/user')
                .send(user2)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    userIds.user2 = res.body._id;
                    tokens.user2 = res.body.token;

                    done();
                });
        });
    });

    describe('Login', () => {
        it('should login', (done) =>{
            chai.request(app)
                .post('/user/login')
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    tokens.user1 = res.body.token;

                    done();
                });
        });
    });

    describe('Get user by username', () => {
        it('should get a user by username', (done) =>{
            chai.request(app)
                .get('/user')
                .send({
                    username: user1.username
                })
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a('array');
                    res.body.should.have.length(1);

                    let user = res.body[0];

                    user.should.have.property('_id');
                    user.should.have.property('username');
                    user.should.not.have.property('password');

                    user._id.should.equal(userIds.user1);
                    user.username.should.equal(user1.username);

                    done();
                });
        });

        it('should fail to get a user if username does not exist', (done) =>{
            chai.request(app)
                .get('/user')
                .send({
                    username: 'agjhgdjhasg'
                })
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                });
        });
    });

    describe('Get user by ID', () => {
        it('should get a user by ID', (done) =>{
            chai.request(app)
                .get(`/user/${user1.id}`)
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a('object');

                    res.body.should.have.property('_id');
                    res.body.should.have.property('username');
                    res.body.should.not.have.property('password');

                    res.body._id.should.equal(userIds.user1);
                    res.body.username.should.equal(user1.username);

                    done();
                });
        });

        it('should fail to get a user if ID does not exist', (done) =>{
            chai.request(app)
                .get('/user/-1')
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                });
        });
    });

    describe('List users', () => {
        it('should list all users', (done) =>{
            chai.request(app)
                .get('/user')
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');

                    done();
                });
        });
    });

    describe('Update user', () => {
        let user0Update = {
            username: 'user0a',
            password: 'passw0rd'
        };

        it('should update username and password', (done) => {
            chai.request(app)
                .put('/user')
                .send(user0Update)
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a('object');
                    res.body.username.should.equal(user0Update.username);

                    tokens.user0 = res.body.token;

                    done();
                });
        });

        it('should update username', (done) => {
            chai.request(app)
                .put('/user')
                .send({
                    username: user0.username
                })
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.a('object');
                    res.body.username.should.equal(user0.username);

                    done();
                });
        });

        it('should update password', (done) => {
            chai.request(app)
                .put('/user')
                .send({
                    password: user0.password
                })
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    tokens.user0 = res.body.token;

                    done();
                });
        });
    });

    describe('Delete user', () => {
        it('should delete user', (done) => {
            chai.request(app)
                .delete('/user')
                .send(tokens.user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('should delete user', (done) => {
            chai.request(app)
                .delete('/user')
                .send(tokens.user1)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('should delete user', (done) => {
            chai.request(app)
                .delete('/user')
                .send(tokens.user2)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });
    });
});