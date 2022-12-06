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
  Seller,
} = require("../models");

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
beforeAll(async () => {
  await createTwoBuyers();
  await createOrderProducts();
  await createOrderProducts();
  await Order.create({
    BuyerId: 1,
    isPaid: false,
    paymentMethod: "pending",
    totalPrice: 1892905,
  });
  access_token = encode({ id: 1 });
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

describe("PATCH /orders/", () => {
  // beforeAll(async () => {
  //   try {
  //     await createTwoBuyers();
  //     await createOrderProducts();
  //     const order = await Order.create({
  //       BuyerId: 1,
  //       isPaid: false,
  //       paymentMethod: "pending",
  //       totalPrice: 1892905,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  // afterAll(() => {
  //   cleanUpDatabase();
  // });
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
      // console.log(response.body);
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
      // console.log(response.body);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Error not found");
    });
  });
});

describe("POST /products", () => {
  // beforeAll(async () => {
  //   try {
  //     await createTwoBuyers();
  //     await createOrderProducts();
  //     // const order = await Order.create({
  //     //   BuyerId: 1,
  //     //   isPaid: false,
  //     //   paymentMethod: "pending",
  //     //   totalPrice: 1892905,
  //     // });
  //     access_token = encode({ id: 1 });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  // afterAll(() => {
  //   cleanUpDatabase();
  // });
  test("POST /products success-test", async () => {
    const response = await request(app)
      .post("/orders/products")
      .set({ access_token })
      .send({
        orderlists: [
          {
            // OrderId: 2,
            ProductId: 20,
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

describe("DEL /products/:orderProductId", () => {
  // beforeAll(async () => {
  //   try {
  // await createTwoBuyers();
  // await createOrderProducts();
  // await Order.create({
  //   BuyerId: 1,
  //   isPaid: false,
  //   paymentMethod: "pending",
  //   totalPrice: 1892905,
  // });
  // await OrderProduct.create({
  //   OrderId: 3,
  //   ProductId: 20,
  //   quantity: 16,
  //   totalPrice: 427760,
  // });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  // afterAll(() => {
  //   cleanUpDatabase();
  // });
  test("DEL /products/:orderProductId success", async () => {
    // access_token = encode({ id: 1 });
    const response = await request(app)
      .delete("/orders/products/11")
      .set({ access_token });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("msg", "orderproduct deleted");
  });
  describe("DEL /products/:orderProductId fail-test", () => {
    test("DEL /products/:orderProductId unauthorized", async () => {
      access_token = encode({ id: 1 });
      const response = await request(app)
        .delete("/orders/products/3")
        .set({ access_token });
      expect(response.status).toBe(403);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Access Forbidden");
    });
    test("DEL /products/:orderProductId notfound", async () => {
      // access_token = encode({ id: 1 });
      const response = await request(app)
        .delete("/orders/products/13")
        .set({ access_token });
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Error not found");
    });
  });
});

describe("PATCH /products/:orderProductId", () => {
  let id;
  beforeAll(async () => {
    try {
      // await createTwoBuyers();
      // await createOrderProducts();
      // const order = await Order.create({
      //   BuyerId: 1,
      //   isPaid: false,
      //   paymentMethod: "pending",
      //   totalPrice: 1892905,
      // });
      await Order.create({
        BuyerId: 1,
        isPaid: false,
        paymentMethod: "pending",
        totalPrice: 1892905,
      });
      const orderp = await OrderProduct.create({
        OrderId: 3,
        ProductId: 20,
        quantity: 16,
        totalPrice: 427760,
      });
      id=orderp.id
    } catch (error) {
      console.log(error);
    }
  });
  // afterAll(() => {
  //   cleanUpDatabase();
  // });
  test("PATCH /products/:orderProductId success", async () => {
    access_token = encode({ id: 1 });
    // await OrderProduct.create({
    //   OrderId: 3,
    //   ProductId: 20,
    //   quantity: 16,
    //   totalPrice: 427760,
    // });
    const response = await request(app)
      .patch(`/orders/products/${id}`)
      .set({ access_token })
      .send({
        quantity: 100,
        totalPrice: 100000,
      });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("msg", "orderproduct changed");
  });
  describe("PATCH /products/:orderProductId fail-test", () => {
    test("PATCH /products/:orderProductId unauthorized", async () => {
      access_token = encode({ id: 1 });
      const response = await request(app)
        .patch("/orders/products/3")
        .set({ access_token });
      expect(response.status).toBe(403);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Access Forbidden");
    });
    test("PATCH /products/:orderProductId notfound", async () => {
      access_token = encode({ id: 1 });
      const response = await request(app)
        .patch("/orders/products/13")
        .set({ access_token });
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Error not found");
    });
  });
});
