const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const passport = require('passport');

const { jwtAuthentication } = require('./config/passport');
const app = express();

mongoose.connect('mongodb+srv://GeekDev:Lgeek1995@cluster0-tt0ot.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(passport.initialize());
app.use(express.json());
app.use(routes);

passport.use(jwtAuthentication);

app.listen(3333);