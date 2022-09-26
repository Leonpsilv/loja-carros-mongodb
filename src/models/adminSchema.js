const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Admin = new Schema({
    user_id : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    },
});

mongoose.model('admins', Admin);