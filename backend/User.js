//User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  gestureMappings: { type: Map, of: String, default: {} },
});

module.exports = mongoose.model('User', UserSchema);
