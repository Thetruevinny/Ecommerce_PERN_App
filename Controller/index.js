const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config({
    override: true,
    path: path.join(__dirname, '../.env')
});
const helmet = require('helmet');
const parser = require('cookie-parser');
const csurf = require('csurf');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {comparePasswords, getUserById, getUserByEmail} = require('../Model/queries');
const { validationCheck, validationHandler } = require('./util/util');
// Setting csurf middleware for csurftokens
const csurfMiddleware = csurf({
    cookie: true
});

// Import Routers
const productsRouter = require('./Routes/productsRouter');
const registerRouter = require('./Routes/registerRouter');

// Change Cors restrictions to match your desires.
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Setting up other middleware
app.use(parser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded());
app.use(session({
    secret: process.env.SECRET,
    cookie: {
        maxAge: 1000*60*60*12,
        secure: false,
        sameSite: 'lax'
    },
    resave: false,
    saveUninitialized: false
}));

// Setting up passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }

});

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async function (email, password, done) {
    try {
        const user = await getUserByEmail(email);
        const verified = await comparePasswords(password, user.password);
        if (!user) {
            return done(null, false);
        } else if (!verified) {
            return done(null, false);
        } else {
            return done(null, user);
        };  
    } catch (err) {
        return done(err);
    }
}));

const PORT = process.env.PORT || 8000;

// Setting up routes
const apiRouter = express.Router();
app.use(apiRouter);
apiRouter.use('/api/products', productsRouter);
apiRouter.get('/api/csrfToken', csurfMiddleware, (req, res) => {
    res.status(200).json({ csrfToken: req.csrfToken() });
});
apiRouter.use('/api/register', registerRouter);
apiRouter.post('/api/login', csurfMiddleware, validationCheck(), validationHandler, passport.authenticate('local', {failureRedirect: 'http://localhost:3000/login'}), (req,res) => {
    res.status(200).redirect('http://localhost:3000/');
});

// Initialising Application
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});