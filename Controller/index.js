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
const csurfMiddleware = csurf({
    cookie: {
      sameSite: "none"
    }
});

// Import Routers
const productsRouter = require('./Routes/productsRouter');


// Setting up various middleware
// Change Cors restrictions to match your desires.
app.use(cors({
    origin: 'http://localhost:3000'
}));
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

const PORT = process.env.PORT || 8000;

// Setting up routes
const apiRouter = express.Router();
app.use(apiRouter);
apiRouter.use('/api/products', productsRouter);

// Initialising Application
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});