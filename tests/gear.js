// Chai setup
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { request, expect } = chai;

// App and data
const app = require("../src/app");
const testTools = require("./testTools");
const { gear } = testTools.data;

let tokens = [],
  user_ids = [],
  gear_ids = [];

describe("Gear", () => {
  describe("Setup", () => {
    it("setup", async () => {
      const beforeTests = await testTools.before();
      user_ids = beforeTests.user_ids;
      tokens = beforeTests.tokens;
      gear[0] = user_ids[0];
    });
  });

  describe("Create gear", () => {
    it("should create new gear", () =>
      request(app)
        .post("/gear")
        .set({ Authorization: `Bearer ${tokens[0]}` })
        .then(res => {
          expect(res.status).equal(200);
          expect(res.body).be.an("object");
          gear_ids.push(res.body._id);
        }));
  });

  describe("Delete data", () => {
    it("delete data", () => {
      testTools.after(tokens);
    });
  });
});
