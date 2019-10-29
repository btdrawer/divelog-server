const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../src/app');
const users = require('./testData/user');

chai.use(chaiHttp);

var user0 = users.user0,
user1 = users.user1,
user2 = users.user2;

describe('/message', () => {
    describe('Initialisation', () => {
        it('should receive user IDs and initialise data for rest of test', (done) => {
            chai.request(app)
                .get('/user/getAllUsers')
                .end((err, res) => {
                    res.should.have.status(200);

                    user0['id'] = res.body[0].id;
                    user1['id'] = res.body[1].id;
                    user2['id'] = res.body[2].id;

                    done();
                });
        });
    });

    describe('POST /message/newGroup', () => {
        it('should POST new group', (done) => {
            chai.request(app)
            .post('/message/newGroup')
            .send({
                sender: user0.id,
                password: user0.password,
                message: 'Hi',
                participants: [user1.id, user2.id]
            })
            .end((err, res) => {
                res.should.have.status(200);

                done();
            });
        });
    });
});