const request = require("supertest");
const {http: app} = require("../app");
const { Category } = require("../models");

beforeAll(async () => {
  try {
    await Category.bulkCreate([
      {
        name: "category 1",
      },
      {
        name: "category 2",
      },
      {
        name: "category 3",
      },
    ]);
  } catch (error) {
    console.log(error);
  }
});

afterAll((done) => {
  Category.destroy({
    where: {},
    truncate: true,
    cascade: true,
    restartIdentity: true,
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

  it("500 internal server error", (done) => {
    jest.spyOn(Category, "findAll").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });
    request(app)
      .get("/categories")
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(500);
        expect(body).toHaveProperty("message", "Internal Server Error");
        done();
      });
  });
});
