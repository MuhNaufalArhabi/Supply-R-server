const bcrypt = require('bcryptjs');

const hashPass = (pass) => {
    return bcrypt.hashSync(pass)
}

const comparePass = (pass, hash) => {
    return bcrypt.compareSync(pass, hash)
}

module.exports = {
    hashPass,
    comparePass
}