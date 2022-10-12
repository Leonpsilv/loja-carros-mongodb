const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('../services/multer');

const userController = require('../controllers/loggedUserController');
const carController = require('../controllers/carController');
const sellController = require('../controllers/sellController');

router.get('/', (req, res) => {
    res.send('Hello user');
});

router.put('/editar', userController.edit); // edit user
router.get('/minha-conta', userController.one); // logged user
router.post('/avatar', multer(multerConfig).single('file'), userController.avatar); // avatar image
router.post('/vender/:chassis', sellController.store); // add new sell/reservation
router.put('/vender/:chassis', sellController.reservedToSale); // change a reservation for sale
router.get('/minhas-vendas', sellController.userSales); // view sales

router.get('/carros', carController.all); // get all cars
router.get('/carros/:chassis', carController.one); // get one car

module.exports = router;