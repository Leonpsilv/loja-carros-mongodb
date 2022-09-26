const express = require('express');
const router = express.Router();
const userController = require('../controllers/loggedUserController');

router.get('/', (req, res) => {
    res.send('Hello user');
});

router.put('/edit', userController.edit);

module.exports = router;