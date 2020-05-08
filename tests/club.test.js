const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { request, expect } = chai;
const app = require("../src/app");
const { globalSetup, globalTeardown } = require("./utils/setup");
const { seedDatabase, users, clubs } = require("./utils/seedDatabase");

before(async () => await globalSetup());

describe("Club", () => {
    beforeEach(async () => {
        await seedDatabase({
            resources: {
                clubs: true
            }
        });
    });

    describe("Create club", () => {
        it("should create new club", () =>
            request(app)
                .post("/club")
                .set({ Authorization: `Bearer ${users[0].token}` })
                .send({
                    name: "B",
                    location: "C",
                    website: "example.com"
                })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.name).equal("B");
                    expect(res.body.location).equal("C");
                    expect(res.body.website).equal("example.com");

                    expect(res.body.managers).have.length(1);
                    expect(res.body.managers[0]).equal(users[0].output.id);
                }));
    });

    describe("List clubs", () => {
        it("should list clubs", () =>
            request(app)
                .get("/club")
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.data).be.an("array");
                    expect(res.body.data.length).equal(2);
                }));

        it("should list clubs with a particular name", () =>
            request(app)
                .get("/club")
                .query({ name: "B" })
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.data).be.an("array");

                    res.body.data.forEach(club => expect(club.name).equal("B"));
                }));

        it("should list clubs with a particular location", () =>
            request(app)
                .get("/club")
                .query({ location: "A1" })
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.data).be.an("array");

                    res.body.data.forEach(club =>
                        expect(club.location).equal("A1")
                    );
                }));

        it("should limit results", () =>
            request(app)
                .get("/club")
                .query({ limit: 1 })
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.data).be.an("array");
                    expect(res.body.data).have.length(1);
                    expect(res.body.pageInfo.hasNextPage).equal(true);
                }));
    });

    describe("Get club", () => {
        it("should get club", () =>
            request(app)
                .get(`/club/${clubs[0].output.id}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.name).equal(clubs[0].output.name);
                    expect(res.body.location).equal(clubs[0].output.location);
                    expect(res.body.website).equal(clubs[0].output.website);

                    expect(res.body.managers).have.length(1);
                    expect(res.body.managers[0]._id).equal(users[0].output.id);
                }));
    });

    describe("Update club", () => {
        it("should update club", () =>
            request(app)
                .put(`/club/${clubs[0].output.id}`)
                .send({
                    name: "New name"
                })
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.name).equal("New name");
                    // Other details should not be overwritten
                    expect(res.body.location).equal(clubs[0].output.location);
                    expect(res.body.website).equal(clubs[0].output.website);

                    expect(res.body.managers).have.length(1);
                    expect(res.body.managers[0]).equal(users[0].output.id);
                }));

        it("should fail if not a manager", () =>
            request(app)
                .put(`/club/${clubs[0].output.id}`)
                .send({
                    name: "New name 2"
                })
                .set({ Authorization: `Bearer ${users[1].token}` })
                .then(res => expect(res.status).equal(403)));
    });

    describe("Add manager to club", () => {
        it("should add manager to club", () =>
            request(app)
                .post(
                    `/club/${clubs[0].output.id}/manager/${users[1].output.id}`
                )
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);

                    expect(res.body.managers).have.length(2);
                    expect(res.body.managers[1]).equal(users[1].output.id);
                }));
    });

    describe("Remove manager from club", () => {
        it("should remove manager from club", () =>
            request(app)
                .delete(
                    `/club/${clubs[0].output.id}/manager/${users[1].output.id}`
                )
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);

                    expect(res.body.managers).have.length(1);
                }));
    });

    describe("Add member to club", () => {
        it("should add member to club", () =>
            request(app)
                .post(
                    `/club/${clubs[0].output.id}/member/${users[2].output.id}`
                )
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);

                    expect(res.body.members).have.length(2);
                    expect(res.body.members[1]).equal(users[2].output.id);
                }));
    });

    describe("Remove member from club", () => {
        it("should remove member from club", () =>
            request(app)
                .delete(
                    `/club/${clubs[0].output.id}/member/${users[1].output.id}`
                )
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);

                    expect(res.body.members).have.length(0);
                }));
    });

    describe("Join club", () => {
        it("should join club", () =>
            request(app)
                .post(`/club/${clubs[0].output.id}/member`)
                .set({ Authorization: `Bearer ${users[2].token}` })
                .then(res => {
                    expect(res.status).equal(200);

                    expect(res.body.members).have.length(2);
                    expect(res.body.members[1]).equal(users[2].output.id);
                }));
    });

    describe("Leave club", () => {
        it("should leave club", () =>
            request(app)
                .delete(`/club/${clubs[0].output.id}/member`)
                .set({ Authorization: `Bearer ${users[1].token}` })
                .then(res => {
                    expect(res.status).equal(200);

                    expect(res.body.members).have.length(0);
                }));
    });

    describe("Delete club", () => {
        it("should delete club", () =>
            request(app)
                .delete(`/club/${clubs[0].output.id}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");
                }));
    });
});

after(async () => await globalTeardown());
