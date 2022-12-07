const request = require("supertest");
const { http: app } = require("../app");
const { encode } = require("../helpers/jwt");
const { Shop, Seller, Product, Image, Category } = require("../models");
const redis = require("../config/redis");

let access_token;
let access_token_invalid;

const productTestSeller = {
  email: "product.test@mail.com",
  password: "producttest",
  username: "producttest",
  phoneNumber: "producttest",
  ktp: "producttest",
};

const imageTest = ["test.png", "test2.png"];

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
    await redis.del("app:products");
    await redis.del("app:productsPagination");
  } catch (error) {
    console.log(error);
  }
});

describe("GET /products", () => {
  test("500 Internal server error", (done) => {
    jest.spyOn(Product, "findAll").mockImplementationOnce(() => {
      throw new Error();
    });
    request(app)
      .get("/products")
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(500);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("message", "Internal Server Error");
        done();
      });
  });

  test("200 Success get all products without redis", (done) => {
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

  test("200 Success get all products with redis", (done) => {
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
  });
});

describe("GET /products", () => {
  test("200 get products by shop", (done) => {
    request(app)
      .get("/products/shop/1")
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
        done();
      });
  });

  test("404, shop not found", (done) => {
    request(app)
      .get("/products/shop/999")
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(404);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("message", "Error not found");
        done();
      });
  });

  test("200 get products by category with pagination", (done) => {
    request(app)
      .get("/products/category/1")
      .query({ page: 1, limit: 3 })
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("products", expect.any(Array));
        expect(body).toHaveProperty("totalProducts", expect.any(Number));
        expect(body).toHaveProperty("totalPage", expect.any(Number));
        expect(body).toHaveProperty("currentPage", expect.any(Number));
        done();
      });
  });

  test("500 internal server error", (done) => {
    jest.spyOn(Product, "findAndCountAll").mockImplementationOnce(() => {
      throw new Error();
    });
    request(app)
      .get("/products/category/1")
      .query({ page: 1, limit: 3 })
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(500);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("message", "Internal Server Error");
        done();
      });
  });

  test("200 get products by category with pagination with search", (done) => {
    request(app)
      .get("/products/category/1")
      .query({ page: 1, limit: 3, name: "productTest" })
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("products", expect.any(Array));
        expect(body).toHaveProperty("totalProducts", expect.any(Number));
        expect(body).toHaveProperty("totalPage", expect.any(Number));
        expect(body).toHaveProperty("currentPage", expect.any(Number));
        done();
      });
  });

  test("500 internal server error", (done) => {
    jest.spyOn(Product, "findAndCountAll").mockImplementationOnce(() => {
      throw new Error();
    });
    request(app)
      .get("/products/pagination")
      .query({ page: 1, limit: 1 })
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(500);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("message", "Internal Server Error");
        done();
      });
  });

  test("200 get products by pagination", (done) => {
    request(app)
      .get("/products/pagination")
      .query({ page: 1, limit: 1 })
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("products", expect.any(Object));
        expect(body.products).toHaveProperty("rows", expect.any(Array));
        expect(body.products).toHaveProperty("count", expect.any(Number));
        expect(body).toHaveProperty("totalPage", expect.any(Number));
        expect(body).toHaveProperty("currentPage", expect.any(Number));
        done();
      });
  });

  test("200 get products by pagination with redis", (done) => {
    request(app)
      .get("/products/pagination")
      .query({ page: 1, limit: 1 })
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("products", expect.any(Object));
        expect(body.products).toHaveProperty("rows", expect.any(Array));
        expect(body.products).toHaveProperty("count", expect.any(Number));
        expect(body).toHaveProperty("totalPage", expect.any(Number));
        expect(body).toHaveProperty("currentPage", expect.any(Number));
        done();
      });
  });

  test("200 get products by pagination with search", (done) => {
    request(app)
      .get("/products/pagination")
      .query({ page: 1, limit: 1, name: "product" })
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("products", expect.any(Object));
        expect(body.products).toHaveProperty("rows", expect.any(Array));
        expect(body.products).toHaveProperty("count", expect.any(Number));
        expect(body).toHaveProperty("totalPage", expect.any(Number));
        expect(body).toHaveProperty("currentPage", expect.any(Number));
        done();
      });
  });

  test("200 get product detail by shop id", (done) => {
    request(app)
      .get("/products/shop/1/product/1")
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("id", expect.any(Number));
        expect(body).toHaveProperty("name", expect.any(String));
        expect(body).toHaveProperty("price", expect.any(Number));
        done();
      });
  });

  test("404, product not found", (done) => {
    request(app)
      .get("/products/shop/1/product/999")
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

  test("POST /products failed internal server error", (done) => {
    jest.spyOn(Product, "create").mockImplementationOnce(() => {
      throw new Error("Internal server error");
    });
    const body = {
      product: {
        name: "productTest test test",
        price: "10000",
        stock: 10,
        description: "productTest",
        CategoryId: 1,
        ShopId: 1,
      },
    }
    request(app)
      .post("/products")
      .set("access_token", access_token)
      .field("product", JSON.stringify(body.product))
      .attach("image", ("__tests__/assets/test.png"))
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(500);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("message", "Internal Server Error");
        done();
      });
  })

  test("POST /products failed internal server error", (done) => {
    jest.spyOn(Product, "create").mockImplementationOnce(() => {
      throw new Error("Internal server error");
    });
    const body = {
      product: {
        name: "productTest test test",
        price: "10000",
        stock: 10,
        description: "productTest",
        CategoryId: 1,
        ShopId: 1,
      },
    }
    request(app)
      .post("/products")
      .set("access_token", access_token)
      .field("product", JSON.stringify(body.product))
      .attach("image", ("__tests__/assets/test3.txt"))
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(500);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("message", "Internal Server Error");
        done();
      });
  })

  test("400 Bad Request create product", (done) => {
    const body = {
      product: {
        name: "product test test lagi",
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
      .send({
        image: imageTest,
      })
      .end((err, res) => {
        if (err) return done(err);
        const { body, status } = res;
        expect(status).toBe(400);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("message", "Price is required");
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
        expect(body).toHaveProperty("message", "success update product");

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


