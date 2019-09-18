const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../app');
const users = require('./user_details');

chai.use(chaiHttp);

var user0 = users.user0,
user1 = users.user1,
user2 = users.user2;

describe('Delete users', () => {
    describe('Initialisation', () => {
        it('should receive user IDs and initialise data for rest of test', (done) => {
            chai.request(app)
                .get('/users')
                .send(user1)
                .end((err, res) => {
                    res.should.have.status(200);

                    user0['id'] = res.body[0].id;
                    user1['id'] = res.body[1].id;
                    user2['id'] = res.body[2].id;

                    done();
                });
        });
    });

    describe('Delete user', () => {
        it('should return 404 if user does not exist', (done) => {
            chai.request(app)
                .delete('/users/-1')
                .send(user1)
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                });
        });

        it('should return 400 if password is missing', (done) => {
            chai.request(app)
                .delete('/users/' + user0.id)
                .send({
                    username: user1.username
                })
                .end((err, res) => {
                    res.should.have.status(400);

                    done();
                });
        });

        it('should return 401 if password is incorrect', (done) => {
            chai.request(app)
                .delete('/users/' + user0.id)
                .send({
                    username: user1.username,
                    password: 'aaaaa'
                })
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('should delete user', (done) => {
            chai.request(app)
                .delete('/users/' + user0.id)
                .send(user0)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('should delete user', (done) => {
            chai.request(app)
                .delete('/users/' + user1.id)
                .send(user1)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('should delete user', (done) => {
            chai.request(app)
                .delete('/users/' + user2.id)
                .send(user2)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });
    });
});