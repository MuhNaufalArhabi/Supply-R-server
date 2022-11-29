const jwt = require('jsonwebtoken');
const secret = 'rahasia'

const encode = (payload) => {
    return jwt.sign(payload, secret)
}

const decode = (token) => {
    return jwt.verify(token, secret)
}

module.exports = {
    encode,
    decode
}