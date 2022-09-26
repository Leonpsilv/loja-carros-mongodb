const mongoose = require('mongoose');
require('../models/userSchema');
const User = mongoose.model('users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_KEY, JWT_EXPIRES } = process.env;

module.exports = {
    async edit (req, res) {
        
    }
}