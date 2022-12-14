const mongoose = require('mongoose');
require('../models/userSchema');
require('../models/adminSchema');
require('../models/sellSchema');

const User = mongoose.model('users');
const Admin = mongoose.model('admins');
const Sell = mongoose.model('sales');
const bcrypt = require('bcrypt');

module.exports = {
    async storeUser (req, res) {
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
        if(biography.length > 200) {
            problems.push({problem : 'biography too large'});
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
                    return res.status(500).json({error : "failure to create user!"});
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
        if(admin) return res.status(400).json({error : "This user is already an admin"});
        const newAdmin = {
            user_id : user.id
        }
        Admin.create(newAdmin).then((adm) => {
            return res.status(201).json({text : `User ${user.name} add to admin list!`});
        }).catch(e => {
            return res.status(500).json({error : "Failure to add user to admin list"});
        });
    },

    async allAdmins (req, res) {
        try{
            const adminList = await Admin.find();
            if (adminList.length === 0) return res.status(204).json({});

            const admins = [];
            for (let index = 0; index < adminList.length; index++) {
                const id = adminList[index];
                if(id){
                    admins.push(await User.findOne({_id: id.user_id}));
                }
            }

            return res.status(200).json(admins);
        }catch(e){
            return res.status(500).json({error : "Failure to get data"});
        }
    },

    async allUsers (req, res) {
        const page = parseInt(req.query['page']);
        const max = parseInt(req.query['max']);
        let skip = 0;
        

        if(!page && !max){
            const users = await User.find();
            if (!users || users.length === 0) return res.status(204).json({});
            return res.status(200).json(users);
        }
        
        for (let index = 0; index < page; index++) {
            skip += max;
        }
        const users = await User.find().skip(skip).limit(max);
        if (!users || users.length === 0) return res.status(204).json({});
        return res.status(200).json(users);

    },

    async deleteUserAndAdmin (req, res) {
        if(!req.userId) return res.status(401).json({error : "User not authenticate"});
        const id = req.userId;

        const { userCpf, password } = req.body;
        if(!userCpf || !password) return res.status(400).json({error : "All the fields must be fulled"});

        const userAdmin = await User.findById(id).select('+password');
        if(!userAdmin || userAdmin === null || userAdmin === undefined) return res.status(400).json({error : "Failure to get logged user"});

        const user = await User.findOne({cpf : userCpf}).select('+password');
        if(!user || user === null || user === undefined) return res.status(400).json({error : "user not found"});

        bcrypt.compare(password, userAdmin.password, async (error, right) => {
            if(error) return res.status(500).json(error + {error: "Internal error"});
            if(right){
                const id = user.id;
                Admin.findOne({user_id : id}).then(admin => {
                    if(admin){
                        admin.deleteOne().catch(err => {
                            return res.status(500).json({error : "Failure to delete admin user"});
                        });
                    }
                }).catch(e => {
                    return res.status(500).json({error : "Failure to verify user data"});
                });

                await user.deleteOne().then(() => {
                    return res.status(200).json({text : "user deleted!"});
                }).catch(err => {
                    return res.status(500).json({error : "Failure to delete user"});
                });
            }
                return res.status(400).json({error : "incorrect password"});
        });
    },

    async sales (req, res) {
        const sales = await Sell.find();
        const users = await User.find();

        if(!sales) return res.status(204).json();
        const allData = [];

        users.forEach(user => {
            const dataSales = [];
            sales.forEach(sell => {
                if(sell.user_id === user.id){
                    dataSales.push(sell);
                }
            });

            allData.push([user, dataSales]);
        });

        return res.status(200).json(allData);
    }
}