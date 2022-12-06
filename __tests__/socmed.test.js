const request = require("supertest");
const {http: app} = require("../app");
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
  describe("Success Login Google", () => {
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

  describe("Error Login Google", () => {
    test("should send an error with 400 status code because of empty email", (done) => {
      request(app)
        .post("/sellers/google-login")
        .send({
          email: "",
          username: "test google",
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          } else {
            expect(res.status).toBe(400);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body).toHaveProperty("message", "Email is required");
            done();
          }
        });
    });
  });
});

describe("POST /login", () => {
  describe("Success Login FB", () => {
    test("should send an object (access_token) with 200 status code", (done) => {
      request(app)
        .post("/sellers/facebook-login")
        .send({
          email: "test.fb@mail.com",
          username: "test fb",
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          } else {
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body).toHaveProperty("access_token", expect.any(String));
            expect(res.body).toHaveProperty("message", "login Facebook ok");
            done();
          }
        });
    });
  });

  describe("Error Login FB", () => {
    test("should send an error with 400 status code because of empty email", (done) => {
      request(app)
        .post("/sellers/facebook-login")
        .send({
          email: "",
          username: "test fb",
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          } else {
            expect(res.status).toBe(400);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body).toHaveProperty("message", "Email is required");
            done();
          }
        });
    });
  });
});

describe("POST /login", () => {
  describe("Success Login Twitter", () => {
    test("should send an object (access_token) with 200 status code", (done) => {
      request(app)
        .post("/sellers/twitter-login")
        .send({
          email: "test.twitter@mail.com",
          username: "test twitter",
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          } else {
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body).toHaveProperty("access_token", expect.any(String));
            expect(res.body).toHaveProperty("message", "login Twitter ok");
            done();
          }
        });
    });
  });

  describe("Error Login Twitter", () => {
    test("should send an error with 400 status code because of empty email", (done) => {
      request(app)
        .post("/sellers/twitter-login")
        .send({
          email: "",
          username: "test twitter",
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          } else {
            expect(res.status).toBe(400);
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body).toHaveProperty("message", "Email is required");
            done();
          }
        });
    });
  });
});
