const request = require("supertest");
const { http: app } = require("../app");
const { encode } = require("../helpers/jwt");
const { Seller } = require("../models");

const sellerTest = {
  formSeller: {
    email: "seller.test@mail.com",
    password: "sellerTest",
    username: "sellerTest",
    phoneNumber: "1234567890",
    ktp: "1234567890",
  },
  formShop: {
    name: "sellerTest",
    lat: "1",
    long: "1",
    address: "sellerTest",
    phoneNumber: "1234567890",
    owner: "sellerTest",
  },
};

const sellerTest2 = {
  email: "seller.test2222@mail.com",
  password: "sellerTest",
  username: "sellerTest",
  phoneNumber: "1234567890",
  ktp: "123456789022",
};

let access_token_valid = "";
let access_token_invalid = "123467890";
let access_token_invalid2 = "";

beforeAll(async () => {
  try {
    const seller = await Seller.create(sellerTest2);
    const access_token = encode({ id: seller.id, email: seller.email });
    access_token_valid = access_token;
    const access = encode({ id: 999, email: seller.email });
    access_token_invalid2 = access;
  } catch (error) {
    console.log(error);
  }
});

afterAll((done) => {
  access_token_valid = "";
  Seller.destroy({ truncate: true, cascade: true, restartIdentity: true })
    .then((_) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("Seller Routes Test", () => {
  describe("POST /register - create new seller", () => {
    test("201 Success register - should create new Seller", (done) => {
      request(app)
        .post("/sellers/register")
        .send(sellerTest)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(201);
          expect(body).toHaveProperty("id", expect.any(Number));
          expect(body).toHaveProperty("email", sellerTest.formSeller.email);
          return done();
        });
    });
  });

  describe("POST /login - login seller", () => {
    test("200 Success login - should return access_token", (done) => {
      request(app)
        .post("/sellers/login")
        .send({
          email: "seller.test@mail.com",
          password: "sellerTest",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(200);
          expect(body).toHaveProperty("access_token", expect.any(String));
          return done();
        });
    });
  });

  describe("POST /register - register new seller", () => {
    test("400 Failed register - should return error if email is null", (done) => {
      request(app)
        .post("/sellers/register")
        .send({
          formSeller: {
            password: "sellerTest",
            username: "sellerTest",
            phoneNumber: "1234567890",
            ktp: "1234567890",
          },
          formShop: {
            name: "sellerTest",
            lat: "1",
            long: "1",
            address: "sellerTest",
            phoneNumber: "1234567890",
            owner: "sellerTest",
          },
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email is required");
          return done();
        });
    });
  });

  describe("POST /register - register new seller", () => {
    test("400 Failed register - should return error if email is empty", (done) => {
      request(app)
        .post("/sellers/register")
        .send({
          formSeller: {
            email: "",
            password: "sellerTest",
            username: "sellerTest",
            phoneNumber: "1234567890",
            ktp: "1234567890",
          },
          formShop: {
            name: "sellerTest",
            lat: "1",
            long: "1",
            address: "sellerTest",
            phoneNumber: "1234567890",
            owner: "sellerTest",
          },
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email is required");
          return done();
        });
    });
  });

  describe("POST /register - register new seller", () => {
    test("400 Failed register - should return error if email format is invalid", (done) => {
      request(app)
        .post("/sellers/register")
        .send({
          formSeller: {
            email: "seller.testmail.com",
            password: "sellerTest",
            username: "sellerTest",
            phoneNumber: "1234567890",
            ktp: "1234567890",
          },
          formShop: {
            name: "sellerTest",
            lat: "1",
            long: "1",
            address: "sellerTest",
            phoneNumber: "1234567890",
            owner: "sellerTest",
          },
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Invalid email format");
          return done();
        });
    });
  });

  describe("POST /register - register new seller", () => {
    test("400 Failed register - should return error if password is null", (done) => {
      request(app)
        .post("/sellers/register")
        .send({
          formSeller: {
            email: "seller.test@mail.com",
            username: "sellerTest",
            phoneNumber: "1234567890",
            ktp: "1234567890",
          },
          formShop: {
            name: "sellerTest",
            lat: "1",
            long: "1",
            address: "sellerTest",
            phoneNumber: "1234567890",
            owner: "sellerTest",
          },
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Password is required");
          return done();
        });
    });
  });

  describe("POST /register - register new seller", () => {
    test("400 Failed register - should return error if password is empty or less than 5 charracter", (done) => {
      request(app)
        .post("/sellers/register")
        .send({
          formSeller: {
            email: "seller.test@mail.com",
            password: "",
            username: "sellerTest",
            phoneNumber: "1234567890",
            ktp: "1234567890",
          },
          formShop: {
            name: "sellerTest",
            lat: "1",
            long: "1",
            address: "sellerTest",
            phoneNumber: "1234567890",
            owner: "sellerTest",
          },
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toHaveProperty(
            "message",
            "Minimum password length is 5 character"
          );
          return done();
        });
    });
  });

  describe("POST /login - login seller", () => {
    test("400 Failed login - should return error if email is null", (done) => {
      request(app)
        .post("/sellers/login")
        .send({
          password: "sellerTest",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email is required");
          return done();
        });
    });
  });

  describe("POST /login - login seller", () => {
    test("400 Failed login - should return error if email is empty", (done) => {
      request(app)
        .post("/sellers/login")
        .send({
          email: "",
          password: "sellerTest",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email is required");
          return done();
        });
    });
  });

  describe("POST /login - login seller", () => {
    test("400 Failed login - should return error if password is null", (done) => {
      request(app)
        .post("/sellers/login")
        .send({
          email: "seller.test@mail.com",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Password is required");
          return done();
        });
    });
  });

  describe("POST /login - login seller", () => {
    test("400 Failed login - should return error if password is empty", (done) => {
      request(app)
        .post("/sellers/login")
        .send({
          email: "seller.test@mail.com",
          password: "",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Password is required");
          return done();
        });
    });
  });

  describe("POST /login - login seller", () => {
    test("401 Failed login - should return error if email is not registered", (done) => {
      request(app)
        .post("/sellers/login")
        .send({
          email: "seller.test4@mail.com",
          password: "sellerTest",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid Email or Password");
          return done();
        });
    });
  });

  describe("POST /login - login seller", () => {
    test("401 Failed login - should return error if password is wrong", (done) => {
      request(app)
        .post("/sellers/login")
        .send({
          email: "seller.test@mail.com",
          password: "sellerTest2",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid Email or Password");
          return done();
        });
    });
  });

  describe("GET /sellers - get all sellers", () => {
    test("200 Success get all sellers - should return array of object of sellers", (done) => {
      request(app)
        .get("/sellers")
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(200);
          expect(body).toBeInstanceOf(Array);
          expect(body[0]).toHaveProperty("id", expect.any(Number));
          expect(body[0]).toHaveProperty("email", expect.any(String));
          expect(body[0]).toHaveProperty("username", expect.any(String));
          expect(body[0]).toHaveProperty("phoneNumber", expect.any(String));
          expect(body[0]).toHaveProperty("ktp", expect.any(String));
          expect(body[0]).toHaveProperty("createdAt", expect.any(String));
          expect(body[0]).toHaveProperty("updatedAt", expect.any(String));
          return done();
        });
    });

    test("500 Failed get all sellers - should return error if server error", (done) => {
      jest.spyOn(Seller, "findAll").mockImplementation(() => {
        throw new Error("Internal Server Error");
      });
      request(app)
        .get("/sellers")
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(500);
          expect(body).toHaveProperty("message", "Internal Server Error");
          return done();
        });
    });
  });

  describe("GET /sellers/:id - get seller by id", () => {
    test("200 Success get seller - should return object of seller", (done) => {
      request(app)
        .get("/sellers/1")
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(200);
          expect(body).toBeInstanceOf(Object);
          expect(body).toHaveProperty("id", expect.any(Number));
          expect(body).toHaveProperty("email", expect.any(String));
          expect(body).toHaveProperty("username", expect.any(String));
          expect(body).toHaveProperty("phoneNumber", expect.any(String));
          expect(body).toHaveProperty("ktp", expect.any(String));
          expect(body).toHaveProperty("createdAt", expect.any(String));
          expect(body).toHaveProperty("updatedAt", expect.any(String));
          return done();
        });
    });

    test("500 Failed get seller - should return error if server error", (done) => {
      jest.spyOn(Seller, "findOne").mockImplementation(() => {
        throw new Error("Internal Server Error");
      });
      request(app)
        .get("/sellers/1")
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(500);
          expect(body).toHaveProperty("message", "Internal Server Error");
          return done();
        });
    });
  });

  describe("GET /sellers/:id - get seller by id", () => {
    test("404 Failed get seller - should return error if seller not found", (done) => {
      request(app)
        .get("/sellers/100")
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(404);
          expect(body).toHaveProperty("message", "Error not found");
          return done();
        });
    });
  });

  describe("PUT /sellers/:id - update seller by id", () => {
    test("200 Success update seller - should return success message", (done) => {
      request(app)
        .put("/sellers/2")
        .send({
          email: "seller.test12@mail.com",
          password: "sellerTest12",
          username: "sellerTest12",
          phoneNumber: "123456789012",
          ktp: "123456789012",
        })
        .set("access_token", access_token_valid)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(200);
          expect(body).toHaveProperty("message", "Success update seller");
          return done();
        });
    });
  });

  describe("PUT /sellers/:id - update seller by id", () => {
    test("401 Failed update seller - should return error if access token is invalid", (done) => {
      request(app)
        .put("/sellers/2")
        .send({
          email: "seller.test@mail.com",
          password: "sellerTest",
          username: "sellerTest",
          phoneNumber: "1234567890",
          ktp: "1234567890",
        })
        .set("access_token", access_token_invalid)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid Token");
          return done();
        });
    });
  });

  describe("PUT /sellers/:id - update seller by id", () => {
    test("401 Failed update seller - should return error if access token is invalid", (done) => {
      request(app)
        .put("/sellers/2")
        .send({
          email: "seller.test@mail.com",
          password: "sellerTest",
          username: "sellerTest",
          phoneNumber: "1234567890",
          ktp: "1234567890",
        })
        .set("access_token", access_token_invalid2)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid Token");
          return done();
        });
    });
  });

  describe("PUT /sellers/:id - update seller by id", () => {
    test("401 Failed update seller - should return error if access token is empty", (done) => {
      request(app)
        .put("/sellers/2")
        .send({
          email: "seller.test@mail.com",
          password: "sellerTest",
          username: "sellerTest",
          phoneNumber: "1234567890",
          ktp: "1234567890",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(403);
          expect(body).toHaveProperty("message", "Access Forbidden");
          return done();
        });
    });
  });

  describe("PUT /sellers/:id - update seller by id", () => {
    test("404 Failed update seller - should return error if seller not found", (done) => {
      request(app)
        .put("/sellers/100")
        .send({
          email: "seller.test@mail.com",
          password: "sellerTest",
          username: "sellerTest",
          phoneNumber: "1234567890",
          ktp: "1234567890",
        })
        .set("access_token", access_token_valid)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(404);
          expect(body).toHaveProperty("message", "Error not found");
          return done();
        });
    });
  });

  describe("DELETE /sellers/:id - delete seller by id", () => {
    test("404 Failed delete seller - should return error if seller not found", (done) => {
      request(app)
        .delete("/sellers/100")
        .set("access_token", access_token_valid)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(404);
          expect(body).toHaveProperty("message", "Error not found");
          return done();
        });
    });
  });

  describe("DELETE /sellers/:id - delete seller by id", () => {
    test("200 Success delete seller - should return success message", (done) => {
      request(app)
        .delete("/sellers/1")
        .set("access_token", access_token_valid)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(200);
          expect(body).toHaveProperty("message", "Seller deleted");
          return done();
        });
    });
  });

  describe("DELETE /sellers/:id - delete seller by id", () => {
    test("401 Failed delete seller - should return error if access token is invalid", (done) => {
      request(app)
        .delete("/sellers/1")
        .set("access_token", access_token_invalid)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid Token");
          return done();
        });
    });
  });
});
