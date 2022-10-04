const express = require('express');
const router = express.Router();
const { loginValidate, adminValidate } = require('../middlewares/auth');

const publicController = require('../controllers/publicController');
const carController = require('../controllers/carController');

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/login', publicController.login); // login
router.get('/carros', carController.all); // all cars
router.get('/carros/:chassis', carController.one); // one specify car


// With login
const user = require('./user');
router.use('/usuario', loginValidate, user);

// Admin routes
const admin = require('./admin');
router.use('/admin', loginValidate, adminValidate, admin);

module.exports = router;