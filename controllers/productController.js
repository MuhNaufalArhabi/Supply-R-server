const { Product, Image, Shop, Category } = require('../models');
const { sequelize } = require('../models');
const ImageKit = require('imagekit')
const fs = require('fs');
const { Op } = require('sequelize');

const imagekit = new ImageKit({
  urlEndpoint: 'https://ik.imagekit.io/yyfgxwocn',
  publicKey: 'public_Z+0rVBD68ZVwViLs3o8/sEBMjgE=',
  privateKey: 'private_wja61SmIo3QnDDoZfZanme/WaK0=',
});

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

class ProductController {
  static async getAllProducts(req, res, next) {
    try {
      const products = await Product.findAll({
        include: ['Shop', 'Category', 'Images'],
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
        include: ['Shop', 'Category', 'Images'],
      });
      if (!product) {
        throw { name: 'not_found' };
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
      const uploadImages = req.body.image.map((gambar) => {
        return imagekit.upload(
            {
              file: gambar, //required
              fileName: makeid(10) + '-' + 'supllyR' + '.jpg', //required
              tags: ['foto'],
            } 
          )
          .then(result => {
            return result.url
          })
      })
      let data = await Promise.all(uploadImages); 
      const { name, price, stock, description, CategoryId } = JSON.parse(req.body.product)
      const ShopId = req.shop.id;
      const slug = name.split(' ').join('-');
      const mainImage = data[0];
      const newProduct = await Product.create(
        {
          name,
          price,
          stock,
          description,
          ShopId,
          CategoryId,
          slug,
          mainImage
        },
        { transaction: t }
      );
      const images = data.slice(1).map((file) => {
        return {
          image: file,
          ProductId: newProduct.id,
        };
      });
      await Image.bulkCreate(images, { transaction: t });
      await t.commit();
      res.status(201).json(newProduct);
    } catch (error) {
      console.log(error);
      console.log(req.user);
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
      const slug = name.toLowerCase().split(' ').join('-');
      const product = await Product.findByPk(id);
      if (!product) {
        throw { name: 'not_found' };
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
      await Image.bulkCreate(images, { transaction: t });
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
        throw { name: 'not_found' };
      }
      await Product.destroy({ where: { id }, transaction: t });
      await Image.destroy({ where: { ProductId: id }, transaction: t });
      await t.commit();
      res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
      console.log(error);
      await t.rollback();
      next(error);
    }
  }

  static async getProductsByShop(req, res, next) {
    try {
      const { shopId } = req.params;
      const products = await Product.findAll({
        where: { ShopId: shopId },
        include: ['Shop', 'Category', 'Images'],
      });
      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getProductsByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const products = await Product.findAll({
        where: { CategoryId: categoryId },
        include: ['Shop', 'Category', 'Images'],
      });
      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getProductDetailByShop(req, res, next) {
    try {
      const { shopId } = req.shop;
      const { productId } = req.params;
      const product = await Product.findOne({
        where: { ShopId: shopId, id: productId },
        include: ['Shop', 'Category', 'Images'],
      });
      if (!product) {
        throw { name: 'not_found' };
      }
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async getProductsPagination(req, res, next) {
    try {
      const { page, limit } = req.query;
      const offset = (page - 1) * limit;
      const products = await Product.findAndCountAll({
        limit,
        offset,
        include: ['Shop', 'Category', 'Images'],
      });
      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async searchProduct(req, res, next) {
    try {
      const { name } = req.query;
      const products = await Product.findAll({
        where: { name: { [Op.iLike]: `%${name}%` } },
        include: ['Shop', 'Category', 'Images'],
      });
      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async searchProductByCategory(req, res, next) {
    try {
      const { name } = req.query;
      const { categoryId } = req.params;
      const products = await Product.findAll({
        where: {
          name: { [Op.iLike]: `%${name}%` },
          CategoryId: categoryId,
        },
        include: ['Shop', 'Category', 'Images'],
      });
      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

}

module.exports = ProductController;
