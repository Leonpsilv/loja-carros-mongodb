const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminUserController');
const { adminValidate } = require('../middlewares/auth');

router.get('/', (req, res) => {
    res.send('Hello user');
});

router.post('/cadastrar', adminController.storeUser); // new user
router.post('/cadastrar/admin', adminController.storeAdmin); // add user to admin list
router.get('/administradores', adminController.allAdmins); // list all admin users
router.get('/usuarios', adminController.allUsers); // list all users
router.delete('/deletar/usuario', adminValidate, adminController.deleteUserAndAdmin); // delete user

module.exports = router;