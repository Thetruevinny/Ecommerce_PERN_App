const express = require('express');
const router = express.Router();
const { oauthRegisterCheck, getUserByEmail, registerUser } = require('../../Model/queries');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
require('dotenv').config();

// Configuring a new google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:50423/api/oauth/google/callback",
    scope: ['email', 'profile'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const result = await oauthRegisterCheck(profile);
        if (result) {
            const user = await getUserByEmail(profile.emails[0].value);
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        } else {
            const salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));
            const hashedPassword = await bcrypt.hash(profile.id + profile.name.familyName, salt);
            await registerUser(profile.emails[0].value, hashedPassword);
            const user = await getUserByEmail(profile.emails[0].value);
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        }
    } catch (err) {
        done(null, false);
    }
}));

// Initial request to Google OAuth
router.get('/google', passport.authenticate('google'));

// Callback route after Google OAuth
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/register',
    session: true, 
}), async (req, res) => {
    // Redirect to homepage after successful registration
    res.redirect('http://localhost:3000/'); 

});

module.exports = router;