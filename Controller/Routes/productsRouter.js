const express = require('express');
const router = express.Router();
const { getProducts } = require('../../Model/queries');

router.get('/', async (req, res) => {
    try {
        const { rows } = await getProducts();
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;