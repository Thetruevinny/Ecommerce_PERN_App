const pool = require('./db');

const getProducts = () => pool.query("SELECT * FROM products;");

module.exports = {
    getProducts,
};