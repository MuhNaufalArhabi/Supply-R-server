const { decode } = require("../helpers/jwt");
const { Seller } = require("../models");
const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw { name: "forbidden" };
    }

    const payload = decode(access_token);
    const userLogged = await Seller.findByPk(payload.id);

    if (!userLogged) {
      throw { name: "invalid_token" };
    }

    req.user = {
      id: userLogged.id,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
