// Chai setup
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { request, expect } = chai;

// App and data
const app = require("../src/app");
const testTools = require("./testTools");
const { club } = testTools.data;

let tokens = [],
  user_ids = [],
  club_ids = [];

describe("Club", () => {
  describe("Setup", () => {
    it("setup", async () => {
      const beforeTests = await testTools.before();
      user_ids = beforeTests.user_ids;
      tokens = beforeTests.tokens;
      club[0].managers = [user_ids[0]];
    });
  });

  describe("Create club", () => {
    it("should create new club", () =>
      request(app)
        .post("/club")
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .send(club[0])
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");

          expect(res.body.name).equal(club[0].name);
          expect(res.body.location).equal(club[0].location);
          expect(res.body.description).equal(club[0].description);
          expect(res.body.managers).have.length(1);
          expect(res.body.managers[0]).equal(user_ids[0]);
          expect(res.body.website).equal(club[0].website);

          club_ids.push(res.body._id);
        }));
  });

  describe("List clubs", () => {
    it("should list clubs", () =>
      request(app)
        .get("/club")
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("array");
        }));
  });

  describe("Get club", () => {
    it("should get club", () =>
      request(app)
        .get(`/club/${club_ids[0]}`)
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");

          expect(res.body.name).equal(club[0].name);
          expect(res.body.location).equal(club[0].location);
          expect(res.body.description).equal(club[0].description);
          expect(res.body.managers).have.length(1);
          expect(res.body.managers[0]).equal(user_ids[0]);
          expect(res.body.website).equal(club[0].website);
        }));
  });

  describe("Update club", () => {
    it("should update club", () =>
      request(app)
        .put(`/club/${club_ids[0]}`)
        .send({
          name: "New name"
        })
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");

          expect(res.body.name).equal("New name");
        }));
  });

  describe("Delete club", () => {
    it("should delete club", () =>
      request(app)
        .delete(`/club/${club_ids[0]}`)
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");
        }));

    it("club should be deleted", () =>
      request(app)
        .get(`/club/${club_ids[0]}`)
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .then(res => {
          expect(res.status).equal(404);
        }));
  });

  describe("Delete data", () => {
    it("delete data", () => {
      testTools.after(tokens);
    });
  });
});
