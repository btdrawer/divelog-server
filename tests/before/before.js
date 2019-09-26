const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const userData = require('./testData/user');

const {user0, user1, user2} = userData;

module.exports = async () => {
    let userIds = {
        user0: '',
        user1: '',
        user2: ''
    };

    let tokens = {
        user0: '',
        user1: '',
        user2: ''
    }

    await chai.request(app)
        .post('/user')
        .send(user0)
        .end((err, res) => {
            userIds.user0 = res.body._id;
            tokens.user0 = res.body.token;
        });

    await chai.request(app)
        .post('/user')
        .send(user1)
        .end((err, res) => {
            userIds.user1 = res.body._id;
            tokens.user1 = res.body.token;
        });
    
    await chai.request(app)
        .post('/user')
        .send(user2)
        .end((err, res) => {
            userIds.user2 = res.body._id;
            tokens.user2 = res.body.token;
        });
    
    return {userIds, tokens};
}