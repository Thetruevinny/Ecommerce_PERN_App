const pool = require('./db');
const bcrypt = require('bcrypt');

// Retrieve all products with a SQL query
const getProducts = () => pool.query("SELECT * FROM products;");

// Checking if email already exists
const checkUserName = async (req, res, next) => {
    const {email, password} = req.body; 
    try {
        const query = {
            text: 'SELECT email FROM users WHERE email= ($1);',
            values: [ email ]
        };
        const {rows} = await pool.query(query);
        const user = rows[0];
        if (user) {
            req.exists = true;
            req.email = user.email;
            req.password = password;
        } else {
            req.exists = false;
        }
        next();
    } catch (err) {
        console.log(err);
    }
};

// Adding user to db.
const registerUser = async (res, email, password) => {
    query = {
        text: "INSERT INTO users (email, password, admin) VALUES ($1, $2, false) ",
        values: [email, password]
    }

    await pool.query(query);
    res.status(201).redirect('http://localhost:3000/login');
};

// Get a User by Id
const getUserById = async (id) => {
    try {
        const query = {
            text: 'SELECT * FROM users WHERE id=($1)',
            values: [id]
        };
        const {rows} = await pool.query(query);
        const user = rows[0];
        return user;
    } catch (err) {
        console.log(err)
        return err;
    };
};

// Get a User by Email
const getUserByEmail = async (email) => {
    try {
        const query = {
            text: 'SELECT * FROM users WHERE email=($1)',
            values: [email]
        };
        const {rows} = await pool.query(query);
        const user = rows[0];
        return user;
    } catch (err) {
        console.log(err)
        return err;
    };
};

// Set up helper function for using bcrypt to compare passwords
const comparePasswords = async (password, hash) => {
    
    try {
        const matches = await bcrypt.compare(password, hash);
        return matches;
    } catch (err) {
        console.log(err);
    }

    return false;
}


module.exports = {
    getProducts,
    checkUserName,
    registerUser,
    getUserById,
    comparePasswords,
    getUserByEmail,
};