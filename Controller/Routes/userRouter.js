const express = require('express');
const router = express.Router();
const {getUserById, comparePasswords, changePassword} = require('../../Model/queries');
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