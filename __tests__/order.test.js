const request = require("supertest");
const { http: app } = require("../app.js");
const { encode } = require("../helpers/jwt.js");
const {
  Buyer,
  Order,
  OrderProduct,
  Product,
  Shop,
  Category,
  Seller,
} = require("../models");
const { sequelize } = require("../models/index.js");

const cleanUpDatabase = async () => {
  try {
    await OrderProduct.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await Product.destroy({
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
    await Seller.destroy({
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
  } catch (error) {
    console.log(error);
  }
};
const createOrderProducts = async () => {
  try {
    const {
      orderLists,
      orders,
      products,
      shops,
      categories,
      sellers,
    } = require("../db.json");
    await Order.bulkCreate(orders);
    sellers.forEach((el) => {
      delete el.id;
    });
    await Seller.bulkCreate(sellers);
    await Shop.bulkCreate(shops);
    await Category.bulkCreate(categories);
    await Product.bulkCreate(products);
    await OrderProduct.bulkCreate(orderLists);
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
// beforeAll(async () => {
//   await createTwoBuyers();
//   await createOrderProducts();
//   await Product.create({
//     name: "test",
//     price: 10000,
//     stock: 10,
//     ShopId: 1,
//     CategoryId: 1,
//     description: "test",
//     mainImage: "test",
//     slug: "test",
//   });
//   await Order.create({
//     BuyerId: 1,
//     isPaid: false,
//     paymentMethod: "pending",
//     totalPrice: 1892905,
//   });
//   access_token = encode({ id: 1 });
// });

beforeAll(async () => {
  try {
    await createTwoBuyers();
    // await createOrderProducts();
    await Seller.create({
      username: "test",
      email: "sellertestlagi@mail.com",
      password: "123456",
      ktp: "test",
      phoneNumber: "test",
    });
    await Shop.create({
      name: "test",
      address: "test",
      lat: "test",
      long: "test",
      owner: "test",
      phoneNumber: "test",
      SellerId: 1,
    });
    await Category.create({
      name: "test",
    });
    await Product.create({
      name: "test",
      price: 10000,
      stock: 10,
      ShopId: 1,
      CategoryId: 1,
      description: "test",
      mainImage: "test",
      slug: "test",
    });

    await Order.create({
      BuyerId: 1,
      isPaid: false,
      paymentMethod: "pending",
      totalPrice: 1892905,
    });
    await OrderProduct.create({
      OrderId: 1,
      ProductId: 1,
      quantity: 1,
      totalPrice: 10000,
    });
    access_token = encode({ id: 1 });
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  access_token = "";
  await cleanUpDatabase();
});
describe("GET /orders/", () => {
  // beforeAll(async () => {
  //   await createTwoBuyers();
  //   await createOrderProducts();
  //   access_token = encode({ id: 1 });
  // });
  // afterAll(() => {
  //   cleanUpDatabase();
  // });
  test("GET /orders/ success-test", async () => {
    const response = await request(app)
      .get("/orders")
      .set({ access_token: access_token });
    expect(response.status).toBe(200);
    // expect(response.body[0]).toBeInstanceOf(Object);
    // expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    // expect(response.body[0]).toHaveProperty("isPaid", expect.any(Boolean));
    // expect(response.body[0]).toHaveProperty(
    //   "paymentMethod",
    //   expect.any(String)
    // );
    // expect(response.body[0]).toHaveProperty("totalPrice", expect.any(Number));
    // expect(response.body[0]).toHaveProperty("BuyerId", expect.any(Number));
    // expect(response.body[0]).toHaveProperty("OrderProducts", expect.any(Array));
    // expect(response.body[0].OrderProducts[0]).toBeInstanceOf(Object);
    // expect(response.body[0].OrderProducts[0]).toHaveProperty(
    //   "quantity",
    //   expect.any(Number)
    // );
    // expect(response.body[0].OrderProducts[0]).toHaveProperty(
    //   "totalPrice",
    //   expect.any(Number)
    // );
    // expect(response.body[0].OrderProducts[0]).toHaveProperty(
    //   "ProductId",
    //   expect.any(Number)
    // );
    // expect(response.body[0].OrderProducts[0]).toHaveProperty(
    //   "OrderId",
    //   expect.any(Number)
    // );
  });

  test("500 internal server error", async () => {
    jest.spyOn(Order, "findAll").mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await request(app)
      .get("/orders")
      .set({ access_token: access_token });
    expect(response.status).toBe(500);
  });
});

describe("PATCH /products/:orderProductId", () => {
  test("PATCH /products/:orderProductId success", async () => {       
    const response = await request(app)
      .patch("/orders/products/1")
      .set({ access_token })
      .send({
        quantity: 20,
        totalPrice: 100000,
      });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("msg", "orderproduct changed");
  });
  describe("PATCH /products/:orderProductId fail-test", () => {
    test("PATCH /products/:orderProductId unauthorized", async () => {
      const access_token2 = encode({ id: 2 });
      const response = await request(app)
        .patch("/orders/products/1")
        .set({ access_token: access_token2 })
        .send({
          quantity: 20,
          totalPrice: 100000,
        });
      expect(response.status).toBe(403);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Access Forbidden");
    });

    test("PATCH /products/:orderProductId notfound", async () => {
      const response = await request(app)
        .patch("/orders/products/99")
        .set({ access_token })
        .send({
          quantity: 20,
          totalPrice: 100000,
        });
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Error not found");
    });
  });
});

describe("DEL /products/:orderProductId", () => {
  test("DEL /products/:orderProductId success", async () => {
    // access_token2 = encode({ id: 2 });
    const response = await request(app)
      .delete("/orders/products/1")
      .set({ access_token });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("msg", "orderproduct deleted");
  });
  describe("DEL /products/:orderProductId fail-test", () => {
    test("DEL /products/:orderProductId unauthorized", async () => {
      jest.spyOn(OrderProduct, "findOne").mockImplementationOnce(() => {
        throw { name : "forbidden"}
      });
      const access_token2 = encode({ id: 2 });
      const response = await request(app)
        .delete("/orders/products/1")
        .set({ access_token: access_token2 });
      expect(response.status).toBe(403);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Access Forbidden");
    });

    test("DEL 500 internal server error", async () => {
      jest.spyOn(OrderProduct, "findOne").mockImplementationOnce(() => {
        throw new Error();
      });
      const response = await request(app)
        .delete("/orders/products/1")
        .set({ access_token });
      expect(response.status).toBe(500);
    });

    test("DEL /products/:orderProductId notfound", async () => {
      // access_token = encode({ id: 1 });
      const response = await request(app)
        .delete("/orders/products/99")
        .set({ access_token });
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Error not found");
    });
  });
});

describe("PATCH /orders/", () => {
  test("PATCH /orders/ success-test", async () => {
    access_token = encode({ id: 1 });
    const response = await request(app)
      .patch("/orders")
      .set({ access_token: access_token })
      .send({
        paymentMethod: "Installment",
        isPaid: false,
      });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("msg", "order changed");
  });
  describe("PATCH /orders/ fail-test", () => {
    test("PATCH /orders/ invalid-token", async () => {
      const response = await request(app)
        .patch("/orders")
        .set({ access_token: null })
        .send({
          paymentMethod: "Installment",
          isPaid: false,
        });
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Invalid Token");
    });
    test("PATCH /orders/ no-active-order", async () => {
      access_token = encode({ id: 2 });
      const response = await request(app)
        .patch("/orders")
        .set({ access_token: access_token })
        .send({
          paymentMethod: "Installment",
          isPaid: false,
        });
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Error not found");
    });
  });
});

describe("POST /products", () => {
  test("POST /products success-test", async () => {
    const response = await request(app)
      .post("/orders/products")
      .set({ access_token })
      .send({
        orderlists: [
          {
            // OrderId: 2,
            ProductId: 1,
            quantity: 16,
            totalPrice: 50000,
          },
        ],
      });
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("msg", "orderproducts created");
  });
  test("POST /products fail-test", async () => {
    const response = await request(app)
      .post("/orders/products")
      .set({ access_token })
      .send({
        OrderId: 2,
        ProductId: 20,
        quantity: 16,
        totalPrice: 50000,
      });
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "invalid input");
  });
});





describe("POST /midTTrans", () => {
  test("POST /midTTrans success-test", async () => {
    const response = await request(app).post("/orders/midTTrans").send({
      status_code: 200,
      order_id: "1-13",
      installment_term: 3,
      payment_type: "credit_card",
    });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("msg", "order changed");
  });

  test("POST /midTTrans success-test", async () => {
    const response = await request(app).post("/orders/midTTrans").send({
      status_code: 200,
      order_id: "13-13",
      installment_term: 3,
      payment_type: "credit_card",
    });
    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Error not found");
  });

  test("POST /midTTrans success-test", async () => {
    const response = await request(app).post("/orders/midTTrans").send({
      status_code: 200,
      order_id: "1-13",
      payment_type: "credit_card",
    });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("msg", "order changed");
  });
});

describe("PUT /products/bulk", () => {
  test("PUT /products/bulk success-test", async () => {
    const body = {
      orders: {
        OrderProducts: [
          {
            OrderId: 2,
            ProductId: 1,
            quantity: 16,
            totalPrice: 50000,
          },
        ],
      },
    };
    const response = await request(app)
      .put("/orders/products/bulk")
      .set({ access_token })
      .send(body);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("msg", "orderproducts changed");
  });

  test("PUT /products/bulk fail-test", async () => {
    const response = await request(app)
      .put("/orders/products/bulk")
      .set({ access_token })
      .send({
        orders: {
          OrderProducts: [
            {
              // OrderId: 2,
              ProductId: 1,
              quantity: 16,
              totalPrice: 50000,
            },
          ],
        },
      });
    expect(response.status).toBe(500);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
})
