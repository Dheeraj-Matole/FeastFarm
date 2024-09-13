const express = require('express')
const router = express.Router();

const catchAsync = require('../utils/catchAsync.js')
const expressError = require('../utils/expressError.js')
const Product = require('../models/product.js');
const Cart = require('../models/cart')
const OrderHistory = require('../models/orderHistory.js')
const {isLoggedIn} = require('../middleware');
const orderHistory = require('../models/orderHistory.js');

router.get('/', async (req, res) => {
    const { userId } = req.query;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        res.render('cart/cart', { cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Server error');
    }
});

router.get('/successfull/:orderid', catchAsync(async (req,res) => {
    const orderHistory = await OrderHistory.findById(req.params.orderid).populate('items.productId')
    if(!orderHistory){
        req.flash('error', 'unavailable');
        return res.redirect('/products')
    }
    res.render('cart/successfull', {orderHistory})
}))

router.get('/order-history/:userId', catchAsync(async (req,res) => {
    const { userId } = req.params;
    const orders = await OrderHistory.find({userId}).populate('items.productId');
    console.log(orders)
    if(!orders){
        req.flash('error', 'unavailable');
        return res.redirect('/products')
    }
    res.render('cart/order-history', {orders})
}))

router.post('/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Validate the input
        if (!userId || !productId || !quantity) {
            return res.status(400).send('Missing required fields');
        }

        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Find the cart for the user
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], total: 0 });
        }

        // Check if the product already exists in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
        if (itemIndex > -1) {
            // Update the quantity and price if the product exists
            cart.items[itemIndex].quantity += parseInt(quantity);
            cart.items[itemIndex].price = product.price * cart.items[itemIndex].quantity;
        } else {
            // Add the new product to the cart
            cart.items.push({ productId, quantity: parseInt(quantity), price: product.price * parseInt(quantity) });
        }

        // Update the total price of the cart
        cart.total = cart.items.reduce((acc, item) => acc + item.price, 0);

        // Save the cart
        await cart.save();

        res.redirect('/products'); // Redirect to products page after adding to cart
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send('Server error');
    }
});

router.post('/remove', async (req, res) => {
    const { userId, productId } = req.body;
    console.log(req.body)

    try {
        // Find the cart for the user
        // const cart = await Cart.findOne({ userId }).populate('items.productId');
        let cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        // Find the index of the item to be removed
        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
        if (itemIndex > -1) {
            // Remove the item from the cart
            cart.items.splice(itemIndex, 1);

            // Update the total price of the cart
            cart.total = cart.items.reduce((acc, item) => acc + item.price, 0);

            // Save the cart
            await cart.save(); 

            res.redirect('/cart'); // Redirect to cart page after removing the item
        } else {
            res.status(404).send('Item not found in cart');
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).send('Server error');
    }
});

router.post('/checkout', async (req, res) => {
    const { userId } = req.body;

    try {
        // Find the cart for the user
        let cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        // Create a new order history entry
        const orderHistory = new OrderHistory({
            userId: cart.userId,
            items: cart.items,
            total: cart.total
        });

        // Save the order history
        await orderHistory.save();

        // Use the ObjectId as the tracking ID
        const trackingId = orderHistory._id;

        // Clear the cart
        cart.items = [];
        cart.total = 0;
        await cart.save();

        // Redirect to the confirmation page with the tracking ID
        res.redirect(`/cart/successfull/${orderHistory._id}`);
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).send('Server error');
    }
});

router.post('/order-history', async (req, res) => {
    const { userId } = req.body;

    try {
        // Fetch the order history for the user
        const orders = await OrderHistory.find({ userId }).populate('items.productId');
        if (!orders) {
            return res.status(404).send('No orders found for this user');
        }

        // Render the order history page with the fetched orders
        res.redirect(`/cart/order-history/${userId}`);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;