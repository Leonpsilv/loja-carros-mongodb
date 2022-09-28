const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('../models/userSchema');
require('../models/adminSchema');
const Admin = mongoose.model('admins');
const User = mongoose.model('users');
require('dotenv').config();
const { JWT_KEY } = process.env;

module.exports = {
    async loginValidate (req, res, next) {
        try{
            if(!JWT_KEY) return res.status(500).json({error : "Key jwt not declared"});
            if(!req || !req.headers) return res.status(401).json({error : 'Access token not defined'});

            const authorization = req.headers.authorization;
            if(!authorization || authorization < 8) return res.status(401).json({error : 'access token not defined'});

            const token = authorization.substring(7);
            jwt.verify(token, JWT_KEY, function(err, decoded) { 
                if (err) return res.status(500).json({ error : 'Invalid Token' }); 
                
                const id = decoded.id;
                User.findOne({_id : id}).then(user => {
                    if(!user || user === null || user === undefined) return res.status(401).json({error : 'token with invalid data!'}); 

                    req.userId = user.id;
                    next(); 
                }).catch(err => {
                    return res.status(400).json({error : "Failure to verify token data"});
                });
            });

        }catch(e){
            return res.status(401).json({error : 'Failure to verify the user access'});
        }
    },

    async adminValidate (req, res, next) {
        try{
            if(!JWT_KEY) return res.status(500).json({error : "Key jwt not declared"});
            if(!req || !req.headers) return res.status(401).json({error : 'Access token not defined'});

            const authorization = req.headers.authorization;
            if(!authorization || authorization < 8) return res.status(401).json({error : 'access token not defined'});

            const token = authorization.substring(7);
            jwt.verify(token, JWT_KEY, function(err, decoded) { 
                if (err) return res.status(500).json({ error : 'Invalid Token' }); 
                
                const id = decoded.id;
                Admin.findOne({user_id : id}).then(admin => {
                    if(!admin || admin === null || admin === undefined) return res.status(401).json({error : 'token with invalid data!'}); 
                    
                    req.userId = admin.user_id;
                    next(); 

                }).catch(err => {
                    return res.status(400).json({error : "Failure to verify token data"});
                });
            });

        }catch(e){
            return req.status(401).json({error : 'Failure to verify the user access'});
        } 
    },
}