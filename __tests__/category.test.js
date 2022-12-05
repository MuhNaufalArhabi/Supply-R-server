const request = require("supertest");
const app = require("../app");
const { Category } = require("../models");

beforeAll((done) => {
  Category.create({
    name: "test",
  })
    .then((data) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

afterAll((done) => {
  Category.destroy({
    where: {},
    truncate: true,
  })
    .then((data) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("GET /categories", () => {
  it("should return status code 200", (done) => {
    request(app)
      .get("/categories")
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Array);
        expect(body[0]).toHaveProperty("id", expect.any(Number));
        expect(body[0]).toHaveProperty("name", expect.any(String));
        expect(body[0]).toHaveProperty("createdAt", expect.any(String));
        expect(body[0]).toHaveProperty("updatedAt", expect.any(String));
        done();
      });
  });
});