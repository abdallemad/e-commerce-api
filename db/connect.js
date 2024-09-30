const mongoose = require('mongoose');

const connectDB = (url) => {
  mongoose.set('strictQuery', false); // Set to false to match Mongoose 7 behavior
  return mongoose.connect(url);
};

module.exports = connectDB;
