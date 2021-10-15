const Users = require('./auth-model.js')

const { JWT_SECRET } = require("../secrets"); 
const jwt = require('jsonwebtoken');

const validCredentials = async (req, res, next) => {
    const {username, password} = req.body


    if(!username || !username.trim() || !password || !password.trim() || password.trim().length < 4) {
        res.status(422).json({message: "username and password of at least 4 characters required"})
    }
    else {
        const alreadyUsername = await 
        next()
    }
}

module.exports = {
    validCredentials
}