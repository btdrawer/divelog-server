const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { request, expect } = chai;
const app = require("../src/app");
const { globalSetup, globalTeardown } = require("./utils/setup");
const { seedDatabase, users, dives } = require("./utils/seedDatabase");

before(async () => await globalSetup());

describe("Dive", () => {
    beforeEach(
        async () =>
            await seedDatabase({
                resources: {
                    dives: true,
                    clubs: true,
                    gear: true
                }
            })
    );

    describe("Create dive", () => {
        it("should create new dive", () =>
            request(app)
                .post("/dive")
                .set({ Authorization: `Bearer ${users[0].token}` })
                .send(dives[0])
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.user).equal(users[0].output.id);
                    expect(res.body.safety_stop_time).equal(
                        dives[0].safety_stop_time
                    );
                    expect(res.body.bottom_time).equal(dives[0].bottom_time);
                    expect(res.body.description).equal(dives[0].description);
                }));

        it("should create new dive with buddies", () =>
            request(app)
                .post("/dive")
                .set({ Authorization: `Bearer ${users[0].token}` })
                .send({
                    ...dives[0],
                    buddies: [users[1].output.id, users[2].output.id]
                })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.buddies).eql([
                        users[1].output.id,
                        users[2].output.id
                    ]);
                }));

        it("should not add different user_id", () =>
            request(app)
                .post("/dive")
                .set({ Authorization: `Bearer ${users[0].token}` })
                .send({ ...dives[0], user_id: users[1].output.id })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.user).equal(users[0].output.id);
                }));

        it("should not add dive_time", () =>
            request(app)
                .post("/dive")
                .set({ Authorization: `Bearer ${users[0].token}` })
                .send({ ...dives[0], dive_time: 32 })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.dive_time).not.equal(32);
                }));
    });

    describe("List dives", () => {
        it("should list user's dives", () =>
            request(app)
                .get("/dive")
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.data).be.an("array");

                    expect(res.body.data).have.length(3);

                    expect(res.body.data[0]._id).equal(dives[0].output.id);
                    expect(res.body.data[1]._id).equal(dives[1].output.id);
                    expect(res.body.data[2]._id).equal(dives[2].output.id);
                }));

        it("should limit results", () =>
            request(app)
                .get("/dive")
                .query({ limit: 1 })
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.data).be.an("array");
                    expect(res.body.data).have.length(1);
                    expect(res.body.pageInfo.hasNextPage).equal(true);
                }));
    });

    describe("Get dive", () => {
        it("should get dive by ID", () =>
            request(app)
                .get(`/dive/${dives[0].output.id}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.user._id).equal(users[0].output.id);
                    expect(res.body.safety_stop_time).equal(
                        dives[0].output.safety_stop_time
                    );
                    expect(res.body.bottom_time).equal(
                        dives[0].output.bottom_time
                    );
                    expect(res.body.description).equal(
                        dives[0].output.description
                    );
                }));
    });

    describe("Update dive", () => {
        it("should update dive", () =>
            request(app)
                .put(`/dive/${dives[0].output.id}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .send({
                    bottom_time: 16,
                    max_depth: 17.1
                })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.bottomTime).equal(16);
                    expect(res.body.maxDepth).equal(17.1);
                }));

        it("should calculate dive time if timeIn and timeOut are supplied", () =>
            request(app)
                .put(`/dive/${dives[0].output.id}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .send({
                    time_in: 1577873897000,
                    time_out: 1577875937000
                })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.diveTime).equal(34);
                }));

        it("should not update user", () =>
            request(app)
                .put(`/dive/${dives[0].output.id}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .send({
                    user: [users[1].output.id]
                })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.user).equal(users[0].output.id);
                }));

        it("should not update dive_time", () =>
            request(app)
                .put(`/dive/${dives[0].output.id}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
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
                .delete(`/dive/${dives[0].output.id}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");
                }));
    });
});

after(async () => await globalTeardown());
