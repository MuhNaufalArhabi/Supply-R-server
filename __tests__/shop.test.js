const request = require("supertest");
const {http: app} = require("../app");
const { encode } = require("../helpers/jwt");
const { Shop, Seller } = require("../models");

let access_token;
let access_token_invalid;
const shopTestUser = {
  email: "shop.test@mail.com",
  password: "shoptest",
  username: "shoptest",
  phoneNumber: "shoptest",
  ktp: "shoptest",
};

const shopTestUser2 = {
  email: "shop.test2@mail.com",
  password: "shoptest2",
  username: "shoptest2",
  phoneNumber: "shoptest2",
  ktp: "shoptest2",
};

const shopTest = {
  name: "shopTest",
  address: "shopTest",
  lat: "1",
  long: "1",
  phoneNumber: "1234567890",
  owner: "shopTest",
  SellerId: 1,
};
beforeAll(async () => {
  try {
    const seller = await Seller.create(shopTestUser);
    await Seller.create(shopTestUser2);
    access_token = encode({ id: seller.id, email: seller.email });
    access_token_invalid = encode({ id: 999, email: "mail@wrong.com" });
    await Shop.create(shopTest);
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  try {
    access_token = null;
    await Shop.destroy({ truncate: true, restartIdentity: true });
    await Seller.destroy({ truncate: true, restartIdentity: true });
  } catch (error) {
    console.log(error);
  }
});

describe("GET /shops", () => {
  describe("Success Response", () => {
    test("Should return array of shops with status code 200", (done) => {
      request(app)
        .get("/shops")
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(200);
          expect(body).toBeInstanceOf(Array);
          expect(body[0]).toHaveProperty("id", expect.any(Number));
          expect(body[0]).toHaveProperty("name", expect.any(String));
          expect(body[0]).toHaveProperty("address", expect.any(String));
          expect(body[0]).toHaveProperty("lat", expect.any(String));
          expect(body[0]).toHaveProperty("long", expect.any(String));
          expect(body[0]).toHaveProperty("phoneNumber", expect.any(String));
          expect(body[0]).toHaveProperty("owner", expect.any(String));
          expect(body[0]).toHaveProperty("SellerId", expect.any(Number));
          expect(body[0]).toHaveProperty("createdAt", expect.any(String));
          expect(body[0]).toHaveProperty("updatedAt", expect.any(String));
          expect(body[0]).toHaveProperty("Seller", expect.any(Object));
          expect(body[0].Seller).toHaveProperty("id", expect.any(Number));
          expect(body[0].Seller).toHaveProperty("username", expect.any(String));
          expect(body[0].Seller).toHaveProperty("email", expect.any(String));
          expect(body[0].Seller).toHaveProperty(
            "phoneNumber",
            expect.any(String)
          );
          expect(body[0].Seller).toHaveProperty("ktp", expect.any(String));
          expect(body[0].Seller).toHaveProperty(
            "createdAt",
            expect.any(String)
          );
          expect(body[0].Seller).toHaveProperty(
            "updatedAt",
            expect.any(String)
          );
          return done();

          return done();
        });
    });
  });

  describe("POST /shops - create new shop", () => {
    test("201 Success create - should return object of shop", (done) => {
      request(app)
        .post("/shops/add")
        .send({
          name: "shopTest2",
          address: "shopTest2",
          lat: "12",
          long: "1",
          phoneNumber: "1234567890",
          owner: "shopTest2",
          SellerId: 2,
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toBe(201);
          expect(res.body).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              address: expect.any(String),
              lat: expect.any(String),
              long: expect.any(String),
              phoneNumber: expect.any(String),
              owner: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              SellerId: expect.any(Number),
            })
          );
          return done();
        });
    });
  });

  describe("GET /shops/:id", () => {
    test("200 Success get shop - should return object of shop", (done) => {
      request(app)
        .get("/shops/1")
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(200);
          expect(body).toBeInstanceOf(Object);
          expect(body).toHaveProperty("id", expect.any(Number));
          expect(body).toHaveProperty("name", expect.any(String));
          expect(body).toHaveProperty("address", expect.any(String));
          expect(body).toHaveProperty("lat", expect.any(String));
          expect(body).toHaveProperty("long", expect.any(String));
          expect(body).toHaveProperty("phoneNumber", expect.any(String));
          expect(body).toHaveProperty("owner", expect.any(String));
          expect(body).toHaveProperty("createdAt", expect.any(String));
          expect(body).toHaveProperty("updatedAt", expect.any(String));
          expect(body).toHaveProperty("SellerId", expect.any(Number));
          expect(body).toHaveProperty("Seller", expect.any(Object));
          expect(body.Seller).toHaveProperty("id", expect.any(Number));
          expect(body.Seller).toHaveProperty("username", expect.any(String));
          expect(body.Seller).toHaveProperty("email", expect.any(String));
          expect(body.Seller).toHaveProperty("password", expect.any(String));
          expect(body.Seller).toHaveProperty("phoneNumber", expect.any(String));
          expect(body.Seller).toHaveProperty("ktp", expect.any(String));
          expect(body.Seller).toHaveProperty("createdAt", expect.any(String));
          expect(body.Seller).toHaveProperty("updatedAt", expect.any(String));
          // expect(body).toHaveProperty("Products", expect.any(Array));
          // expect(body.Products).toBeInstanceOf(Array);
          // expect(body.Products[0]).toHaveProperty("id", expect.any(Number));
          // expect(body.Products[0]).toHaveProperty("name", expect.any(String));
          // expect(body.Products[0]).toHaveProperty("price", expect.any(Number));
          // expect(body.Products[0]).toHaveProperty("stock", expect.any(Number));
          // expect(body.Products[0]).toHaveProperty("description", expect.any(String));
          // expect(body.Products[0]).toHaveProperty("mainImage", expect.any(String));
          // expect(body.Products[0]).toHaveProperty("createdAt", expect.any(String));
          // expect(body.Products[0]).toHaveProperty("updatedAt", expect.any(String));
          // expect(body.Products[0]).toHaveProperty("ShopId", expect.any(Number));
          // expect(body.Products[0]).toHaveProperty("CategoryId", expect.any(Number));
          return done();
        });
    });
  });

  describe("POST /shops/add - create new shop", () => {
    test("400 Failed create - should return error message without name ", (done) => {
      request(app)
        .post("/shops/add")
        .send({
          address: "shopTest",
          lat: "1",
          long: "1",
          phoneNumber: "1234567890",
          owner: "shopTest",
          SellerId: 1,
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Name is required");
          return done();
        });
    });
  });

  describe("POST /shops/add - create new shop", () => {
    test("400 Failed create - should return error message without address ", (done) => {
      request(app)
        .post("/shops/add")
        .send({
          name: "shopTest",
          lat: "1",
          long: "1",
          phoneNumber: "1234567890",
          owner: "shopTest",
          SellerId: 1,
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Address is required");
          return done();
        });
    });
  });

  describe("GET /shops/:id", () => {
    test("404 Failed get shop - should return error message with invalid id", (done) => {
      request(app)
        .get("/shops/100")
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(404);
          expect(body).toHaveProperty("message", "Error not found");
          return done();
        });
    });
  });

  describe("PUT /shops/:id - update shop", () => {
    test("200 Success update shop - should return object of shop", (done) => {
      request(app)
        .put("/shops/update/2")
        .send({
          name: "shopTest2",
          address: "shopTest2",
          lat: "1",
          long: "1",
          phoneNumber: "1234567890",
          owner: "shopTest2",
          SellerId: 2,
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("message", "Shop updated");
          return done();
        });
    });
  });

  describe("PUT /shops/:id - update shop", () => {
    test("404 Failed update shop - should return error message with invalid shop id", (done) => {
      request(app)
        .put("/shops/update/200")
        .send({
          address: "shopTest2",
          lat: "1",
          long: "1",
          phoneNumber: "1234567890",
          owner: "shopTest2",
          SellerId: 2,
        })
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toBe(404);
          expect(res.body).toHaveProperty("message", "Error not found");
          return done();
        });
    });
  });

  describe("DELETE /shops/:id - delete shop", () => {
    test("200 Success delete shop - should success delete message", (done) => {
      request(app)
        .delete("/shops/delete/2")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("message", "Shop deleted");
          return done();
        });
    });
  });

  describe("DELETE /shops/:id - delete shop", () => {
    test("404 Failed delete shop - should return error message with invalid shop id", (done) => {
      request(app)
        .delete("/shops/delete/200")
        .set("access_token", access_token)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toBe(404);
          expect(res.body).toHaveProperty("message", "Error not found");
          return done();
        });
    });
  });
});
