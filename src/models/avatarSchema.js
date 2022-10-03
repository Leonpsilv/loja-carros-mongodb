const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Avatar = new Schema({
    user_id : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    size : {
        type : Number,
        required : true
    },
    key : {
        type : String,
        required: true
    },
    location : {
        type : String,
        required : false
    },
    date : {
        type : Date,
        default : Date.now()
    },
});

mongoose.model('avatars', Avatar);