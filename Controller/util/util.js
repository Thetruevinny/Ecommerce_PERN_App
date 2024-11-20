const { body, validationResult } = require('express-validator');

// Input validation checks below for using login / register credentials
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

// Handles validation output
const validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).redirect('http://localhost:3000/login');
    }
    next();
};

// Validation checks for both the create and modify products routes
const validationCheckCreate = () => {
    console.log('Point Reached');
    return [
        body('name').trim().notEmpty().blacklist('<>'),
        body('price').notEmpty().matches(/^\d+(\.\d{1,2})?$/),
        body('category').trim().notEmpty().blacklist('<>'),
        body('quantity').notEmpty().isInt(),
        body('description').trim().blacklist('<>'),
    ];
}

// Validation handlers for both the create and modify products routes.
const validationCheckModify = () => {
    return [
        body('price').notEmpty().matches(/^\d+(\.\d{1,2})?$/),
        body('quantity').notEmpty().isInt(),
        body('description').trim().blacklist('<>'),
    ];
}

const validationHandlerCreate = (req, res, next) => {
    console.log('Point Reached');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).redirect('http://localhost:3000/create');
    }
    next();
};

const validationHandlerModify = (req, res, next) => {
    const {id} = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).redirect(`http://localhost:3000/modify/${id}`);
    }
    next();
};

module.exports = {
    validationCheck,
    validationHandler,
    validationCheckCreate,
    validationCheckModify,
    validationHandlerCreate,
    validationHandlerModify,
}