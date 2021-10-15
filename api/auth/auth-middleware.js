const Users = require('./auth-model.js')

const { JWT_SECRET } = require("../secrets"); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const validReqBody = (req, res, next) => {
    const {username, password} = req.body

    if(!username || !username.trim() || !password || !password.trim()) {
        res.status(422).json({message: "username and password required"})
    }
    else {
        next();
    }
}

const checkUsernameExists = async (req, res, next) => {
    const alreadyUsername = await Users.findBy({username: req.body.username})

        if(alreadyUsername.length){
            res.status(422).json({message: "username taken"})
        }
        else {
            next();
        }
}

const checkUsernameValid = async (req, res, next) => {
    const validUser = await Users.findBy({username: req.body.username})

        if(!validUser.length){
            res.status(422).json({message: "invalid credentials"})
        }
        else {
            req.user = validUser[0]
            next();
        }
}

const checkPasswordValid = (req, res, next) => {

    const buildToken = (user) => {
        const payload = {
            subject: user.id,
            username: user.username
        };
        const options = {
            expiresIn: '1d'
        }
        return jwt.sign(payload, JWT_SECRET, options)
    }

    if (bcrypt.compareSync(req.body.password, req.user.password)){
        const token = buildToken(req.user)

        res.status(200).json({
            message: `welcome, ${req.user.username}`,
            token
        })
        next()
    }
    else {
        res.status(422).json({message: "invalid credentials"})
    }
}

module.exports = {
    validReqBody,
    checkUsernameExists,
    checkUsernameValid,
    checkPasswordValid
}