const express = require('express');
const router = express.Router();
const userController = require('../controllers/loggedUserController');
const multer = require('multer');
const multerConfig = require('../services/multer');


router.get('/', (req, res) => {
    res.send('Hello user');
});

router.put('/editar', userController.edit); // edit user
router.get('/minha-conta', userController.one); // logged user
router.post('/avatar', multer(multerConfig).single('file'), userController.avatar); // avatar image

module.exports = router;