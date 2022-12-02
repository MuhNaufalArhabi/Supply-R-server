const request = require("supertest");
const app = require("../app.js");
const { encode } = require("../helpers/jwt.js");
const {
  Buyer,
  Order,
  OrderProduct,
  Product,
  Shop,
  Category,
} = require("../models");

const cleanUpDatabase = async () => {
  await Product.destroy({
    where: {},
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await OrderProduct.destroy({
    where: {},
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
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
  await Shop.destroy({
    where: {},
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await Category.destroy({
    where: {},
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
};
const createOrderProducts = async () => {
  const {
    orderLists,
    orders,
    products,
    shops,
    categories,
  } = require("../db.json");
  await Order.bulkCreate(orders);
  // shops.forEach((el) => {
  //   el.lat = "t";
  //   el.long = "s";
  // });
  console.log(shops)
  await Shop.bulkCreate(shops);
  await Category.bulkCreate(categories);
  await Product.bulkCreate(products);
  await OrderProduct.bulkCreate(orderLists);
};
const createTwoBuyers = async () => {
  const { buyers } = require("../db.json");
  await Buyer.bulkCreate(buyers);
};
let access_token;
describe("GET /orders/", () => {
  beforeAll(async () => {
    await createTwoBuyers();
    await createOrderProducts();
    access_token = encode({ id: 1 });
  });
  afterAll(() => {
    cleanUpDatabase();
  });
  test("GET /orders/ success-test", async () => {
    const response = await request(app)
      .get("/orders")
      .set({ access_token: access_token });
    expect(response.status).toBe(200);
    expect(response.body[0]).toBeInstanceOf(Object);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("isPaid", expect.any(Boolean));
    expect(response.body[0]).toHaveProperty(
      "paymentMethod",
      expect.any(String)
    );
    expect(response.body[0]).toHaveProperty("totalPrice", expect.any(Number));
    expect(response.body[0]).toHaveProperty("BuyerId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("OrderProducts", expect.any(Array));
    expect(response.body[0].OrderProducts[0]).toBeInstanceOf(Object);
    expect(response.body[0].OrderProducts[0]).toHaveProperty(
      "quantity",
      expect.any(Number)
    );
    expect(response.body[0].OrderProducts[0]).toHaveProperty(
      "totalPrice",
      expect.any(Number)
    );
    expect(response.body[0].OrderProducts[0]).toHaveProperty(
      "ProductId",
      expect.any(Number)
    );
    expect(response.body[0].OrderProducts[0]).toHaveProperty(
      "OrderId",
      expect.any(Number)
    );
  });
});
