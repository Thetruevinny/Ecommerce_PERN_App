const express = require('express');
const router = express.Router();
const { getProducts, deleteProduct } = require('../../Model/queries');

// Retrieve all products from db
router.get('/', async (req, res) => {
    try {
        const { rows } = await getProducts();
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Allowing deletion of a product reqiures admin user's to be logged in first
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await deleteProduct(id);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;