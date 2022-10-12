const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Sell = new Schema({
    user_id : {
        type : String,
        required : true
    },
    car_chassis: {
        type : String,
        required : true
    },
    sold : {
        type : Boolean,
        required : true
    },
    reserved : {
        type : Boolean,
        required : true
    },
    sell_price : {
        type : String
    },
    client_cpf : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    },
});

mongoose.model('sales', Sell);