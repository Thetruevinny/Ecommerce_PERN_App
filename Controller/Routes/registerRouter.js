const express = require('express');
const router = express.Router();
const { checkUserName, registerUser } = require('../../Model/queries');
const bcrypt = require('bcrypt');
const {validationCheck, validationHandler} = require('../util/util');
require('dotenv').config();

// Registering user
router.post('/', validationCheck(), validationHandler, checkUserName, async (req, res) => {

    const { email, password } = req.body;

    // Check if user already exists
    if (req.exists) {
        res.status(400).json({error: 'User Already Exists. Please go back.'});
    } else {

        try {
            // Hashing password
            const salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));

            const hashedPassword = await bcrypt.hash(password, salt);

            await registerUser(email, hashedPassword);
            res.status(201).redirect('http://localhost:3000/login');

        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'There was an error from our side in processing your request. We are looking into it.'});
        }

    }

});

module.exports = router;