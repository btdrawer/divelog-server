// Chai setup
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { request, expect } = chai;

// App and data
const app = require("../src/app");
const testTools = require("./testTools");
const { dive } = testTools.data;

let tokens = [],
  user_ids = [],
  dive_ids = [];

describe("Dive", () => {
  describe("Setup", () => {
    it("setup", async () => {
      const beforeTests = await testTools.before();
      user_ids = beforeTests.user_ids;
      tokens = beforeTests.tokens;
    });
  });

  describe("Create dive", () => {
    it("should create new dive", () =>
      request(app)
        .post("/dive")
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .send(dive[0])
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");

          expect(res.body.user).equal(user_ids[0]);
          expect(res.body.safety_stop_time).equal(dive[0].safety_stop_time);
          expect(res.body.bottom_time).equal(dive[0].bottom_time);
          expect(res.body.description).equal(dive[0].description);

          dive_ids.push(res.body._id);
        }));

    it("should create new dive with buddies", () =>
      request(app)
        .post("/dive")
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .send({ ...dive[0], buddies: [user_ids[1], user_ids[2]] })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");

          expect(res.body.buddies).eql([user_ids[1], user_ids[2]]);

          dive_ids.push(res.body._id);
        }));

    it("should not add different user_id", () =>
      request(app)
        .post("/dive")
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .send({ ...dive[0], user_id: user_ids[1] })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");

          expect(res.body.user).equal(user_ids[0]);

          dive_ids.push(res.body._id);
        }));

    it("should not add dive_time", () =>
      request(app)
        .post("/dive")
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .send({ ...dive[0], dive_time: 32 })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");

          expect(res.body.dive_time).not.equal(32);

          dive_ids.push(res.body._id);
        }));
  });

  describe("List dives", () => {
    it("should list user's dives", () =>
      request(app)
        .get("/dive")
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("array");

          expect(res.body).have.length(4);

          expect(res.body[0]._id).equal(dive_ids[0]);
          expect(res.body[1]._id).equal(dive_ids[1]);
          expect(res.body[2]._id).equal(dive_ids[2]);
          expect(res.body[3]._id).equal(dive_ids[3]);
        }));
  });

  describe("Get dive", () => {
    it("should get dive by ID", () =>
      request(app)
        .get(`/dive/${dive_ids[0]}`)
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");

          expect(res.body.user).equal(user_ids[0]);
          expect(res.body.safety_stop_time).equal(dive[0].safety_stop_time);
          expect(res.body.bottom_time).equal(dive[0].bottom_time);
          expect(res.body.description).equal(dive[0].description);
        }));
  });

  describe("Update dive", () => {
    it("should update dive", () =>
      request(app)
        .put(`/dive/${dive_ids[0]}`)
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .send({
          bottom_time: 16,
          max_depth: 17.1
        })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");

          expect(res.body.bottom_time).equal(16);
          expect(res.body.max_depth).equal(17.1);
        }));

    it("should not update user", () =>
      request(app)
        .put(`/dive/${dive_ids[0]}`)
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .send({
          user: [user_ids[1]]
        })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body.user).equal(user_ids[0]);
        }));

    it("should not update dive_time", () =>
      request(app)
        .put(`/dive/${dive_ids[0]}`)
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .send({
          dive_time: 32
        })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body.dive_time).not.equal(32);
        }));
  });

  describe("Delete dive", () => {
    it("should delete dive", () =>
      request(app)
        .delete(`/dive/${dive_ids[0]}`)
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");
        }));
  });

  describe("Delete data", () => {
    it("delete data", () => {
      testTools.after(tokens);
    });
  });
});
