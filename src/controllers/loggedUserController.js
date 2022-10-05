const mongoose = require('mongoose');
require('../models/userSchema');
require('../models/avatarSchema');
require('../models/sellSchema');
const Sell = mongoose.model('sales');
const User = mongoose.model('users');
const Avatar = mongoose.model('avatars');
const bcrypt = require('bcrypt');

module.exports = {
    async edit (req, res) {
        if (!req.userId) return res.status(401).json({error : "User not authenticated"});
        const userId = req.userId;

        if (!req.body) return res.status(400).json({ error : "Failure to get body"});
        const { name, password, oldPassword, biography } = req.body;

        let problems = [];
        if(!name ||name.length < 1) {
            problems.push({problem : 'invalid name!'});
        }
        if(!oldPassword && password){
            problems.push({problem: 'the old password is necessary to change it'});
        }
        if(password && password.length < 1){
            problems.push({problem: 'invalid password!'});
        }
        if(biography && biography.length > 200) {
            problems.push({problem : 'biography too large'});
        }
        if (problems.length != 0) return res.status(400).json(problems);

        const user = await User.findOne({_id : userId}).select('+password');
        if(!user || user === null || user === undefined) return res.status(401).json({error : "User not found!"});

        function saveUser (name, biography, password){
            if(password) { user.password = password; }
            user.name = name;
            user.biography = biography;
    
            user.save().then(user => {
                user.password = undefined;
                return res.status(200).json(user);
            }).catch(err => {
                return res.status(500).json({error : "Failure to save user changes"});
            });
        }

        if(password) {
            bcrypt.compare(oldPassword, user.password, (error, right) => {
                if(error) return res.status(500).json({error: "Internal error"});
                if(right) {
                    bcrypt.genSalt(8, (err, salt) => {
                        if(err) return res.status(500).json({error : "internal error at data processing"}); 

                        bcrypt.hash(password, salt, (err, hash) => {
                            if(err) return res.status(500).json({error : "internal error at data processing"}); 
                            
                            saveUser(name, biography, hash);
                        });
                    });
                }else{
                    return res.status(400).json({error : "incorrect password"});
                }
            });
        }else{
            saveUser(name, biography);
        }

    },

    async one (req, res) {
        if (!req.userId) return res.status(401).json({error : "User not authenticate"});
        const id = req.userId;

        const user = await User.findById(id);
        if(!user || user === null) return res.status(400).json({error : "User not found"});

        const avatar = await Avatar.findOne({user_id : id});
        avatar.key = undefined;

        const sales = await Sell.find({user_id : id});

        return res.status(200).json({user, avatar, sales});
    },

    async avatar (req, res) {
        const user_id = req.userId;
        if (!user_id) return res.status(401).json({error : "User not authenticate"});

        const {originalname : name, size, key, location} = req.file; 
        if(!name || !size || !key) return res.status(400).json({error : "File without data"});

        
        const newAvatar = {
            user_id,
            name,
            size,
            key,
            location
        }

        if(!location) {
            newAvatar.location = `${process.env.APP_URL}/src/tmp/upload/${key}`;
        }

        const user = await User.findById(user_id);
        if(!user || user === null) return res.status(400).json({error : "User not found"});

        const avatar = await Avatar.findOne({user_id});
        if(avatar && avatar !== null) return res.status(400).json({error: "User have an avatar"});
        
        Avatar.create(newAvatar).then(avatar => {
            avatar.key = undefined;
            return res.status(201).json(avatar);

        }).catch(err => {
            return res.status(500).json({error : "failure to save avatar!" + err});
        });
    },
}