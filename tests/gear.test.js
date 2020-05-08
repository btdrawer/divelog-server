const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { request, expect } = chai;
const app = require("../src/app");
const { globalSetup, globalTeardown } = require("./utils/setup");
const { seedDatabase, users, gear } = require("./utils/seedDatabase");

before(async () => await globalSetup());

describe("Gear", () => {
    beforeEach(async () => {
        await seedDatabase({
            resources: {
                gear: true
            }
        });
    });

    describe("Create gear", () => {
        it("should create new gear", () =>
            request(app)
                .post("/gear")
                .set({ Authorization: `Bearer ${users[0].token}` })
                .send({
                    brand: "A",
                    name: "B",
                    type: "C"
                })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.brand).equal("A");
                    expect(res.body.name).equal("B");
                    expect(res.body.type).equal("C");
                    expect(res.body.owner).equal(users[0].output.id);
                }));
    });

    describe("List gear", () => {
        it("should list gear", () =>
            request(app)
                .get("/gear")
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.data).be.an("array");
                    expect(res.body.data).have.length(2);
                }));

        it("should limit results", () =>
            request(app)
                .get("/gear")
                .query({ limit: 1 })
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.data).be.an("array");
                    expect(res.body.data).have.length(1);
                    expect(res.body.pageInfo.hasNextPage).equal(true);
                }));
    });

    describe("Get gear", () => {
        it("should get gear", () =>
            request(app)
                .get(`/gear/${gear[0].output.id}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.brand).equal(gear[0].output.brand);
                    expect(res.body.name).equal(gear[0].output.name);
                    expect(res.body.type).equal(gear[0].output.type);
                    expect(res.body.owner._id).equal(
                        gear[0].output.owner.toString()
                    );
                }));

        it("should fail if not the owner", () =>
            request(app)
                .get(`/gear/${gear[0].output.id}`)
                .set({ Authorization: `Bearer ${users[1].token}` })
                .then(res => expect(res.status).equal(403)));
    });

    describe("Update gear", () => {
        it("should update gear", () =>
            request(app)
                .put(`/gear/${gear[0].output.id}`)
                .send({
                    name: "New name"
                })
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.name).equal("New name");
                }));
    });

    describe("Delete gear", () => {
        it("should delete gear", () =>
            request(app)
                .delete(`/gear/${gear[0].output.id}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");
                }));
    });
});

after(async () => await globalTeardown());
