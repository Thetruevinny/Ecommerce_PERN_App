const { text, query } = require('express');
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
const registerUser = async (email, password) => {
    query = {
        text: "INSERT INTO users (email, password, admin) VALUES ($1, $2, false) ",
        values: [email, password]
    }

    await pool.query(query);
    return;
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

// Checking if user is already registered wtih oauth route
const oauthRegisterCheck = async (profile) => {
    const email = profile.emails[0].value;
    try {
        const query = {
            text: 'SELECT email FROM users WHERE email= ($1);',
            values: [ email ]
        };
        const {rows} = await pool.query(query);
        const user = rows[0];
        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (err) {

    }
};

// Creating an order
const createOrder = async (userId, cart, quantities) => {
    const total = cart.reduce((acc, product) => {
        return (acc += quantities[product.name] * product.price);
    }, 0);
    try {
        query = {
            text: 'INSERT INTO orders(user_id, total) VALUES ($1, $2) RETURNING id;',
            values: [userId, total]
        }
        const {rows} = await pool.query(query);
        const id  = rows[0].id;
        return id;
    } catch (err) {
        console.log(err);
    }
};

// Changing product quantities after an order
const changeProductQty = async (cart, quantities) => {
    try {
        const productsArray = cart.map(product => {
            return `(${product.id}, ${quantities[product.name]})`;
        });
        const productsString = productsArray.join(',');
        await pool.query(`UPDATE products AS p SET quantity = p.quantity - p2.quantity FROM (VALUES ${productsString}) AS p2(id, quantity) WHERE p2.id = p.id;`);
    } catch (err) {
        console.log(err);
    }
}

// Create new rows in orders_products for each new order
const createOrderProduct = async (id, cart, quantities) => {
    const stringArray = [];
    const ordersArray = [];
    cart.forEach(product => {
        ordersArray.push(id, product.id, quantities[product.name]);
    });
    for (let i = 0; i < ordersArray.length; i++) {
        if ((i + 1) % 3 === 0) {
            stringArray.push(`($${i-1}, $${i}, $${i+1})`);
        }
    };

    const orderString = stringArray.join(',');
    const orderQuery = {
        text: 'INSERT INTO orders_products(order_id, product_id, quantity) VALUES ' + orderString,
        values: ordersArray
    };

    try {
        await pool.query(orderQuery);
    } catch (err) {
        console.log(err);
    }
};

// Deleting product
const deleteProduct = (id) => pool.query({
    text: 'DELETE FROM products WHERE id = $1',
    values: [id]
});

// Modifying a product
const modifyProduct = (id, price, quantity, description ) => {
    const val_array = [];
    let paramString = '';

    // Check to see what fields were filled in and update the relevant strings accordingly
    if (price !== '0') {
        paramString += 'price = ($1)';
        val_array.push(price);
    }
    if (quantity !== '0') {
        if (paramString) {
            paramString += ', quantity = (quantity + ($2))';
        } else {
            paramString += 'quantity = (quantity + ($1))';
        }
        
        val_array.push(quantity);
    }
    if (description !== 'Unchanged') {
        const numVal = val_array.length + 1;
        if (paramString) {
            paramString += `, description = $${numVal} `;
        } else {
            paramString += `description = $${numVal} `;
        }
        val_array.push(description);
    }
    // Check the length of the array to find the value for the final parameter
    const finalVal = val_array.length + 1;

    // Add id to the end of the value array
    val_array.push(id);

    query = {
        text: 'UPDATE products SET ' + paramString +  `WHERE id = $${finalVal}`,
        values: val_array,
    };

    return pool.query(query);
};

// Create new product
const createProduct = (name, price, category, quantity, description) => {
    query = {
        text: 'INSERT INTO products (name, price, category, quantity, description) VALUES ($1, $2, $3, $4, $5);',
        values: [name, price, category, quantity, description]
    };
    return pool.query(query);
}

// Change password
const changePassword = (id, newPassword) => {
    query = {
        text: "UPDATE users SET password = $1 WHERE id = $2;",
        values: [newPassword, id]
    }
    return pool.query(query);
}

const getOrders = (userId) => {
    const query = {
        text: 'SELECT orders.total, orders_products.quantity, products.name, products.price, orders.id FROM orders JOIN orders_products ON orders.id = orders_products.order_id JOIN products ON products.id = orders_products.product_id WHERE orders.user_id = $1;',
        values: [userId],
    }

    return pool.query(query);
};


module.exports = {
    getProducts,
    checkUserName,
    registerUser,
    getUserById,
    comparePasswords,
    getUserByEmail,
    oauthRegisterCheck,
    createOrder,
    changeProductQty,
    createOrderProduct,
    deleteProduct,
    modifyProduct,
    createProduct,
    changePassword,
    getOrders,
};