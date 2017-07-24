var mongoose = require('mongoose');
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var CategorySchema = new mongoose.Schema({
  name: String,
  coverphoto: { type: String, default: '' },
  userId: {
    type: ObjectId,
    ref: 'User'
  },
  updated_at: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Category', CategorySchema);