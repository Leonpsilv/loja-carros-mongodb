const mongoose = require('mongoose');
require('../models/userSchema');
require('../models/adminSchema');

const User = mongoose.model('users');
const Admin = mongoose.model('admins');
const bcrypt = require('bcrypt');

module.exports = {
    async storeUser (req, res) {
        if (!req.body) return res.status(400).json({ error : "Failure to get body"});
        const { name, email, cpf, password, biography, admin } = req.body;

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

        const user = await User.findOne({cpf, email});

        if(user !== null && user !== undefined) return res.status(400).json({error : "this account already exists"});

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
                    user.password = undefined;
                    return res.status(200).json({user});

                }).catch(err => {
                    return res.status(500).json({error : "failure to create user!" + err});
                });
            });
        });
    }, 

    async storeAdmin (req, res) {
        if (!req.body) return res.status(400).json({ error : "Failure to get body"});

        const { cpf } = req.body;
        if (!cpf) return res.status(400).json({error : "The field must be fulled!"});

        const user = await User.findOne({cpf});
        if(user === null || user === undefined) return res.status(400).json({error : "invalid cpf"});

        if(!user.id || user.id.length < 1) return res.status(400).json({error : "invalid user"});

        const admin = await Admin.findOne({user_id : user.id});
        if(admin.length !== 0) return res.status(400).json({error : "This user is already an admin"});
        const newAdmin = {
            user_id : user.id
        }
        Admin.create(newAdmin).then((adm) => {
            return res.status(201).json({text : `User ${user.name} add to admin list!   - ${adm}`});
        }).catch(e => {
            return res.status(500).json({error : "Failure to add user to admin list"});
        });
    },

    async all (req, res) {
        try{
            const adminList = await Admin.find();
            if (adminList.length === 0) return res.status(204).json({});

            const admins = [];
            for (let index = 0; index < adminList.length; index++) {
                const id = adminList[index];
                admins.push(await User.findOne({_id: id.user_id}));
            }

            return res.status(200).json(admins);
        }catch(e){
            return res.status(500).json({error : "Failure to get data"});
        }
    }
}