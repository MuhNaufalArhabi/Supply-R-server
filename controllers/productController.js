const { Product, Images, Shop, Category } = require("../models");
const { sequelize } = require("../models");

class ProductController {
  static async getAllProducts(req, res, next) {
    try {
      const products = await Product.findAll({
        include: ["Shop", "Category", "Images"],
      });
      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: ["Shop", "Category", "Images"],
      });
      if (!product) {
        throw { name: "not_found" };
      }
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async addProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { name, price, stock, description, CategoryId } = req.body;
      const ShopId = req.shop.id;
      const slug = name.toLowerCase().split(" ").join("-");
      const mainImage = req.file;
      const newProduct = await Product.create(
        {
          name,
          price,
          stock,
          description,
          ShopId,
          CategoryId,
          slug,
          mainImage,
        },
        { transaction: t }
      );
      const images = req.files.map((file) => {
        return {
          image: file.imageUrl,
          ProductId: newProduct.id,
        };
      });
      await Images.bulkCreate(images, { transaction: t });
      console.log(req.user)
      await t.commit();
      res.status(201).json(newProduct);
    } catch (error) {
      console.log(error);
      console.log(req.user)
      await t.rollback();
      next(error);
    }
  }

  static async editProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { name, price, stock, description, CategoryId } = req.body;
      const ShopId = req.shop.id;
      const slug = name.toLowerCase().split(" ").join("-");
      const product = await Product.findByPk(id);
      if (!product) {
        throw { name: "not_found" };
      }
      const updatedProduct = await Product.update(
        { name, price, stock, description, ShopId, CategoryId, slug },
        { where: { id }, returning: true, transaction: t }
      );
      const images = req.files.map((file) => {
        return {
          image: file.imageUrl,
          ProductId: id,
        };
      });
      await Images.bulkCreate(images, { transaction: t });
      await t.commit();
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.log(error);
      await t.rollback();
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        throw { name: "not_found" };
      }
      await Product.destroy({ where: { id }, transaction: t });
      await Images.destroy({ where: { ProductId: id }, transaction: t });
      await t.commit();
      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      console.log(error);
      await t.rollback();
      next(error);
    }
  }
}

module.exports = ProductController;
