const request = require("supertest");
const {http: app} = require("../app.js");
const { encode } = require("../helpers/jwt.js");
const { Buyer, Order } = require("../models");

const cleanUpDatabase = async () => {
  try {
    await Order.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await Buyer.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const createOneBuyer = async () => {
  try {
    await Buyer.create({
      name: "testing",
      owner: "Ed Testing",
      password: "E9Lsv4TtIBi",
      email: "testink@h8.com",
      phoneNumber: "161-714-7611",
      address: "Jalan",
      website: "www.bura.com",
      industry: "Civil Works",
    });
  } catch (error) {
    console.log(error);
  }
};
const createTwoBuyers = async () => {
  try {
    const { buyers } = require("../db.json");
    buyers.forEach((el) => {
      delete el.id;
    });
    await Buyer.bulkCreate(buyers);
  } catch (error) {
    console.log(error);
  }
};
let access_token;
afterAll(async () => {
  access_token = "";
  await cleanUpDatabase();
});
beforeAll(async () => {
  await createOneBuyer();
  await createTwoBuyers();
  access_token = encode({ id: 1 });
});
describe("POST /buyers/register", () => {
  test("POST /buyers/register success-test", () => {
    return request(app)
      .post("/buyers/register")
      .send({
        name: "baru",
        owner: "register baru",
        password: "E9Lsv4TtIBi",
        email: "registerBaru@mail.com",
        phoneNumber: "161-714-7611",
        address: "Jalan",
        website: "www.bura.com",
        industry: "Civil Works",
      })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("id", expect.any(Number));
        expect(res.body).toHaveProperty("email", "registerBaru@mail.com");
      });
  });
  describe("POST /buyers/register fail-test", () => {
    test("POST /buyers/register uniq-email-test", async () => {
      const response = await request(app).post("/buyers/register").send({
        name: "testingk",
        owner: "Ed TestingKK",
        password: "E9Lsv4TtIBi",
        email: "testink@h8.com",
        phoneNumber: "161-714-7611",
        address: "Jalan",
        website: "www.bura.com",
        industry: "Civil Works",
      });
      console.log(response.body.id);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Email must be unique");
    });
    test("POST /buyers/register no-name-test", async () => {
      const response = await request(app).post("/buyers/register").send({
        owner: "Ed Testing",
        password: "E9Lsv4TtIBi",
        email: "orang2@mail.com",
        phoneNumber: "161-714-7611",
        address: "Jalan",
        website: "www.bura.com",
        industry: "Civil Works",
      });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Name is required");
    });
    test("POST /buyers/register no-owner-test", async () => {
      const response = await request(app).post("/buyers/register").send({
        name: "testing",
        password: "E9Lsv4TtIBi",
        email: "orang3@mail.com",
        phoneNumber: "161-714-7611",
        address: "Jalan",
        website: "www.bura.com",
        industry: "Civil Works",
      });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Owner is required");
    });
    test("POST /buyers/register no-email-test", async () => {
      const response = await request(app).post("/buyers/register").send({
        name: "testing",
        owner: "Ed Testing",
        password: "E9Lsv4TtIBi",
        phoneNumber: "161-714-7611",
        address: "Jalan",
        website: "www.bura.com",
        industry: "Civil Works",
      });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Email is required");
    });
    test("POST /buyers/register invalid-email-test", async () => {
      const response = await request(app).post("/buyers/register").send({
        name: "testing",
        owner: "Ed Testing",
        password: "E9Lsv4TtIBi",
        email: "1234556",
        phoneNumber: "161-714-7611",
        address: "Jalan",
        website: "www.bura.com",
        industry: "Civil Works",
      });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Invalid email format");
    });
    test("POST /buyers/register no-password-test", async () => {
      const response = await request(app).post("/buyers/register").send({
        name: "testing",
        owner: "Ed Testing",
        email: "1234556@mail.com",
        phoneNumber: "161-714-7611",
        address: "Jalan",
        website: "www.bura.com",
        industry: "Civil Works",
      });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Password is required");
    });
    test("POST /buyers/register no-phoneNumber-test", async () => {
      const response = await request(app).post("/buyers/register").send({
        name: "testing",
        owner: "Ed Testing",
        password: "E9Lsv4TtIBi",
        email: "orang4@mail.com",
        address: "Jalan",
        website: "www.bura.com",
        industry: "Civil Works",
      });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Phone number is required"
      );
    });
    test("POST /buyers/register no-address-test", async () => {
      const response = await request(app).post("/buyers/register").send({
        name: "testing",
        owner: "Ed Testing",
        password: "E9Lsv4TtIBi",
        email: "orang5@mail.com",
        phoneNumber: "161-714-7611",
        website: "www.bura.com",
        industry: "Civil Works",
      });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Address is required");
    });
    test("POST /buyers/register no-industry-test", async () => {
      const response = await request(app).post("/buyers/register").send({
        name: "testing",
        owner: "Ed Testing",
        password: "E9Lsv4TtIBi",
        email: "orang6@mail.com",
        phoneNumber: "161-714-7611",
        address: "Jalan",
        website: "www.bura.com",
      });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Industry is required");
    });
    test("POST /buyers/register no-web-test", async () => {
      const response = await request(app).post("/buyers/register").send({
        name: "testing",
        owner: "Ed Testing",
        password: "E9Lsv4TtIBi",
        email: "orang7@mail.com",
        phoneNumber: "161-714-7611",
        industry: "Civil Works",
        address: "Jalan",
      });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Website is required");
    });
  });
});

describe("POST /buyers/login", () => {
  test("POST /buyers/login success-test", async () => {
    const response = await request(app).post("/buyers/login").send({
      email: "testink@h8.com",
      password: "E9Lsv4TtIBi",
    });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
  });
  describe("POST /buyers/login fail-test", () => {
    test("POST /buyers/login wrongemail-test ", async () => {
      const response = await request(app).post("/buyers/login").send({
        email: "salahemail@h8.com",
        password: "E9Lsv4TtIBi",
      });
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid Email or Password"
      );
    });
    test("POST /buyers/login wrongpass-test ", async () => {
      const response = await request(app).post("/buyers/login").send({
        email: "testink@h8.com",
        password: "salahpassword",
      });
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid Email or Password"
      );
    });
  });
});

describe("GET /buyers/", () => {
  beforeAll(async () => {
    await Order.create({
      BuyerId: 1,
      isPaid: false,
      paymentMethod: "pending",
      totalPrice: 123123,
    });
  });
  test("GET /buyers/ success-test ", async () => {
    const response = await request(app).get("/buyers/");
    expect(response.status).toBe(200);
    expect(response.body[0]).toBeInstanceOf(Object);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
    expect(response.body[0]).toHaveProperty("owner", expect.any(String));
    expect(response.body[0]).toHaveProperty("email", expect.any(String));
    expect(response.body[0]).toHaveProperty("phoneNumber", expect.any(String));
    expect(response.body[0]).toHaveProperty("address", expect.any(String));
    expect(response.body[0]).toHaveProperty("website", expect.any(String));
    expect(response.body[0]).toHaveProperty("industry", expect.any(String));
    expect(response.body[0]).toHaveProperty("Order", expect.any(Object));
  });

  test("GET 500 /buyers/ fail-test ", async () => {
    jest.spyOn(Buyer, "findAll").mockImplementationOnce(() => {
      throw new Error("Internal Server Error");
    });
    const response = await request(app).get("/buyers/");
    expect(response.status).toBe(500);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });

  test("GET /buyers/:id success-test", async () => {
    const response = await request(app).get("/buyers/1");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("name", expect.any(String));
    expect(response.body).toHaveProperty("owner", expect.any(String));
    expect(response.body).toHaveProperty("email", expect.any(String));
    expect(response.body).toHaveProperty("phoneNumber", expect.any(String));
    expect(response.body).toHaveProperty("address", expect.any(String));
    expect(response.body).toHaveProperty("website", expect.any(String));
    expect(response.body).toHaveProperty("industry", expect.any(String));
    expect(response.body).toHaveProperty("Order", expect.any(Object));
  });
  test("GET /buyers/:id fail-test", async () => {
    const response = await request(app).get("/buyers/41");
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Error not found");
  });
});
describe("DEL /buyers/", () => {
  test("DEL /buyers/delete success-test", async () => {
    access_token = encode({ id: 2 });
    const response = await request(app)
      .delete("/buyers")
      .set({ access_token: access_token });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("msg", "Buyer deleted");
  });

  test("DEL /buyers/delete fail-test", async () => {
    jest.spyOn(Buyer, "destroy").mockImplementationOnce(() => {
      throw new Error("Internal Server Error");
    });
    access_token = encode({ id: 3 });
    const response = await request(app)
      .delete("/buyers")
      .set({ access_token: access_token });
    expect(response.status).toBe(500);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });

  test("DEL /buyers/delete no token-test", async () => {
    const response = await request(app).delete("/buyers");
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
  test("DEL /buyers/delete token-false-test", async () => {
    access_token = encode({ id: 25 });
    const response = await request(app)
      .delete("/buyers")
      .set({ access_token: access_token });
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
});

describe("PUT /buyers/", () => {
  test("PUT /buyers/ success-test", async () => {
    access_token = encode({ id: 1 });
    const response = await request(app)
      .put("/buyers")
      .set({ access_token: access_token })
      .send({
        name: "testing diubah",
        owner: "Owner Diubah",
        password: "E9Lsv4TtIBi",
        email: "testing@h8.com",
        phoneNumber: "161-714-7611",
        address: "Jalan",
        website: "www.bura.com",
        industry: "Civil Works",
      });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "msg",
      "buyer id 1 is successfully changed"
    );
  });

  test("PUT 400 Bad request", async () => {
    access_token = encode({ id: 1 });
    const response = await request(app)
      .put("/buyers")
      .set({ access_token: access_token })
      .send({
        owner: "Owner Diubah",
        password: "E9Lsv4TtIBi",
        email: "testing@h8.com",
        phoneNumber: "161-714-7611",
        address: "Jalan",
        website: "www.bura.com",
        industry: "Civil Works",
      });
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Name is required"
    );
  });
});
