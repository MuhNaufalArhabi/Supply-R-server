const request = require("supertest");
const {http: app} = require("../app.js");

describe("GET /", () => {
    it("get rooms by user id should return status code 200", (done) => {
        request(app)
        .get("/rooms/1")
        .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
            expect(status).toBe(200);
            expect(body).toBeInstanceOf(Array);
            done();
        });
    });

    it("get message by room id should return status code 200", (done) => {
        request(app)
        .get("/rooms/chat/1")
        .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
            expect(status).toBe(200);
            expect(body).toBeInstanceOf(Array);
            done();
        });
    });
    });
//