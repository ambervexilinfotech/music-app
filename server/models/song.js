var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var SongSchema = new mongoose.Schema({
    audioName:{type:String,default:''},
    title: String,
    // coverphoto: { type: String, default: '' },
    singer: { type: String, default: '' },
    movie: { type: String, default: '' },
    album: { type: String, default: '' },
    lyricist: { type: String, default: '' },
    actors: { type: String, default: '' },
    lyrics: { type: String, default: '' },
    genre: { type: String, default: 'Random' },
    duration: { type: String, default: '' },
    size: { type: String, default: '' },
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    categoryId: {
        type: ObjectId,
        ref: 'Category'
    },    
    updated_at: { type: Date, default: Date.now },
});



module.exports = mongoose.model('Song', SongSchema);