const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.send({result: false});
    }
});

router.get('/auth', (req, res) => {
    res.send({result: true});
});

router.get('/admin', (req, res) => {
    if (req.user.admin) {
            res.send({result: true});
    } else {
            res.send({result: false});
    }
});

module.exports = router;