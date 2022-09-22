const mongoose = require('mongoose');
require('../models/userSchema');
const User = mongoose.model('users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_KEY } = process.env;

module.exports = {
    async store (req, res) {
        if (!req.body) return res.status(400).json({ error : "Failure to get body"});
        const { name, email, cpf, password, biography } = req.body;

        let problems = [];

        if(!name ||name.length < 1) {
            problems.push({problem : 'invalid name!'});
        }
        if(!email ||email.length <= 5) {
            problems.push({problem : 'invalid email!'});
        }
        if(!password ||password.length < 1) {
            problems.push({problem : 'invalid password!'});
        }
        if(!cpf ||cpf.length < 11) {
            problems.push({problem : 'invalid cpf!'});
        }

        if (problems.length != 0) return res.status(400).json(problems);

        const user = await User.findOne();;

        if(user) return res.status(400).json({error : "an account with this email already exists"});

        bcrypt.genSalt(8, (err, salt) => {
            if(err) return res.status(500).json({error : "internal error at data processing"}); 

            bcrypt.hash(password, salt, (err, hash) => {
                if(err) return res.status(500).json({error : "internal error at data processing"}); 

                const newUser = {
                    name,
                    cpf,
                    email,
                    password: hash,
                    biography
                }

                User.create(newUser).then(user => {
                    const token = createToken({id : user.id});
                    return res.status(200).json({user, token});

                }).catch(err => {
                    return res.status(500).json({error : "failure to create user!"});
                });
            });
        });
    }
}