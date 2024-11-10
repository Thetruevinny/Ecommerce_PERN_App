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
const oauthRouter = require('./Routes/oauthRouter');

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
    resave: true,
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

// Passport Strategies
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
// Route for Products
apiRouter.use('/api/products', productsRouter);
// Route for Oauth
apiRouter.use('/api/oauth', oauthRouter);
// Obtaining CSRF token
apiRouter.get('/api/csrfToken', csurfMiddleware, (req, res) => {
    res.status(200).json({ csrfToken: req.csrfToken() });
});
// Route for Registering
apiRouter.use('/api/register', registerRouter);
// Route for Login
apiRouter.post('/api/login', csurfMiddleware, validationCheck(), validationHandler, passport.authenticate('local', {failureRedirect: 'http://localhost:3000/login'}), (req,res) => {
    res.status(200).redirect('http://localhost:3000/');
});
// Route for checking user is authenticated.
apiRouter.get('/api/check', (req, res) => {
    console.log(req.isAuthenticated());
    if (req.user) {
        res.send({result: true});
    } else {
        res.send({result: false})
    }
});

// Initialising Application
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});