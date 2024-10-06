const userModel = require('../models/userModel');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Secret key for JWT (In production, store this in environment variables)
const JWT_SECRET = 'JWT-KEY';

// Registration handler
exports.register = async (req, res) => {
  // Define validation schema
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
  });

  // Validate request data
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const { username, password, email } = req.body;

  // Check if user already exists
  const existingUser = userModel.findByUsername(username);
  if (existingUser) return res.status(400).send({ message: 'Username already taken' });

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = {
    id: userModel.getNextId(),
    username,
    password: hashedPassword,
    email,
  };

  userModel.addUser(newUser);

  res.status(201).send({ message: 'User registered successfully' });
};

// Login handler
exports.login = async (req, res) => {
    // Define validation schema
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
  
    // Validate request data
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
  
    const { username, password } = req.body;
  
    // Find user by username
    const userRecord = userModel.findByUsername(username);
    if (!userRecord) {
      return res.status(400).send({ message: 'Invalid username or password' });
    }
  
    // Use the correct user object
    const user = userRecord;
  
    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send({ message: 'Invalid username or password' });
  
    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  
    res.send({ message: 'Login successful', token });
  };
  

// Profile retrieval handler
exports.getProfile = (req, res) => {
  // `req.user` is set in the auth middleware
  const user = userModel.findById(req.user.id);

  if (!user) return res.status(404).send({ message: 'User not found' });

  // Exclude password from the user data
  const { password, ...userWithoutPassword } = user;

  res.send(userWithoutPassword);
};