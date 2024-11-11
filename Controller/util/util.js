const { body, validationResult } = require('express-validator');

// Input validation checks below:
const validationCheck = () => {
    return [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage("Invalid Email")
            .exists(),
        body('password')
            .isLength({ min: 5})
            .withMessage("Length of password must exceed 5.")
            .matches(/\d/)
            .withMessage("Must Contain a Number")
            .exists(),
    ];
}

const validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).redirect('http://localhost:3000/register');
    }
    next();
};

module.exports = {
    validationCheck,
    validationHandler,
}