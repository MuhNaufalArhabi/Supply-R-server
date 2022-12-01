const { decode } = require("../helpers/jwt");
const { Buyer } = require("../models");
async function authenticateBuyer(req, res, next) {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw { name: "invalid_token" };
    }
    const payload = decode(access_token);
    if (!payload) {
      throw { name: "invalid_token" };
    }
    const buyerData = await Buyer.findOne({
      where: { id: payload.id },
    });
    if (!buyerData) {
      throw { name: "invalid_token" };
    }
    req.buyer = { id: buyerData.id };
    next();
  } catch (error) {
    next(error);
  }
}
async function authorizBuyer(req,res,next){
  try {
    const { id: buyerId } = req.buyer;
    const requestedId = req.params.id;
    
  } catch (error) {
    next(error);
  }
}

module.exports = {authenticateBuyer};
