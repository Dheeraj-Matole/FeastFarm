const express = require('express')
const router = express.Router();

const catchAsync = require('../utils/catchAsync.js')
const expressError = require('../utils/expressError.js')
const Product = require('../models/product.js');
const {isLoggedIn} = require('../middleware');

router.get('/', catchAsync(async (req,res)=>{
    // const prod1 = new Product({name:"Apples", price:200, category:"fruit"})
    // await prod1.save();
    const products = await Product.find({});
    res.render('products/index.ejs', {products})
}))

router.get('/fruit', catchAsync(async (req,res) => {
    const products = await Product.find({category:"fruit"});
    res.render('products/fruit.ejs', {products})
}))

router.get('/dairy', catchAsync(async (req,res) => {
    const products = await Product.find({category:"dairy"});
    res.render('products/dairy.ejs', {products})
}))

router.get('/vegetables', catchAsync(async (req,res) => {
    const products = await Product.find({category:"veg"});
    res.render('products/vegetables.ejs', {products})
}))

router.get('/nonveg', catchAsync(async (req,res) => {
    const products = await Product.find({category:"nonVeg"});
    res.render('products/nonveg.ejs', {products})
}))

router.get('/new',isLoggedIn,(req,res) => {
    res.render('products/new')
})

router.post('/', catchAsync(async (req,res) => {
    const prod = new Product(req.body.product);
    await prod.save();
    req.flash('success', 'Successfully added a new product')   
    res.redirect(`products/${prod.category}`)
}))

router.get('/:id', catchAsync(async (req,res) => {
    const prod = await Product.findById(req.params.id).populate('reviews')
    if(!prod){
        req.flash('error', 'unavailable');
        return res.redirect('/products')
    }
    res.render('products/show', {prod})
}))

router.get('/:id/edit', catchAsync(async (req,res) => {
    const prod = await Product.findById(req.params.id)
    res.render('products/edit', {prod})
}))

router.put('/:id', catchAsync(async (req,res) => {
    const {id} = req.params;
    const prod =  await Product.findByIdAndUpdate(id,{...req.body.product})
    req.flash('success', 'Successfully updated')
    res.redirect(`/products/${prod._id}`)
}))

router.delete('/:id', async (req,res) => {
    const {id} = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted')
    res.redirect('/products');
})

module.exports = router;