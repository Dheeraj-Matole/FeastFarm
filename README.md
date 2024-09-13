# FeastFarm

## Introduction
The fresh Food Ordering Platform is a web application that allows users to browse food items, add them to a cart, and place orders. 
The platform is built using EJS(embedded JavaScript) for the frontend, MongoDB for the database, and Bootstrap for styling.

## Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dheeraj-Matole/FeastFarm.git
   cd FeastFarm
2. Install dependencies
   npm install

3. Start the server
  nodemon app.js

5. Access Application
  navigate to http://localhost:3000 in the browser
----------------------------------------------------------------

# Packages / Dependencies used
mongoose : Database connectivity
express : server 
ejs : embedded JavaScript for easier implementation of web pages
metho-override : override POST method for implementing PUT and DELETE. 
passport, passport-local, passport-local-mongoose: Swift implementation of Authentication 
connect-flash : Flash messages to notify users of their task
express-session : required of passport Auth. to keep track of logins and logouts.
Bootstrap: For designing and responsiveness of web pages.
-----------------------------------------------------------------
# Usage

1. Register an account:
Navigate to the registration page and create a new account.

2. Log in:
Use your credentials to log in to the platform.

3. Browse items:
Browse the available food items and add them to your cart.

5. Place an order:
Review your cart and proceed to checkout. You will receive an order confirmation with a tracking ID.
------------------------------------------------------------------
#Features

1. User registration and authentication
2. Browsing food items
3. Adding items to the cart
4. Viewing cart summary
5. Placing orders
6. Order confirmation with tracking ID
7. Order history
------------------------------------------------------------------
#Database Schema
Product
{
    name: { type: String, required: true },
    description: { type: String},
    image: {type:String},
    price: { type: Number, required: true },
    category: { type: String, required: true},
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: '66e34ce19cbe0cbdb56c4ff0'    // Admin id through mongodb
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}
----------
Review 
{
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}
----------
User : username and password through Passport.js(a package for authentication)
{
    email:{
        type: String,
        required: true,
        unique: true
    }
}
UserSchema.plugin(passportLocalMongoose);
------------
Cart:
{
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    total: {
        type: Number,
        required: true,
        default: 0
    }
}
---------

Order history:
{
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    trackingId: { type: String},
    createdAt: { type: Date, default: Date.now }
}


