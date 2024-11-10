const express = require('express');
const router = express.Router();
const { oauthRegisterCheck, getUserByEmail, registerUser } = require('../../Model/queries');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:50423/api/oauth/google/callback", // Updated callback URL
    scope: ['email', 'profile'],
}, async (accessToken, refreshToken, profile, done) => {
    console.log("Access Token:", accessToken);
    console.log("Profile:", profile);
    try {
        console.log("point Reached");
        const result = await oauthRegisterCheck(profile);
        console.log(result);
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
    // done(null, profile); // Proceed to serializeUser
}));

// Initial request to Google OAuth
router.get('/google', passport.authenticate('google'));

// Callback route after Google OAuth
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/register',
    session: true, // Set to true if session persistence is needed
}), async (req, res) => {
    // Redirect to frontend after successful registration or login
    res.redirect('http://localhost:3000/'); 

});

module.exports = router;