const mongoose = require('mongoose');
require('../models/carSchema');
const Car = mongoose.model('cars');

require('../models/userSchema');
const User = mongoose.model('users');

require('../models/sellSchema');
const Sell = mongoose.model('sales');

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
        const { model, color, km } = req.body;

        if (!model || model.length < 2) { problems.push({problem: "model not informed"}); }
        if (!color || color.length < 2) { problems.push({problem: "color not informed"}); }

        if(problems.length !== 0) return res.status(400).json(problems);

        const car = await Car.findOne({chassis: [req.params.chassis.toString()]});
        if(!car || car === null) return res.status(400).json({error : "Car not found!"});
        if (parseInt(km) < parseInt(car.km)) return res.status(400).json({error : "km informed is less than the original"});
        if(km) { car.km = km }

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

        const chassis = req.params.chassis.toString();

        Car.findOne({chassis}).then(car => {
            if(!car || car === null) return res.status(400).json({error : "Car not found!"});

            car.deleteOne().then(() => {
                return res.status(204).json();
            }).catch(err => {
                return res.status(500).json({error : "Failure to delete car!"});
            });
        }).catch(err => {
            return res.status(500).json({error : "Failure to search car"});
        });
    },

    async all (req, res) {
        Car.find().then(cars => {
            if(!cars) return res.status(204).json();

            if (req.userId) {
                User.findOne({id : [req.userId]}).then(user => {
                    if (!user) return res.status(401).json({error : "invalid user!"});
                }).catch(err => {
                    return res.status(500).json({error : "Failure to verify user"});
                });
            }
            if (!req.userId){
                let carsPublic = [];
                cars.forEach(car => {
                    car.buy_price = undefined;
                    car.chassis = undefined;

                    carsPublic.push(car);
                });

                return res.status(200).json(carsPublic);
            } 
            
            return res.status(200).json(cars);
        }).catch(err => {
            return res.status(500).json({error : "Failure to search cars"});
        });


    },

    async one (req, res) {
        if(!req.params.chassis) return res.status(400).json({error : "No car informed"});

        const chassis = req.params.chassis.toString();

        if (req.userId) {
            User.findOne({id : [req.userId]}).then(user => {
                if (!user) return res.status(401).json({error : "invalid user!"});
            }).catch(err => {
                return res.status(500).json({error : "Failure to verify user"});
            });
        }
        Car.findOne({chassis}).then(car => {
            if(!car) return res.status(400).json({error : "Car not found"});
            if (!req.userId){
                car.buy_price = undefined;
                car.chassis = undefined;
                
                return res.status(200).json(car);
            } 
            
            return res.status(200).json(car);
        }).catch(err => {
            return res.status(500).json({error : "Failure to search car"});
        });
    },

    async filter (req, res) {
        const { filter } = req.body.toLowerCase();

        if (filter === 'disponiveis') {
            Car.find().then(async cars => {
                const sales = await Sell.find();
                if (!sales) return res.status(200).json(cars);

                const carSold = [];
                sales.forEach(sell => {
                    carSold.push(sell.car_chassis);
                });
                const availableCars = [];
                cars.forEach(car => {
                    if (carSold.indexOf(car.chassis) === -1) {
                        availableCars.push(car);
                    }
                });

                return res.status(200).json(availableCars);
            }).catch(err => {
                return res.status(500).json({error :  "Failure to search cars"});
            });
        }

        if (filter === 'reservados') {
            Sell.find({reserved : true, sold : false}).then(sales => {

            }).catch(err => {
                return res.status(500).json({error :  "Failure to search cars"});
            });
        }

        if (filter === 'vendidos') {
            Sell.find({sold : true}).then(sales => {
                
            }).catch(err => {
                return res.status(500).json({error :  "Failure to search cars"});
            });
        }

        return res.status(400).json({error : "Select an valid category"});

    }
}