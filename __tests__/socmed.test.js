const request = require("supertest");
const app = require("../app");
const { Seller } = require("../models");


afterAll((done) => {
  Seller.destroy({ where: {} })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("POST /login", () => {
  describe("Success Login", () => {
    test("should send an object (access_token) with 200 status code", (done) => {
      request(app)
        .post("/sellers/google-login")
        .send({
            email: "test.google@mail.com",
            username: "test google",
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          } else {
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body).toHaveProperty("access_token", expect.any(String));
            expect(res.body).toHaveProperty("message", "login Google ok");
            done();
          }
        });
    });
  });
});
