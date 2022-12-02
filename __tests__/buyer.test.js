const request = require("supertest");
const app = require("../app.js");
const {Buyer} = require("../models")

const cleanUpDatabase = async ()=>{
  await Buyer.destroy({
    where: {},
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
}
const createOneBuyer = async ()=>{
  await Buyer.create({
    name: "testing",
    owner: "Ed Testing",
    password: "E9Lsv4TtIBi",
    email: "testing@h8.com",
    phoneNumber: "161-714-7611",
    address: "Jalan",
    website: "www.bura.com",
    industry: "Civil Works",
  });
}

describe('POST /buyers/register', () => {
  beforeAll(() => {
    cleanUpDatabase();
  });
  test("POST /buyers/register success-test", () => {
    return request(app)
      .post("/buyers/register")
      .send({
        name: "testing",
        owner: "Ed Testing",
        password: "E9Lsv4TtIBi",
        email: "testing@h8.com",
        phoneNumber: "161-714-7611",
        address: "Jalan",
        website: "www.bura.com",
        industry: "Civil Works",
      })
      .then((res)=>{
        expect(res.status).toBe(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("id", expect.any(Number));
        expect(res.body).toHaveProperty("email", "testing@h8.com");
      })
  });
});