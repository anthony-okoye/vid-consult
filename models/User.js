const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    unique: true,
  },
  lastname: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isDoctor: {
    type: Boolean,
    default: false,
  },
  // Add more fields as needed for the user profile
},
{
  timestamps: true, // This will add the `created_at` and `updated_at` fields
}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
