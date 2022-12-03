const { Seller } = require('../models');
const { encode } = require("../helpers/jwt");

class SosmedController {
  static async googleLogin(req, res, next) {
    try {
      let { email, username } = req.body;
      const [user, created] = await Seller.findOrCreate({
        where: {
          email: email
        },
        defaults: {
          username: username,
          email: email,
          password: 'google_secret',
          ktp: '',
          phoneNumber: ''
        }
      })
      const access_token = encode({
        id: user.id
      })
      res.status(200).json({access_token, message: `login Google ok` })
    } catch (err) {
      console.log('masuk errror')
      next(err);
    }
  }

  static async facebookLogin(req, res, next) {
    try {
      let { email, username } = req.body;
      const [user, created] = await Seller.findOrCreate({
        where: {
          email: email
        },
        defaults: {
          username: username,
          email: email,
          password: 'facebook_secret',
          ktp: '',
          phoneNumber: ''
        }
      })
      const access_token = encode({
        id: user.id
      })
      res.status(200).json({access_token, message: `login Facebook ok` })
    } catch (err) {
      next(err);
    }
  }

  static async twitterLogin(req, res, next) {
    try {
      let { email, username } = req.body;
      const [user, created] = await Seller.findOrCreate({
        where: {
          email: email
        },
        defaults: {
          username: username,
          email: email,
          password: 'twitter_secret',
          ktp: '',
          phoneNumber: ''
        }
      })
      const access_token = encode({
        id: user.id
      })
      res.status(200).json({access_token, message: `login Twitter ok` })
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SosmedController;
