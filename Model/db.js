const { Pool } = require('pg');
require('dotenv').config();

// Creating a new query pool for pg db.
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DBPORT
});

module.exports = pool;