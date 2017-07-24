var mongoose = require('mongoose');
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var PlaylistSchema = new mongoose.Schema({
  name: String,
  coverphoto: {type:String,default:''},
  userId: {
    type: ObjectId,
    ref: 'User'
  },
  songId:[{type: ObjectId, ref: 'Song'}],
  updated_at: { type: Date, default: Date.now },
});



module.exports = mongoose.model('Playlist', PlaylistSchema);