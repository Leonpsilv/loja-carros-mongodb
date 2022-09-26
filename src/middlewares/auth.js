const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('../models/userSchema');
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
                if (err) return res.status(500).jsoN({ error : 'Invalid Token' }); 

                req.userId = decoded.id; 
                next(); 
            });

        }catch(e){
            return res.status(401).json({error : 'Failure to verify the user access'});
        }
    }


}