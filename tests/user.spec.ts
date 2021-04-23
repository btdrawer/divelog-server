import { Services, seeder } from "@btdrawer/divelog-server-core";
import { Express } from "express";
import { get } from "lodash";
import chai from "chai";
import chaiHttp from "chai-http";
import App from "../src/app";

chai.use(chaiHttp);
const { request, expect } = chai;
const { seedDatabase, users } = seeder;

let app: Express;

describe("User", () => {
    before(async () => {
        const services = await Services.launchServices();
        app = new App(services).app;
    });

    beforeEach(
        seedDatabase({
            groups: true
        })
    );

    describe("Create user", () => {
        it("should create a new user", () =>
            request(app)
                .post("/user")
                .send({
                    username: "user",
                    name: "Ben",
                    email: "user@example.com",
                    password: "super password"
                })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res).be.an("object");
                }));

        it("should fail if username is not supplied", () =>
            request(app)
                .post("/user")
                .send({
                    username: "thisWillFail"
                })
                .then(res => {
                    expect(res.status).equal(400);
                }));

        it("should fail if password is not supplied", () =>
            request(app)
                .post("/user")
                .send({
                    password: "thisWillFail"
                })
                .then(res => {
                    expect(res.status).equal(400);
                }));
    });

    describe("Login", () => {
        it("should successfully login", () =>
            request(app)
                .post("/user/login")
                .send({
                    username: users[0].input.username,
                    password: users[0].input.password
                })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");
                }));

        it("should fail if incorrect login details provided", () =>
            request(app)
                .post("/user")
                .send({
                    username: users[0].input.username,
                    password: "notTheCorrectPassword"
                })
                .then(res => {
                    expect(res.status).equal(400);
                }));
    });

    describe("List users", () => {
        it("should list all users", () =>
            request(app)
                .get("/user")
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.data).be.an("array");
                    expect(res.body.data).have.length(4);
                }));

        it("should limit results", () =>
            request(app)
                .get("/user")
                .query({ limit: 1 })
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body.data).be.an("array");
                    expect(res.body.data).have.length(1);
                    expect(res.body.pageInfo.hasNextPage).equal(true);
                }));
    });

    describe("Get user", () => {
        it("should get user", () =>
            request(app)
                .get(`/user/${get(users[0], "output.id")}`)
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");
                }));
    });

    describe("Delete user", () => {
        it("should delete user", () =>
            request(app)
                .delete("/user")
                .set({ Authorization: `Bearer ${users[0].token}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");
                }));
    });
});
