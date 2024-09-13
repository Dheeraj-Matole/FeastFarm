const express = require('express')
const router = express.Router({mergeParams:true});

const catchAsync = require('../utils/catchAsync.js')
const expressError = require('../utils/expressError.js')
const Review = require('../models/review.js')
const Product = require('../models/product.js');
const {isLoggedIn} = require('../middleware.js')

router.post('/', isLoggedIn,catchAsync(async (req,res) => {
    const prod = await Product.findById(req.params.id);
    const rev = new Review(req.body.review);
    rev.author = req.user._id;
    prod.reviews.push(rev);
    await rev.save();
    await prod.save();
    req.flash('success', 'Thanks for reviewing!')
    res.redirect(`/products/${prod._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req,res) => {
    const {id, reviewId} = req.params;
    await Product.findByIdAndUpdate(id, {$pull: {reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review Deleted')
    res.redirect(`/products/${id}`)
}))

module.exports = router;