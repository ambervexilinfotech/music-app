var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: { type: Number, default: null },
  password: String,
  photo: { type: String, default: '' },
  type: { type: Number, default: 1 },//1 -user, 2- admin
  updated_at: { type: Date, default: Date.now },
  activation: { type: Number, default: 0 } // 1-active, 0- inactive
});



module.exports = mongoose.model('User', UserSchema);