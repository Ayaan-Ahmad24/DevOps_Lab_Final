const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// changing

const register = async (req, res) => {
    const { UserName, Password, Email } = req.body;

    // Simple validation
    if (!UserName || !Password || !Email) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const existingAdmin = await Admin.findOne({ Email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);
        const admin = new Admin({ UserName, Password: hashedPassword, Email });
        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const login = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        const admin = await Admin.findOne({ Email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(Password, admin.Password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { register, login };
