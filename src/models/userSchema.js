const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// cpf, nome, email, avatar, biografia, senha.
const User = new Schema ({
    name : {
        type : String,
        required : true
    },
    cpf : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    biography : {
        type : String,
        required : false
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    date : {
        type : Date,
        default : Date.now()
    },
});

mongoose.model('users', User);