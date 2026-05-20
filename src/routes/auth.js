const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const validateRegistration = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').notEmpty().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().isLength({ min:6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
    body('email').notEmpty().isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
];

router.post('/register',validateRegistration,async(req ,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser){
        return res.status(400).json({message:'User already exists'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({message:'User registered successfully'});
});

router.post('/login',validateLogin,async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user){
        return res.status(400).json({message:'Invalid credentials'});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        return res.status(400).json({message:'Invalid credentials'});
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;