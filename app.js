const express = require ('express');    // requires express IMP 
const app = express();                  // variable app set to express
const path = require('path')            // requireing path for easy rendering of ejs files1
const ejsMate = require('ejs-mate')     // used for layout ie boilerPlate
const catchAsync = require('./utils/catchAsync.js')
const expressError = require('./utils/expressError.js')
const methodOverride = require('method-override');
const Product = require('./models/product.js');
const Review = require('./models/review.js');
const passport = require('passport');   
const localStrategy = require('passport-local');
const User = require('./models/user.js');
const session = require('express-session')
const flash = require('connect-flash')

const productRoutes = require('./routes/products.js')
const reviewRoutes = require('./routes/reviews.js')
const userRoutes = require('./routes/users.js')
const cartRoutes = require('./routes/carts.js')

const mongoose = require ('mongoose')   // requires mongoose where ever connecion to DB id needed
mongoose.connect('mongodb://127.0.0.1:27017/Feast-Farm');
const db = mongoose.connection;
db.on("error", console.error.bind(console,'Connection error:'));
db.once("open", () => {
    console.log("DB connected")
})

app.engine('ejs', ejsMate);                         //parsing ejs
app.set('view engine', 'ejs')                       // setting the view engine 
app.set('views', path.join(__dirname, 'views'))     // default path to look for ejs files

app.use(express.urlencoded({ extended:true}))       // for parsing the body in req.body
app.use(methodOverride('_method'));                 // to override the post and get ( access put,delete)

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge :1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) => {                          // this should always be placed after the passport and session intializations
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.get('/fake', async(req, res)=>{
    const user = new User({email:'abx@gmail.com', username: 'dm'});
    const newUser = await User.register(user, 'matole');
    res.send(newUser);
})

app.use('/', userRoutes)
app.use('/products', productRoutes)
app.use('/products/:id/reviews', reviewRoutes)
app.use('/cart', cartRoutes);
//Rendering the home page

app.get('/', (req,res) => {
    res.render('home')
})

app.all('*', (req,res,next) => {        // Handling unrecognizable urls
    next(new expressError('Page not found', 404)) 
})
app.use((err, req, res,next)=> {        //Error handling
    const {statusCode=500, message='Something went wrong'} = err;
    res.status(statusCode);
    res.render('error', {err})   
})

//serving on localhost
app.listen(3000, () => {
    console.log('serving on port 3000')
})