const { decode } = require("../helpers/jwt");
const { Seller, Shop } = require("../models");

const authShop = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw { name: "invalid_token" };
    }
    const payload = decode(access_token);
    const userLogged = await Seller.findByPk(payload.id, {
        include: ["Shop"],
    });

    if (!userLogged) {
      throw { name: "invalid_token" };
    }
    req.shop = {
        id: userLogged.Shop.id,
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authShop;
