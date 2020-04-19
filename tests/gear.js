// Chai setup
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { request, expect } = chai;

// App and data
const app = require("../src/app");
const testUtils = require("./testUtils");
const { gear } = testUtils.data;

let tokens = [],
    user_ids = [],
    gear_ids = [];

describe("Gear", () => {
    describe("Setup", () => {
        it("setup", async () => {
            const beforeTests = await testUtils.before();
            user_ids = beforeTests.user_ids;
            tokens = beforeTests.tokens;
            gear[0].owner = user_ids[0];
        });
    });

    describe("Create gear", () => {
        it("should create new gear", () =>
            request(app)
                .post("/gear")
                .set({ Authorization: `Bearer ${tokens[0]}` })
                .send(gear[0])
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.brand).equal(gear[0].brand);
                    expect(res.body.name).equal(gear[0].name);
                    expect(res.body.type).equal(gear[0].type);
                    expect(res.body.owner).equal(gear[0].owner);

                    gear_ids.push(res.body._id);
                }));
    });

    describe("List gear", () => {
        it("should list gear", () =>
            request(app)
                .get("/gear")
                .set({ Authorization: `Bearer ${tokens[0]}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.data).be.an("array");
                    expect(res.body.data).have.length(1);
                }));
    });

    describe("Get gear", () => {
        it("should get gear", () =>
            request(app)
                .get(`/gear/${gear_ids[0]}`)
                .set({ Authorization: `Bearer ${tokens[0]}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.brand).equal(gear[0].brand);
                    expect(res.body.name).equal(gear[0].name);
                    expect(res.body.type).equal(gear[0].type);
                    expect(res.body.owner._id).equal(gear[0].owner);
                }));

        it("should fail if not the owner", () =>
            request(app)
                .get(`/gear/${gear_ids[0]}`)
                .set({ Authorization: `Bearer ${tokens[1]}` })
                .then(res => expect(res.status).equal(403)));
    });

    describe("Update gear", () => {
        it("should update gear", () =>
            request(app)
                .put(`/gear/${gear_ids[0]}`)
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

    describe("Delete gear", () => {
        it("should delete gear", () =>
            request(app)
                .delete(`/gear/${gear_ids[0]}`)
                .set({ Authorization: `Bearer ${tokens[0]}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");
                }));

        it("gear should be deleted", () =>
            request(app)
                .get(`/gear/${gear_ids[0]}`)
                .set({ Authorization: `Bearer ${tokens[0]}` })
                .then(res => {
                    expect(res.status).equal(404);
                }));
    });

    describe("Delete data", () => {
        it("delete data", () => {
            testUtils.after(tokens);
        });
    });
});
