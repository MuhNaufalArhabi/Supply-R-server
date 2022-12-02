const request = require("supertest");
const app = require("../app.js");
const { encode } = require("../helpers/jwt.js");
const { Buyer, Order, OrderProduct } = require("../models");

const cleanUpDatabase = async () => {
  await Buyer.destroy({
    where: {},
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
};
const createOneBuyer = async () => {
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
};
const createTwoBuyers = async () => {
  const { buyers } = require("../db.json");
  await Buyer.bulkCreate(buyers);
};
