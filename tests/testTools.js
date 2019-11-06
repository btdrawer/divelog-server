exports.data = {
  users: [
    {
      name: "user",
      username: "user0",
      password: "password"
    },
    {
      name: "user",
      username: "user1",
      password: "password"
    }
  ],
  gear: [
    {
      brand: "A",
      name: "A1",
      type: "Wetsuit"
    }
  ],
  club: [
    {
      name: "A",
      location: "A1",
      description: "Club",
      website: "example.com"
    }
  ]
};

exports.before = async () => {
  // Chai setup
  const chai = require("chai");
  const chaiHttp = require("chai-http");
  chai.use(chaiHttp);
  const { request, expect } = chai;

  // App and data
  const app = require("../src/app");
  const { users } = exports.data;

  let tokens = [],
    user_ids = [];

  await request(app)
    .post("/user")
    .send(users[0])
    .then(res => {
      expect(res.status).equal(200);
      expect(res).be.an("object");
      user_ids.push(res.body._id);
    });

  await request(app)
    .post("/user/login")
    .send(users[0])
    .then(res => {
      expect(res.status).equal(200);
      expect(res).be.an("object");
      tokens.push(res.body.token);
    });

  return { tokens: tokens, user_ids: user_ids };
};

exports.after = async tokens => {
  // Chai setup
  const chai = require("chai");
  const chaiHttp = require("chai-http");
  chai.use(chaiHttp);
  const { request, expect } = chai;

  // App
  const app = require("../src/app");

  tokens.forEach(token =>
    request(app)
      .delete("/user")
      .set({ Authorization: `Bearer ${token}` })
      .then(res => {
        expect(res.status).equal(200);
        expect(res).be.an("object");
      })
  );
};
