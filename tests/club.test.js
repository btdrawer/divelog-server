const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const app = require("../src/app");
const clubData = require("./testData/club");

chai.use(chaiHttp);

let { club0, club1 } = clubData;

let clubIds = {
  club0: "",
  club1: ""
};

describe("/club", () => {
  const { userIds, tokens } = require("./before/before");

  describe("New club", () => {
    it("should add a new club", done => {
      chai
        .request(app)
        .post("/club")
        .send(club0)
        .send(tokens.user0)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a("object");

          done();
        });
    });

    it("should add a new club", done => {
      chai
        .request(app)
        .post("/club")
        .send(club1)
        .send(tokens.user1)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a("object");

          done();
        });
    });

    it("should fail to add a club if name is missing", done => {
      chai
        .request(app)
        .post("/club")
        .send({ location: "Plymouth", manager: user0.id })
        .send(tokens.user0)
        .end((err, res) => {
          res.should.have.status(500);

          done();
        });
    });

    it("should fail to add a club if location is missing", done => {
      chai
        .request(app)
        .post("/club")
        .send({ name: "c", manager: user0.id })
        .send(tokens.user0)
        .end((err, res) => {
          res.should.have.status(500);

          done();
        });
    });

    it("should fail to add a club if manager is missing", done => {
      chai
        .request(app)
        .post("/club")
        .send({ name: "c", location: "Plymouth" })
        .send(tokens.user0)
        .end((err, res) => {
          res.should.have.status(500);

          done();
        });
    });

    it("should add the same club twice", done => {
      chai
        .request(app)
        .post("/club")
        .send(club0)
        .send(tokens.user0)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a("object");

          done();
        });
    });
  });

  describe("List all clubs", () => {
    it("should get a list of all clubs", done => {
      chai
        .request(app)
        .get("/club")
        .send(tokens.user0)
        .end((err, res) => {
          res.should.have.status(200);

          res.body.should.be.a("array");

          res.body.map(c => {
            c.should.have.property("_id");
            c.should.have.property("name");
            c.should.have.property("location");
          });

          clubIds.club0 = res.body[0];
          clubIds.club1 = res.body[1];

          done();
        });
    });
  });

  describe("List clubs by name", () => {
    it('should get a list of all clubs whose names include "a"', done => {
      chai
        .request(app)
        .get("/club")
        .send({
          name: "a"
        })
        .end((err, res) => {
          res.should.have.status(200);

          res.body.should.be.a("array");
          res.body.should.have.length(2);

          res.body.map(c => {
            c.should.have.property("id");
            c.should.have.property("name");
            c.should.have.property("location");

            c.name.should.equal("a");
          });

          done();
        });
    });

    it("should return 404 if no clubs found", done => {
      chai
        .request(app)
        .get("/club")
        .send({
          name: "c"
        })
        .end((err, res) => {
          res.should.have.status(404);

          res.body.should.be.a("array");
          res.body.should.have.length(0);

          done();
        });
    });
  });

  describe("List clubs by location", () => {
    it('should get a list of all clubs whose locations resemble "Plymouth"', done => {
      chai
        .request(app)
        .get("/club")
        .send({
          location: "Plymouth"
        })
        .end((err, res) => {
          res.should.have.status(200);

          res.body.should.be.a("array");
          res.body.should.have.length(2);

          res.body.map(c => {
            c.should.have.property("id");
            c.should.have.property("name");
            c.should.have.property("location");

            c.location.should.equal("Plymouth");
          });

          done();
        });
    });

    it("should return 404 if no clubs found", done => {
      chai
        .request(app)
        .get("/club")
        .send({
          location: "c"
        })
        .end((err, res) => {
          res.should.have.status(404);

          res.body.should.be.a("array");
          res.body.should.have.length(0);

          done();
        });
    });
  });

  describe("Get club", () => {
    it("should get a club", done => {
      chai
        .request(app)
        .get(`/club/${clubIds.club0}`)
        .end((err, res) => {
          res.should.have.status(200);

          res.body.should.be.a("array");
          res.body.should.have.length(1);

          res.body[0].should.have.property("id");
          res.body[0].should.have.property("name");
          res.body[0].should.have.property("location");

          res.body[0].name.should.equal("a");
          res.body[0].location.should.equal("Plymouth");

          done();
        });
    });

    it("should return 404 if club not found", done => {
      chai
        .request(app)
        .get("/club/-1")
        .end((err, res) => {
          res.should.have.status(404);

          res.body.should.be.a("array");
          res.body.should.have.length(0);

          done();
        });
    });
  });

  describe("Update club", () => {
    it("should update club", done => {
      chai
        .request(app)
        .put(`/club/${clubIds.club0}`)
        .send({
          name: "a1",
          location: "Plymouth, UK"
        })
        .send(tokens.user0)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");

          done();
        });
    });

    it("should return 401 if manager details are incorrect", done => {
      chai
        .request(app)
        .put(`/club/${clubIds.club0}`)
        .send({
          name: "a3"
        })
        .send(tokens.user1)
        .end((err, res) => {
          res.should.have.status(401);

          done();
        });
    });

    it("should return 401 if manager token is missing", done => {
      chai
        .request(app)
        .put(`/club/${clubIds.club0}`)
        .send({
          name: "a3"
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a("array");

          done();
        });
    });
  });

  describe("Delete club", () => {
    it("should delete club", done => {
      chai
        .request(app)
        .delete(`/club/${clubIds.club0}`)
        .send(tokens.user0)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");

          done();
        });
    });

    it("should return 401 if manager token is incorrect", done => {
      chai
        .request(app)
        .delete(`/club/${clubIds.club1}`)
        .send(tokens.user0)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");

          done();
        });
    });

    it("should return 401 if manager token is missing", done => {
      chai
        .request(app)
        .delete(`/club/${clubIds.club1}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");

          done();
        });
    });

    it("should delete club", done => {
      chai
        .request(app)
        .delete(`/club/${clubIds.club1}`)
        .send(tokens.club1)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");

          done();
        });
    });

    it("should delete club", done => {
      chai
        .request(app)
        .delete(`/club/${clubIds.club2}`)
        .send(tokens.club2)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");

          done();
        });
    });
  });
});
