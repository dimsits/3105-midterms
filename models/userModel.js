const fs = require('fs');
const path = require('path');

// Path to the users.json file
const usersFilePath = path.join(__dirname, '../data/users.json');

// Utility function to read the users from the JSON file
const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File does not exist, return an empty array
      return [];
    }
    throw err;
  }
};

// Utility function to write users to the JSON file
const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
};

// User model definition
class User {
  constructor(id, username, email, password) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

// Utility function to get the next user ID
const getNextId = () => {
  const users = readUsersFromFile();
  return users.length > 0 ? users[users.length - 1].id + 1 : 1;
};

// Function to get all users
const getUsers = () => {
  return readUsersFromFile();
};

// Function to add a user
const addUser = (newUser) => {
  const users = readUsersFromFile();
  users.push(newUser);
  writeUsersToFile(users);
};

// Function to find a user by username
const findByUsername = (username) => {
  const users = readUsersFromFile();
  return users.find((user) => user.username === username);
};

// Function to find a user by ID
const findById = (id) => {
  const users = readUsersFromFile();
  return users.find((user) => user.id.toString() === id.toString());
};

module.exports = {
  User,
  getNextId,
  getUsers,
  addUser,
  findByUsername,
  findById,
};
