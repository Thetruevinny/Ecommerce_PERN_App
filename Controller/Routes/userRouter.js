const express = require('express');
const router = express.Router();
const {getUserById, comparePasswords, changePassword, getOrders} = require('../../Model/queries');
const bcrypt = require('bcrypt');
require('dotenv').config();

router.get('/id', (req, res) => {
    const id = req.user.id;
    if (id) {
        res.status(200).send({'id': id});
    } else {
        res.status(500).send({error: 'Id not found.'});
    }
});

router.get('/orders/:id', async (req, res) => {
    const userId = req.params.id;
    const idCheck = new Set();
    const orders = {};
    try {
        const {rows} = await getOrders(userId);
        rows.forEach(orderItem => {
            const orderId = orderItem.id
            if (idCheck.has(orderId)) {
                orders[orderId].products.push({name: orderItem.name, quantity: orderItem.quantity, price: orderItem.price});
            } else {
                
                idCheck.add(orderId);
                orders[orderId] = {};

                orders[orderId]['products'] = [{name: orderItem.name, quantity: orderItem.quantity, price: orderItem.price}];
            }
            if (!Object.keys(orders[orderId]).includes('total')) {
                orders[orderId]['total'] = orderItem.total;
            }
        });
        res.status(200).send({data: orders});
    } catch (err) {
        console.log(err);
        res.status(500).send({'Error': 'There was a server error when trying to retrieve your orders. We will look into this issue. Please try again later.'})
    }
    
});

router.post('/changePassword/:id', async (req, res) => {
    const id = req.params.id;
    const {oldPassword, newPassword, newPasswordCheck} = req.body;
    console.log(id);
    const user = await getUserById(Number(id));
    res.set('X-Redirect-To', 'http://localhost:3000/user');
    if (user) {
        // Checking password matches with database
        const verified = await comparePasswords(oldPassword, user.password);
        if (verified) {
            if (newPassword === newPasswordCheck) {
                // Hashing password and updating user table
                const salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                await changePassword(id, hashedPassword);
                res.status(200).send({'success': 'Password Changed.'});
            } else {
                res.status(500).send({'Error': 'It seems the two new passwords you entered did not match.'});
            }

        } else {
            res.status(500).send({'Error': 'It seems the current password you entered did not match the one stored on our system.'});
        }
    } else {
        res.status(500).send({'Error': 'It seems we can not retrieve your user information at this time.'});
    }
});


module.exports = router;