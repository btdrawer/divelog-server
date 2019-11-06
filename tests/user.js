// Chai setup
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { request, expect } = chai;

// App and data
const app = require("../src/app");
const { users } = require("./testTools").data;

let tokens = [],
  user_ids = [];

describe("User", () => {
  describe("Create user", () => {
    it("should create a new user", () =>
      request(app)
        .post("/user")
        .send(users[0])
        .then(res => {
          expect(res.status).equal(200);
          expect(res).be.an("object");
          user_ids.push(res.body._id);
        }));

    it("should fail if username is not supplied", () =>
      request(app)
        .post("/user")
        .send({
          username: "thisWillFail"
        })
        .then(res => {
          expect(res.status).equal(400);
        }));

    it("should fail if password is not supplied", () =>
      request(app)
        .post("/user")
        .send({
          password: "thisWillFail"
        })
        .then(res => {
          expect(res.status).equal(400);
        }));
  });

  describe("Login", () => {
    it("should successfully login", () =>
      request(app)
        .post("/user/login")
        .send(users[0])
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");
          tokens.push(res.body.token);
        }));

    it("should fail if incorrect login details provided", () =>
      request(app)
        .post("/user")
        .send({
          username: users[0].username,
          password: "notTheCorrectPassword"
        })
        .then(res => {
          expect(res.status).equal(400);
        }));
  });

  describe("List users", () => {
    it("should list all users", () =>
      request(app)
        .get("/user")
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("array");
        }));
  });

  describe("Get user", () => {
    it("should get user", () =>
      request(app)
        .get(`/user/${user_ids[0]}`)
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");
        }));
  });

  describe("Delete user", () => {
    it("should delete user", () =>
      request(app)
        .delete("/user")
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");
        }));
  });
});
