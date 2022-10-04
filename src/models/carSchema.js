const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// marca, modelo, ano, km, cor, chassi e preço de compra
const Car = new Schema ({
    brand : {
        type : String,
        required : true,
        lowercase : true
    },
    model : {
        type : String,
        required : true,
        lowercase : true
    },
    chassis : {
        type : Number,
        required: true,
        unique : true
    },
    year : {
        type : String,
        required : true
    },
    km : {
        type : String,
        required : true
    },
    color : {
        type : String,
        required : false
    },
    buy_price : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        default : Date.now()
    },
});

mongoose.model('cars', Car);