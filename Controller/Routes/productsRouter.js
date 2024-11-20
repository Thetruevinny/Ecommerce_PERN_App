const express = require('express');
const router = express.Router();
const { getProducts, deleteProduct, modifyProduct, createProduct } = require('../../Model/queries');
const {validationHandlerCreate, validationHandlerModify, validationCheckCreate, validationCheckModify} = require('../util/util');
const csurf = require('csurf');
const csurfMiddleware = csurf({cookie: true});

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

// There is no need ot validation check these routes as admin would only have access to these pages.

router.post('/modify/:id', csurfMiddleware, validationCheckModify(), validationHandlerModify, async (req, res) => {
    const id = req.params.id;
    const { price, quantity, description } = req.body;
    try {
        const response = await modifyProduct(id, price, quantity, description);
        res.status(201).redirect('http://localhost:3000/');

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Creating a new product
router.post('/create',  csurfMiddleware, validationCheckCreate(), validationHandlerCreate, async (req, res) => {
    const { name, price, category, quantity, description } = req.body;
    try {
        await createProduct(name, price, category, quantity, description);
        res.status(200).redirect('http://localhost:3000/');
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