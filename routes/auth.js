const express = require('express');
const {check, body} = require('express-validator');

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPasword);

router.post('/login', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email address'
    )
    .normalizeEmail(),

    body('password')
    .isLength({min: 5})
    .withMessage('Password has to be valid.')
    .isAlphanumeric()
    .trim()
], authController.postLogin);

router.post('/signup',[ 
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, {req}) => {
        // if(value === 'test@test.com'){
        //     throw new Error('This email address if forbidden.')
        // }
        // return true;
        return User.findOne({ email: value })
            .then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email exists already, please pick a diffrent one.');
            }
        });
    })
    .normalizeEmail(),
    body('password')
        .isLength({min: 5})
        .withMessage('Please enter a password with only number and text at least 5 charhacters.')
        .isAlphanumeric()
        .trim(),

    body('confirmPassword').trim().custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Password have to match');
        }
        return true;
    })
],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);


module.exports = router;