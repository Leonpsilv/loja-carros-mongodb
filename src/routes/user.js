const express = require('express');
const router = express.Router();
const userController = require('../controllers/loggedUserController');
const { loginValidate } = require('../middlewares/auth');

router.get('/', (req, res) => {
    res.send('Hello user');
});

router.put('/editar',loginValidate ,userController.edit);

module.exports = router;