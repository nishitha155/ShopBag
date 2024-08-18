
const express = require('express');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./database/db');
const User = require('./models/User');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const mongoose=require('mongoose');
const Product=require('./models/Product')
const app = express();
const Cart=require('./models/Cart')


const PORT = 3000;


app.use(bodyParser.json());
const cors = require('cors');
// const { mailTransport, generateEmailTemplate, plainEmailTemplate } = require('./utils/mail');
const corsOptions = {
  origin: 'https://shop-bag-nine.vercel.app',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.options('*', cors(corsOptions));
dotenv.config({
    path: '.env'
});

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

//jwt authentication 
function authenticateToken(req, res, next) {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    console.log(token)

    if (!token) {
        console.log("Access denied. No token provided.");
        return res.status(401).send("Access denied. No token provided.");
    }
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Invalid token", error);
        res.status(400).send("Invalid token");
    }
  }
  
//signup
app.post('/register', async (req, res) => {
    const { password, email, fullName, userName } = req.body;
  
    // Check if all required fields are present
    if (!password || !email || !fullName || !userName) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const saltRounds = 10;
      
      const user = new User({
        password,
        email,
        fullName,
        userName,
        verified: true,
        joined: new Date(),
              lastUpdate: new Date()
      });
  
     
       await user.save();
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      
      res.status(201).json({token:token, message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.post('/check-uniqueness', async (req, res) => {
    const { userName, email } = req.body;
    try {
      if (userName) {
        const existingUser = await User.findOne({ userName });
        return res.json({ isUnique: !existingUser });
      } else if (email) {
        const existingUser = await User.findOne({ email });
        return res.json({ isUnique: !existingUser });
      }
      res.status(400).json({ message: 'Invalid request' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });



//login
app.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    console.log(req.body)
  
    try {
      // Find the user by username
      const user = await User.findOne({ userName });
      console.log(user)
      if (!user) {
        return res.status(404).json({ message: 'Username does not exist' });
      }
  
      // Check if the password is correct
      
      if (password!==user.password) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      // Generate a token for the user
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      
      
      res.status(200).json({ token:token, userName: user.userName });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });


  //products
app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  app.post('/products', async (req, res) => {
    const product = new Product({
        brand:req.body.brand,
      name: req.body.name,
      description:req.body.description,
      price: req.body.price,
      image: req.body.image,
      available:req.body.available
    });
    
  
    try {
      const newProduct = await product.save();
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


  app.get('/getcart', authenticateToken, async (req, res) => {
    const userId = req.user.userId; // Get userId from the token
  
    try {
      const cartItems = await Cart.find({ userId }).populate('productId'); // Filter by userId
      const formattedItems = cartItems.map(item => ({
        id: item._id,
        productId: item.productId._id,
        name: item.productId.name,
        brand: item.productId.brand,
        price: item.productId.price,
        image: item.productId.image,
        quantity: item.quantity,
      }));
      res.json(formattedItems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  
  app.post('/postcart', authenticateToken, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.userId; // Get userId from the token
    console.log(userId)
  
    try {
      let cartItem = await Cart.findOne({ productId, userId }); // Include userId in the query
  
      if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        cartItem = new Cart({ productId, quantity, userId }); // Include userId when creating a new cart item
        await cartItem.save();
      }
  
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  
  app.put('/cart', authenticateToken, async (req, res) => {
    const { itemId, quantity } = req.body;
    const userId = req.user.userId; // Get userId from the token
  
    try {
      const cartItem = await Cart.findOne({ _id: itemId, userId }); // Include userId in the query
      if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
  
      cartItem.quantity = quantity;
      await cartItem.save();
  
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  
  app.delete('/cart/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId; // Get userId from the token
  
    try {
      const cartItem = await Cart.findOneAndDelete({ _id: id, userId }); // Include userId in the query
      if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
  
      res.json({ message: 'Cart item removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

  
  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
