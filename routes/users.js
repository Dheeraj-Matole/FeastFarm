const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js')
const User = require('../models/user.js')
const passport = require('passport')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async(req,res, next)=>{
    const {email, username, password} = req.body;
    const user = new User({email,username});
    const regUser = await User.register(user, password)
    req.login(regUser,err => {
        if(err) return next(err);
        req.flash('success','Welcome to FeastFarm')
        res.redirect('/products')
    })
    // res.redirect('/login');
}))

router.get('/login', (req,res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), (req,res) => {
    console.log('user in login',req.user)
    res.redirect('/products')
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/products');
    });
}); 
module.exports = router;