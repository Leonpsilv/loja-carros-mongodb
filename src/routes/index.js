const express = require('express');
const router = express.Router();

const publicController = require('../controllers/publicController');

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/login', publicController.login);
router.get('/usuarios', publicController.all);



// With login
const user = require('./user');
router.use('/usuario', user);

// Admin routes
const admin = require('./admin');
router.use('/admin', admin);

module.exports = router;