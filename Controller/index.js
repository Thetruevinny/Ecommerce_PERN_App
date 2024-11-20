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
const { comparePasswords, getUserById, getUserByEmail, createOrder, changeProductQty, createOrderProduct} = require('../Model/queries');
const { validationCheck, validationHandler } = require('./util/util');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Import Routers
const productsRouter = require('./Routes/productsRouter');
const registerRouter = require('./Routes/registerRouter');
const oauthRouter = require('./Routes/oauthRouter');
const checkoutRouter = require('./Routes/checkoutRouter');
const checkRouter = require('./Routes/checkRouter');

// Change Cors restrictions to match your desires.
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Setting up other middleware
app.use(parser());
app.use(helmet());

// Setting csurf middleware for csurftokens
const csurfMiddleware = csurf({
    cookie: true
});

// For all endpoinnts other than stripe webhook
app.use('/api', express.json());
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

// Passport Local Strategy for non-oauth route
passport.use(
    new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, 
        async function (email, password, done) {
            console.log(email);
            console.log(password);
            try {
                const user = await getUserByEmail(email);
                console.log(user);
                if (!user) return done(null, false);
                const verified = await comparePasswords(password, user.password);
                if (!verified) {
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
apiRouter.post(
    '/api/login', 
    csurfMiddleware, 
    validationCheck(), 
    validationHandler, 
    passport.authenticate('local', {failureRedirect: 'http://localhost:3000/login'}), 
    (req,res) => {
    res.status(200).redirect('http://localhost:3000/');
});
// Route for checking user is authenticated/admin.
apiRouter.use('/api/check', checkRouter);

// Route for Checkout using stripe
apiRouter.use('/api/create-checkout-session', checkoutRouter);

// Webhook Endpoint from stripe
apiRouter.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const cart = JSON.parse(session.metadata.cart);
            const quantities = JSON.parse(session.metadata.quantities);
            const userId = JSON.parse(session.metadata.userId);

            // Handle your order fulfillment, e.g., save to database, update inventory, etc.
            const id = await createOrder(userId, cart, quantities);
            await changeProductQty(cart, quantities);
            await createOrderProduct(id, cart, quantities);
        }

        res.status(200).send('Received');
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

// Handle Logout
apiRouter.post('/api/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.sendStatus(500);
        res.status(200).json({ message: 'Logged out' });
    });
});

// Initialising Application
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});