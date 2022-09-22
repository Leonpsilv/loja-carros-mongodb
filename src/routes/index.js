const express = require('express');
const router = express.Router();

const publicController = require('../controllers/publicController');

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/cadastrar', publicController.store);

// With login
const user = require('./user');
router.use('/user', user);

module.exports = router;