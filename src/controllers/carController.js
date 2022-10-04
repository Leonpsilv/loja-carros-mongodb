const mongoose = require('mongoose');
require('../models/carSchema');
const Car = mongoose.mondel('cars');
// marca, modelo, ano, km, cor, chassi e preço de compra

module.exports = {
    async store (req, res) { 
        let problems = [];
        const { brand, model, year, km, color, chassis, buy_price } = req.body;

        if (!brand || brand.length < 2) { problems.push({problem: "invalid brand!"}); }
        if (!model || model.length < 2) { problems.push({problem: "invalid model!"}); }
        if (!year || year.length < 2)   { problems.push({problem: "invalid year!"}); }
        if (!km)                        { problems.push({problem: "invalid km!"}); }
        if (!color || color.length < 2) { problems.push({problem: "invalid color!"}); }
        if (!chassis || chassis.length < 2)     { problems.push({problem: "invalid chassis!"}); }
        if (!buy_price || buy_price.length < 2) { problems.push({problem: "invalid buy_price!"}); }

        if(problems.length !== 0) return res.status(400).json(problems);

        const newCar = {
            brand,
            model,
            year,
            km,
            color,
            chassis,
            buy_price
        }
        Car.create(newCar).then(car => {
            return res.status(201).json(car);
        }).catch(err => {
            return res.status(500).json({error : "Failure to create car!"});
        });
    },

    async edit (req, res) {
        if(!req.params.chassis) return res.status(400).json({error: "No car informed"});

        let problems = [];
        const { model, color } = req.body;

        if (!model || model.length < 2) { problems.push({problem: "invalid model!"}); }
        if (!color || color.length < 2) { problems.push({problem: "invalid color!"}); }

        if(problems.length !== 0) return res.status(400).json(problems);

        const car = await Car.findOne({chassis: [req.params.chassis]});
        if(!car || car === null) return res.status(400).json({error : "Car not found!"});

        car.model =  model;
        car.color = color;

        car.save().then(car => {
            return res.status(200).json(car);
        }).catch(err => {
            return res.status(500).json({error : "Failure to edit car!"});
        });
    },

    async delete (req, res) {
        if(!req.params.chassis) return res.status(400).json({error: "No car informed"});

        Car.findOne({chassis: [req.params.chassis]}).then(car => {
            if(!car || car === null) return res.status(400).json({error : "Car not found!"});

            car.deleteOne().then(() => {
                return res.status(204).json();
            }).catch(err => {
                return res.status(500).json({error : "Failure to delete car!"});
            });
        }).catch(err => {
            return res.status(500).json({error : "Failure to search car"});
        });
    }
}