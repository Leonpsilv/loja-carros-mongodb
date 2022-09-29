const express = require('express');
const router = express.Router();
const userController = require('../controllers/loggedUserController');


router.get('/', (req, res) => {
    res.send('Hello user');
});

router.put('/editar', userController.edit); // edit user
router.get('/minha-conta', userController.one); // logged user

module.exports = router;