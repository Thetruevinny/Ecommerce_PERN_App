const express = require('express');
const router = express.Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Endpoint to create a Stripe checkout session
router.post('/', async (req, res) => {
    const { cart, quantities } = req.body;
    try {
        const lineItems = cart.map((product) => ({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: product.name,
                },
                unit_amount: product.price * 100, // Stripe accepts prices in pennies
            },
            quantity: quantities[product.name],
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/',
            metadata: {
                userId: req.user.id,
                cart: JSON.stringify(cart),
                quantities: JSON.stringify(quantities),
            }
        });

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;