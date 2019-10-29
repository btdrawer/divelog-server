const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const app = require("../src/app");
const users = require("./testData/user");

chai.use(chaiHttp);

var user0 = users.user0,
  user1 = users.user1,
  user2 = users.user2;

describe("Friend", () => {
  describe("Initialisation", () => {
    it("should receive user IDs and initialise data for rest of test", done => {
      chai
        .request(app)
        .get("/users")
        .send(user0)
        .end((err, res) => {
          res.should.have.status(200);

          user0["id"] = res.body[0].id;
          user1["id"] = res.body[1].id;
          user2["id"] = res.body[2].id;

          done();
        });
    });
  });

  describe("Send friend request", () => {
    it("should return 401 if password is incorrect", done => {
      chai
        .request(app)
        .post("/friends/" + user0.id + "/" + user1.id)
        .send({
          username: user0.username,
          password: "aaaaaaa"
        })
        .end((err, res) => {
          res.should.have.status(401);

          done();
        });
    });

    it("should return 400 if password is missing", done => {
      chai
        .request(app)
        .post("/friends/" + user0.id + "/" + user1.id)
        .send({
          username: user0.username
        })
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });

    it("should send a friend request", done => {
      chai
        .request(app)
        .post("/friends/" + user0.id + "/" + user1.id)
        .send(user0)
        .end((err, res) => {
          res.should.have.status(200);

          done();
        });
    });

    it("should return 404 if friend to be requested does not exist", done => {
      chai
        .request(app)
        .post("/friends/" + user0.id + "/-1")
        .send(user0)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });
  });

  describe("Accept friend request", () => {
    it("should return 404 if friend to be accepted does not exist", done => {
      chai
        .request(app)
        .put("/friends/" + user0.id + "/-1")
        .send(user1)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it("should return 404 if friend request does not exist", done => {
      chai
        .request(app)
        .put("/friends/" + user0.id + "/" + user2.id)
        .send(user1)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it("should return 401 if password is incorrect", done => {
      chai
        .request(app)
        .put("/friends/" + user0.id + "/" + user1.id)
        .send({
          username: user1.username,
          password: "aaaaa"
        })
        .end((err, res) => {
          res.should.have.status(401);

          done();
        });
    });

    it("should return 400 if password is missing", done => {
      chai
        .request(app)
        .put("/friends/" + user0.id + "/" + user1.id)
        .send({
          username: user1.username
        })
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });

    it("should accept friend request", done => {
      chai
        .request(app)
        .put("/friends/" + user0.id + "/" + user1.id)
        .send(user1)
        .end((err, res) => {
          res.should.have.status(200);

          done();
        });
    });
  });

  describe("Delete friend request", () => {
    it("should return 404 if friend does not exist", done => {
      chai
        .request(app)
        .delete("/friends/" + user0.id + "/-1")
        .send(user0)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it("should return 404 if users are not friends or request does not exist", done => {
      chai
        .request(app)
        .delete("/friends/" + user0.id + "/" + user2.id)
        .send(user0)
        .end((err, res) => {
          console.log(res.body);
          res.should.have.status(404);

          done();
        });
    });

    it("should return 401 if password is incorrect", done => {
      chai
        .request(app)
        .delete("/friends/" + user0.id + "/" + user1.id)
        .send({
          username: user0.username,
          password: "aaaaa"
        })
        .end((err, res) => {
          res.should.have.status(401);

          done();
        });
    });

    it("should return 400 if password is missing", done => {
      chai
        .request(app)
        .delete("/friends/" + user0.id + "/" + user1.id)
        .send({
          username: user0.username
        })
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });

    it("should delete friend (or friend request)", done => {
      chai
        .request(app)
        .delete("/friends/" + user0.id + "/" + user1.id)
        .send(user0)
        .end((err, res) => {
          res.should.have.status(200);

          done();
        });
    });
  });
});
