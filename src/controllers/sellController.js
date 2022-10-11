const mongoose = require('mongoose');
require('../models/sellSchema');
require('../models/carSchema');
require('../models/userSchema');
const Sell = mongoose.model('sales');
const Car = mongoose.model('cars');
const User = mongoose.model('users');

module.exports = {
    async store (req, res) {
        if (!req.userId) return res.status(401).json({error : "User not authenticate!"});
        const user_id = req.userId;
        
        const { sold, reserved, sell_price, client_cpf } = req.body; 
        
        if (!sold && !reserved) return res.status(400).json({error : "An operation must be chosen"});
        if(!sell_price && sold) return res.status(400).json({error : "the sell price is not defined!"});
        if(!client_cpf || client_cpf.length < 11) return res.status(400).json({error : "invalid cpf!"});
        
        const { chassis } = req.params;
        const car = await Car.findOne({chassis});
        if(!car) return res.status(400).json({error : "Car not found!"});
        
        const sell = await Sell.findOne({car_chassis : chassis});
        if(sell && sell !== null) {
            sell.sold = sold;
            sell.sell_price = sell_price;

            sell.save().then(sell => {
                return res.status(200).json(sell);
            }).catch(err => {
                return res.status(500).json({error : "Failure to save sell"});
            });
        }
        
        const newSell = {
            user_id,
            car_chassis : chassis,
            sold,
            reserved,
            sell_price,
            client_cpf
        }

        Sell.create(newSell).then(sell => {
            return res.status(200).json(sell);
        }).catch(err => {
            return res.status(500).json({error : "Failure to save sell"});
        });
    },

    async userSales (req, res) {
        if (!req.userId) return res.status(401).json({error : "User not authenticate"});
        const id = req.userId;

        const user = await User.findById(id);
        if(!user || user === null) return res.status(400).json({error : "User not found"});

        Sell.find({user_id: id}).then(sales => {
            if(!sales) return res.status(204).json();
            
            return res.status(200).json(sales);
        }).catch(err => {
            return res.status(500).json({error : "Failure to get sales!"});
        });
        
    }
}