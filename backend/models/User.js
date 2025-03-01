const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});
const UserSchema = mongoose.model('User', schema);

module.exports = UserSchema;