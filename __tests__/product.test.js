const request = require("supertest");
const app = require("../app");
const { encode } = require("../helpers/jwt");
const { Shop, Seller, Product, Image, Category } = require("../models");

let access_token;
let access_token_invalid;

const productTestSeller = {
  email: "product.test@mail.com",
  password: "producttest",
  username: "producttest",
  phoneNumber: "producttest",
  ktp: "producttest",
};

const imageTest = [
  "shoptest1.jpg", "testshop2.jpg", "testshop3.jpg"
];

beforeAll(async () => {
  try {
    const seller = await Seller.create(productTestSeller);
    access_token = encode({ id: seller.id, email: seller.email });
    access_token_invalid = encode({ id: 999, email: "wrodng@mail.com" });
    const shopTest = {
      name: "shopTest",
      address: "shopTest",
      lat: "1",
      long: "1",
      phoneNumber: "1234567890",
      owner: "shopTest",
      SellerId: seller.id,
    };
    const shop = await Shop.create(shopTest);
    const category = await Category.create({ name: "categoryTest" });
    const productTest = {
      name: "productTest",
      price: 10000,
      stock: 10,
      description: "productTest",
      slug: "productTest",
      CategoryId: category.id,
      ShopId: shop.id,
      mainImage: "productTest",
    };
    const product = await Product.create(productTest);
    await Image.bulkCreate(imageTest);
  } catch (error) {}
});

afterAll(async () => {
  try {
    access_token = null;
    access_token_invalid = null;
    await Seller.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await Shop.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await Product.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await Category.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  } catch (error) {
    console.log(error);
  }
});

describe("GET /products", () => {
  test("200 Success get all products", (done) => {
    request(app)
      .get("/products")
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Array);
        expect(body[0]).toBeInstanceOf(Object);
        expect(body[0]).toHaveProperty("id", expect.any(Number));
        expect(body[0]).toHaveProperty("name", expect.any(String));
        expect(body[0]).toHaveProperty("price", expect.any(Number));
        expect(body[0]).toHaveProperty("stock", expect.any(Number));
        expect(body[0]).toHaveProperty("description", expect.any(String));
        expect(body[0]).toHaveProperty("ShopId", expect.any(Number));
        expect(body[0]).toHaveProperty("CategoryId", expect.any(Number));
        expect(body[0]).toHaveProperty("createdAt", expect.any(String));
        expect(body[0]).toHaveProperty("updatedAt", expect.any(String));
        done();
      });
  });

  test("200 success get product by id", (done) => {
    request(app)
      .get("/products/1")
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("id", expect.any(Number));
        expect(body).toHaveProperty("name", expect.any(String));
        expect(body).toHaveProperty("price", expect.any(Number));
        expect(body).toHaveProperty("stock", expect.any(Number));
        expect(body).toHaveProperty("description", expect.any(String));
        expect(body).toHaveProperty("ShopId", expect.any(Number));
        expect(body).toHaveProperty("CategoryId", expect.any(Number));
        expect(body).toHaveProperty("createdAt", expect.any(String));
        expect(body).toHaveProperty("updatedAt", expect.any(String));
        done();
      });
  });

  test("404 error get product by id not found", (done) => {
    request(app)
      .get("/products/999")
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(404);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("message", "Error not found");
        done();
      });
  })
});


describe("POST /products", () => {
  test("201 Success create product", (done) => {
    const body = {
      product: {
        name: "productTest test test",
        price: "10000",
        stock: 10,
        description: "productTest",
        CategoryId: 1,
        ShopId: 1,
      },
      image: imageTest,
    };
    request(app)
      .post("/products")
      .set("access_token", access_token)
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(201);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("id", expect.any(Number));
        expect(body).toHaveProperty("name", expect.any(String));
        expect(body).toHaveProperty("price", expect.any(Number));
        expect(body).toHaveProperty("stock", expect.any(Number));
        expect(body).toHaveProperty("description", expect.any(String));
        expect(body).toHaveProperty("ShopId", expect.any(Number));
        expect(body).toHaveProperty("CategoryId", expect.any(Number));
        expect(body).toHaveProperty("createdAt", expect.any(String));
        expect(body).toHaveProperty("updatedAt", expect.any(String));
        done();
      });
  });

  test("400 Bad Request create product", (done) => {
    const body = {
      product: {
        price: 10000,
        stock: 10,
        description: "productTest",
        slug: "productTest",
        CategoryId: 1,
        ShopId: 1,
        mainImage: "productTest",
      },
      image: imageTest,
    };
    request(app)
      .post("/products")
      .set("access_token", access_token)
      .send(body)
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(400);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("message", "Name is required");
        done();
      });
  });
});

describe("PUT /products", () => {
    test("200 Success update product", (done) => {
        const body = {
        product: {
            name: "productTest trs trs",
            price: 10000,
            stock: 10,
            description: "productTest",
            CategoryId: 1,
        },
        image: imageTest,
        };
        request(app)
        .put("/products/1")
        .set("access_token", access_token)
        .send(body)
        .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
            expect(status).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toHaveProperty("message", "Product updated");
            
            done();
        });
    });

    test("401 Unauthorized update product", (done) => {
        const body = {
        product: {
            name: "productTest",
            price: 10000,
            stock: 10,
            description: "productTest",
            slug: "productTest",
            CategoryId: 1,
        },
        image: imageTest,
        };
        request(app)
        .put("/products/1")
        .send(body)
        .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
            expect(status).toBe(401);
            expect(body).toBeInstanceOf(Object);
            expect(body).toHaveProperty("message", "Invalid Token");
            done();
        }
        );
    });

    test("401 Unauthorized update product", (done) => {
        const body = {
        product: {
            name: "productTest",
            price: 10000,
            stock: 10,
            description: "productTest",
            slug: "productTest",
            CategoryId: 1,
        },
        image: imageTest,
        };
        request(app)
        .put("/products/1")
        .send(body)
        .set("access_token", access_token_invalid)
        .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
            expect(status).toBe(401);
            expect(body).toBeInstanceOf(Object);
            expect(body).toHaveProperty("message", "Invalid Token");
            done();
        }
        );
    });

    test("404 Not Found update product", (done) => {
        const body = {
        product: {
            name: "productTest",
            price: 10000,
            stock: 10,
            description: "productTest",
            slug: "productTest",
            CategoryId: 1,
        },
        image: imageTest,
        };
        request(app)
        .put("/products/999")
        .send(body)
        .set("access_token", access_token)
        .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
            expect(status).toBe(404);
            expect(body).toBeInstanceOf(Object);
            expect(body).toHaveProperty("message", "Error not found");
            done();
        });
    });

});

describe("DELETE /products", () => {
    test("200 Success delete product", (done) => {
        request(app)
        .delete("/products/1")
        .set("access_token", access_token)
        .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
            expect(status).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toHaveProperty("message", "Product deleted");
            done();
        });
    });

    test("401 Unauthorized delete product", (done) => {
        request(app)
        .delete("/products/1")
        .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
            expect(status).toBe(401);
            expect(body).toBeInstanceOf(Object);
            expect(body).toHaveProperty("message", "Invalid Token");
            done();
        });
    });

    test("401 Unauthorized delete product", (done) => {
        request(app)
        .delete("/products/1")
        .set("access_token", access_token_invalid)
        .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
            expect(status).toBe(401);
            expect(body).toBeInstanceOf(Object);
            expect(body).toHaveProperty("message", "Invalid Token");
            done();
        });
    });

    test("404 Not Found delete product", (done) => {
        request(app)
        .delete("/products/100")
        .set("access_token", access_token)
        .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
            expect(status).toBe(404);
            expect(body).toBeInstanceOf(Object);
            expect(body).toHaveProperty("message", "Error not found");
            done();
        });
    });

});