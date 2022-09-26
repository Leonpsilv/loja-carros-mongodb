const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).catch(err => {
    console.error('Failure to connect to DB');
});


// Routes
const routes = require('./routes');
app.use(routes);

app.listen(process.env.PORT, () => {
    console.log('server running...')
});