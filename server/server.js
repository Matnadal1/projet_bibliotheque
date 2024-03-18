const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
const cron = require('node-cron');
const envoyerMail = require('./controllers/emailSender'); // Le chemin vers votre fichier emailSender.js
const suppReserve = require('./config/checkReservation');
const app = express();

//------------ Passport Configuration ------------//
require('./config/passport')(passport);

//------------ DB Configuration ------------//
const db = require('./config/key').MongoURI;

//------------ Mongo Connection ------------//
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.log(err));

//------------ EJS Configuration ------------//
app.use(expressLayouts);
app.use("/assets", express.static('../client/assets'));
app.set('view engine', 'ejs');
app.set('views', path.join('../client', 'views'));
//------------ Bodyparser Configuration ------------//
app.use(express.urlencoded({ extended: false }));

//------------ Express session Configuration ------------//
app.use(
    session({
        secret: process.env.SECRET_KEY_COOKIE,
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 3600000 }
    })
);

//------------ Passport Middlewares ------------//
app.use(passport.initialize());
app.use(passport.session());

//------------ Connecting flash ------------//
app.use(flash());

//------------ Global variables ------------//
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//------------ Envoi email rappel + annulation reservation ------------//
cron.schedule('00 10 * * *', () => {
    envoyerMail();
    suppReserve.suppReserve();
});

//------------ Routes ------------//
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/infosLivreRoute'));
app.use('/', require('./routes/compte'));
app.use('/', require('./routes/creerPretRoute'));
app.use('/', require('./routes/ajouterRoute'));
app.use('/', require('./routes/routesAPI'));
app.use('/', require('./routes/gererPretRoute'));


const PORT = process.env.PORT || 3006;

app.listen(PORT, console.log(`Server running on PORT ${PORT}`));