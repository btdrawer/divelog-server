// Chai setup
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { request, expect } = chai;

// App and data
const app = require("../src/app");
const testTools = require("./testTools");
const { group, message } = testTools.data;

let tokens = [],
    user_ids = [],
    group_ids = [];

describe("Group", () => {
    describe("Setup", () => {
        it("setup", async () => {
            const beforeTests = await testTools.before();
            user_ids = beforeTests.user_ids;
            tokens = beforeTests.tokens;
            group[0].participants = [user_ids[1]];
            group[0].sender = user_ids[0];
        });
    });

    describe("Create group", () => {
        it("should create new group", () =>
            request(app)
                .post("/group")
                .set({ Authorization: `Bearer ${tokens[0]}` })
                .send(group[0])
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.name).equal(group[0].group_name);
                    expect(res.body.participants).have.length(2);

                    expect(res.body.messages[0].text).equal(group[0].text);
                    expect(res.body.messages[0].sender).equal(group[0].sender);

                    group_ids.push(res.body._id);
                }));
    });

    describe("Send message", () => {
        it("should send message", () =>
            request(app)
                .post(`/group/${group_ids[0]}/message`)
                .set({ Authorization: `Bearer ${tokens[0]}` })
                .send(message[0])
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.messages[1].text).equal(message[0].text);
                    expect(res.body.messages[1].sender).equal(user_ids[0]);
                }));
    });

    describe("Add member to group", () => {
        it("should add member to group", () =>
            request(app)
                .post(`/group/${group_ids[0]}/user/${user_ids[2]}`)
                .set({ Authorization: `Bearer ${tokens[0]}` })
                .send(message[0])
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.participants).have.length(3);
                }));
    });

    describe("List groups", () => {
        it("should list groups the user is a participant in", () =>
            request(app)
                .get("/group")
                .set({ Authorization: `Bearer ${tokens[0]}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("array");
                    expect(res.body).have.length(1);
                    expect(res.body[0]._id).equal(group_ids[0]);
                }));
    });

    describe("Get group", () => {
        it("should get group", () =>
            request(app)
                .get(`/group/${group_ids[0]}`)
                .set({ Authorization: `Bearer ${tokens[0]}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body._id).equal(group_ids[0]);

                    expect(res.body.name).equal(group[0].group_name);
                    expect(res.body.participants).have.length(3);

                    expect(res.body.messages).have.length(2);
                    expect(res.body.messages[0].text).equal(group[0].text);
                    expect(res.body.messages[0].sender).equal(group[0].sender);
                }));
    });

    describe("Leave group", () => {
        it("should leave group", () =>
            request(app)
                .delete(`/group/${group_ids[0]}/leave`)
                .set({ Authorization: `Bearer ${tokens[2]}` })
                .then(res => {
                    expect(res.status).equal(200);
                    expect(res.body).be.an("object");

                    expect(res.body.participants).have.length(2);
                }));
    });

    describe("Delete data", () => {
        it("delete data", () => {
            testTools.after(tokens);
        });
    });
});
