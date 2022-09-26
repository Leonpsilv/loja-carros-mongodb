const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminUserController');

router.get('/', (req, res) => {
    res.send('Hello user');
});

router.post('/cadastrar', adminController.storeUser); // new user
router.post('/cadastrar/admin', adminController.storeAdmin); // add user to admin list
router.get('/administradores', adminController.all);

module.exports = router;