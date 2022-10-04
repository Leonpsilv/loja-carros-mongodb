const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminUserController');
const carController = require('../controllers/carController');

router.get('/', (req, res) => {
    res.send('Hello user');
});

router.post('/cadastrar', adminController.storeUser); // new user
router.post('/cadastrar/admin', adminController.storeAdmin); // add user to admin list
router.get('/administradores', adminController.allAdmins); // list all admin users
router.get('/usuarios', adminController.allUsers); // list all users
router.delete('/deletar/usuario', adminController.deleteUserAndAdmin); // delete user

router.post('/carros/cadastrar', carController.store); // add new car
router.delete('/carros/deletar/:chassis', carController.delete); // remove an car
router.put('/carros/editar/:chassis', carController.edit); // edit an car

module.exports = router;