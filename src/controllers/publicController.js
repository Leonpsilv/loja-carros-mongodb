const mongoose = require('mongoose');
require('../models/userSchema');
const User = mongoose.model('users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_KEY, JWT_EXPIRES } = process.env;
const JWT_EXPIRES_NUMBER = parseInt(JWT_EXPIRES);

module.exports = {
    async login (req, res) {
        if(!JWT_KEY) return res.status(500).json({error : "key jwt not declared"});
        if(!JWT_EXPIRES) return res.status(500).json({error : "jwt deadline not declared"});

        const auth = req.headers.authorization;
        if (auth && auth.split(' ')[0] === 'Bearer') return res.json({text : "User already authenticate"});

        if (!req.body) return res.status(400).json({ error : "Failure to get body"});

        const { cpf, password } = req.body;
        if (!cpf || !password) return res.status(400).json({error : "All the fields must be filled!"});

        const user = await User.findOne({cpf}).select('+password');
        if(!user) return res.status(400).json({error : "Incorrect cpf or password"});

        bcrypt.compare(password, user.password, (error, right) => {
            if(error) return res.status(500).json({error: "Internal error"});
            if(right){
                const token = jwt.sign({id : user.id}, JWT_KEY, { 
                    expiresIn: JWT_EXPIRES_NUMBER
                });
                user.password = undefined;
                return res.status(200).json({ user, token});
            }
                return res.status(400).json({error : "incorrect cpf or password"});
        });
        
    }
}