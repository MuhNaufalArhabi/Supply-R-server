const { Seller, Shop } = require("../models");
const { encode } = require("../helpers/jwt");

class SosmedController {
  static async googleLogin(req, res, next) {
    try {
      let { email, username } = req.body;
      const [user, created] = await Seller.findOrCreate({
        where: {
          email: email,
        },
        defaults: {
          username: username,
          email: email,
          password: "google_secret",
          ktp: "",
          phoneNumber: "",
        },
        hooks: false,
      });
      const access_token = encode({
        id: user.id,
      });
      const shop = await Shop.findOne({ where: { SellerId: user.id } });
      if (shop === null) {
        res
          .status(200)
          .json({
            access_token,
            message: `login Google ok`,
            sellerId: user.id,
            username: user.username,
            role: "seller",
          });
      } else {
        res
          .status(200)
          .json({
            access_token,
            message: `login Google ok`,
            sellerId: user.id,
            username: user.username,
            role: "seller",
            shopId: shop.id,
            shopName: shop.name,
          });
      }
    } catch (err) {
      next(err);
    }
  }

  static async facebookLogin(req, res, next) {
    try {
      let { email, username } = req.body;
      const [user, created] = await Seller.findOrCreate({
        where: {
          email: email,
        },
        defaults: {
          username: username,
          email: email,
          password: "facebook_secret",
          ktp: "",
          phoneNumber: "",
        },
        hooks: false,
      });
      const access_token = encode({
        id: user.id,
      });
      const shop = await Shop.findOne({ where: { SellerId: user.id } });
      if (shop === null) {
        res.status(200).json({
          access_token,
          message: `login Facebook ok`,
          sellerId: user.id,
          username: user.username,
          role: "seller",
        });
      } else {
        res.status(200).json({
          access_token,
          message: `login Facebook ok`,
          sellerId: user.id,
          username: user.username,
          role: "seller",
          shopId: shop.id,
          shopName: shop.name,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async twitterLogin(req, res, next) {
    try {
      let { email, username } = req.body;
      const [user, created] = await Seller.findOrCreate({
        where: {
          email: email,
        },
        defaults: {
          username: username,
          email: email,
          password: "twitter_secret",
          ktp: "",
          phoneNumber: "",
        },
        hooks: false,
      });
      const access_token = encode({
        id: user.id,
      });
      const shop = await Shop.findOne({ where: { SellerId: user.id } });
      if (shop === null) {
        res.status(200).json({
          access_token,
          message: `login Twitter ok`,
          sellerId: user.id,
          username: user.username,
          role: "seller",
        });
      } else {
        res.status(200).json({
          access_token,
          message: `login Twitter ok`,
          sellerId: user.id,
          username: user.username,
          role: "seller",
          shopId: shop.id,
          shopName: shop.name,
        });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SosmedController;
