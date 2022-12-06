const { decode } = require("../helpers/jwt");
const { Buyer, OrderProduct, Order,  } = require("../models");
async function authenticateBuyer(req, res, next) {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw { name: "invalid_token" };
    }
    const payload = decode(access_token);
    // if (!payload) {
    //   throw { name: "invalid_token" };
    // }
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
async function authDelBuyer(req,res,next){
  try {
    const { id: buyerId } = req.buyer;
    const requestedId = +req.params.orderProductId;
    const orderProduct = await OrderProduct.findOne({
      where: { id: requestedId },
      include: {
        model: Order,
        include: Buyer
      }
    });
    if(!orderProduct){
      throw {name:"not_found"}
    }
    if(buyerId!==orderProduct.Order.Buyer.id){
      throw { name: "forbidden" };
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authenticateBuyer, authDelBuyer };
