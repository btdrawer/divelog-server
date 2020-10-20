import { get } from "lodash";
import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const { request, expect } = chai;
import { seeder } from "@btdrawer/divelog-server-core";
import app from "../src/app";
import { globalSetup, globalTeardown } from "./utils/setup";
const { seedDatabase, gear, users } = seeder;

describe("Gear", () => {
    before(globalSetup);
    after(globalTeardown);
    beforeEach(
        seedDatabase({
            gear: true
        })
    );

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
                    expect(res.body.owner).equal(get(users[0], "output.id"));
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
                .get(`/gear/${get(gear[0], "output.id")}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.brand).equal(get(gear[0], "output.brand"));
                    expect(res.body.name).equal(get(gear[0], "output.name"));
                    expect(res.body.type).equal(get(gear[0], "output.type"));
                    expect(res.body.owner._id).equal(
                        get(gear[0], "output.owner")
                    );
                }));

        it("should fail if not the owner", () =>
            request(app)
                .get(`/gear/${get(gear[0], "output.id")}`)
                .set({ Authorization: `Bearer ${users[1].token}` })
                .then(res => expect(res.status).equal(403)));
    });

    describe("Update gear", () => {
        it("should update gear", () =>
            request(app)
                .put(`/gear/${get(gear[0], "output.id")}`)
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
                .delete(`/gear/${get(gear[0], "output.id")}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");
                }));
    });
});
