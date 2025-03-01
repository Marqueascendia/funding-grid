const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/User');
require('dotenv').config();


const signup =  async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserSchema.findOne({ email });
        if (user) return res.status(400).json({ error: 'User exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserSchema({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Email already exists' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserSchema.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15d' });
        res.status(200).json({ token });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    signup,
    login
}