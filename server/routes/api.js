const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var app = express();
var multer = require('multer');
app.set('superSecret', 'mymusicapp2017'); //json web token
var baseurl = "http://localhost:3000";
// var baseurl = "http://43.240.66.86";

app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", baseurl);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

var nodemailer = require('nodemailer'); // to send the mails
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'amber@vexilinfotech.com',
        pass: 'Aadya@2014'
    }
});


//Model
var User = require('../models/user.js');
var Category = require('../models/category.js');
var Playlist = require('../models/playlist.js');
var Song = require('../models/song.js');







var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        console.log("file", file);
        if (file.mimetype == 'audio/mp3')
            cb(null, './src/assets/audios');
        else
            cb(null, './src/assets/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


var upload = multer({ //multer settings
    storage: storage
}).single('file');







/* GET api listing. */
router.get('/', (req, res) => {
    res.send('api works');
});


/* post api to Register User */
router.post('/register', function (req, res, next) {
    console.log("req.body.email", req.body.email);
    User.findOne({ 'email': req.body.email }, function (err, userfind) {
        console.log("user", userfind);
        if (userfind == null) {
            User.create(req.body, function (err, user) {
                if (err) return next(err);
                if (user) {
                    console.log("user", user);
                    var mailOptions = {
                        from: 'amber@vexilinfotech.com',
                        to: user.email,
                        subject: 'Activation E-Mail',
                        html: '<html><body><p><b>Hi ' +
                        user.name.charAt(0).toUpperCase() + user.name.slice(1) +
                        '</b></p> <p>Thanks for signing up with Music App</p> <p>To complete the signup,<a href="' + baseurl + '/api/activate/' +
                        user.email +
                        '">click here to verify your email address</a></p><p>After verification you can sign in to your music app at <a href="' + baseurl + '">' + baseurl + '</a>. Please bookmark this URL now.</p><p>If you have any questions, contact our customer service team.</p><p>Your Music App Team</p></body></html>'

                    };
                    if (mailOptions.subject != '') {
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                                res.json({ "message": "Error sending the activation mail please enter a valid email!", success: false });
                            } else {

                                console.log('Email sent: ' + info.response);
                                res.json({ "message": "Sign Up Successfully, Check Email to Activate Your Account!", success: true });
                            }
                        });
                    }

                } else {
                    res.json({ "message": "Filed to register invalid data", success: false });
                }
            });
        } else {
            console.log("user", userfind);
            res.json({ "message": "Email already exist" });
        }
    });
});


/* post api to Register User */
router.post('/createAdmin', function (req, res, next) {
    if (req.body.email == 'amber.mishra1988@gmail.com') {
        User.findOne({ 'email': 'amber.mishra1988@gmail.com' }, function (err, userfind) {
            console.log("user", userfind);
            if (userfind == null) {
                var newUser = {
                    email: 'amber.mishra1988@gmail.com',
                    password: 'Amber2017',
                    name: 'Admin Admin',
                    type: 2,
                    activation: 1
                }
                User.create(newUser, function (err, user) {
                    if (err) return next(err);
                    res.json({ "message": "Admin Account Created Successfully !", "user": user });
                });
            } else {
                res.json({ "message": "Email already exist" });
            }
        });
    } else {
        res.json({ "message": "Access Denied" });
    }
});


// post api to create or fetch existing user and generate and return token
router.post('/login', function (req, res, next) {
    User.findOne({ 'email': req.body.email }, function (err, existinguser) {
        if (err) return next(err);
        if (!existinguser) {
            res.json({ success: false, message: 'Authentication failed. Email not found.' });
        } else if (existinguser) {

            // check if password matches
            if (existinguser.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else if (existinguser.activation != 1) {
                res.json({ success: false, message: 'Account not activated, please check mail' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(existinguser, app.get('superSecret'), {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    user: existinguser
                });
            }
        }
    });
});

/* get api to forget password registerd User */
router.post('/forgetPassword', function (req, res, next) {
    User.findOne({ 'email': req.body.email }, function (err, user) {
        if (err) return next(err);
        console.log(user)
        if (user) {
            var mailOptions = {
                from: 'amber@vexilinfotech.com',
                to: user.email,
                subject: 'Forget Password E-Mail',
                html: '<html><body><p><b>Hi ' +
                user.name.charAt(0).toUpperCase() + user.name.slice(1) +
                '</b></p><p>Password for email ID ' + user.email + ' is <b>' + user.password + ' </b></p><p>If you have any questions, contact our customer service team.</p><p>You can sign in to your music app at <a href="' + baseurl + '">' + baseurl + '</a>. Please bookmark this URL now.</p><p>Your Music App Team</p></body></html>'
            };
            if (mailOptions.subject != '') {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.json({ "message": "Failed to send email", success: false });
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.json({ "message": "Email send Successfully", success: true });
                    }
                });
            }
        } else {
            res.json({ "message": "EmailId does not exists", success: false });
        }

    });
});

/* get api to Activate registerd User */
router.get('/activate/:email', function (req, res, next) {
    User.findOne({ 'email': req.params.email }, function (err, user) {
        if (err) return next(err);
        console.log(user)
        if (user.activation == 0) {
            User.update(
                { "email": req.params.email },
                { activation: 1 },
                function (err, users) {
                    if (err) return next(err);
                });
            res.redirect('http://localhost:3000/login');
        } else if (user.activation == 1) {
            res.json({ message: 'Account already activated' });
        }

    });
});

/* get api to Activate registerd User */
router.get('/activateUser/:email', function (req, res, next) {
    User.findOne({ 'email': req.params.email }, function (err, user) {
        if (err) return next(err);
        console.log(user)
        if (user) {
            User.findOneAndUpdate(
                { "email": req.params.email },
                { $set: { activation: 1 } },
                { new: true },
                function (err, users) {
                    if (err) return next(err);
                    res.json({ message: 'Account activated successfully', success: true, user: users });
                });
        } else {
            res.json({ message: 'User not found', success: false });
        }

    });
});

/* get api to Deactivate registerd User */
router.get('/deactivateUser/:email', function (req, res, next) {
    User.findOne({ 'email': req.params.email }, function (err, user) {
        if (err) return next(err);
        console.log(user)
        if (user) {
            User.findOneAndUpdate(
                { "email": req.params.email },
                { $set: { activation: 0 } },
                { new: true },
                function (err, users) {
                    if (err) return next(err);
                    res.json({ message: 'Account deactivated successfully', success: true, user: users });
                });
        } else {
            res.json({ message: 'User not found', success: false });
        }

    });
});





//check for token generated after login
// router.use(function (req, res, next) {
//     // check header or url parameters or post parameters for token
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];
//     // decode token
//     if (token) {
//         // verifies secret and checks exp
//         jwt.verify(token, app.get('superSecret'), function (err, decoded) {
//             if (err) {
//                 return res.json({ success: false, message: 'Failed to authenticate token.' });
//             } else {
//                 // if everything is good, save to request for use in other routes
//                 req.decoded = decoded;
//                 next();
//             }
//         });

//     } else {
//         // if there is no token
//         // return an error
//         return res.status(403).send({
//             success: false,
//             message: 'No token provided.'
//         });
//     }
// });


/* post api to update registerd User */
router.post('/updateUser', function (req, res, next) {
    User.findOne({ 'email': req.body.email }, function (err, user) {
        if (err) return next(err);
        console.log(user)
        if (user) {
            User.findOneAndUpdate(
                { "email": req.body.email },
                {
                    $set: {
                        name: req.body.name,
                        phone: req.body.phone,
                    }
                },
                { new: true },
                function (err, updateStatus) {
                    if (err) return next(err);
                    res.json({ message: 'User updated successfully', user: updateStatus, success: true });
                });
        } else if (!user) {
            res.json({ message: 'User not exist', success: false });
        }

    });
});



/** API path that will upload the image */
router.post('/uploadUserImage/:email', function (req, res) {
    console.log("req.params", req.params.email);
    User.findOne({ 'email': req.params.email }, function (err, user) {
        if (err) return next(err);
        console.log(user)
        if (user) {
            upload(req, res, function (err) {
                console.log("req.file", req.file);

                if (err) {
                    res.json({ error_code: 1, err_desc: err });
                    return;
                }
                if (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png') {
                    User.findOneAndUpdate(
                        { "email": req.params.email },
                        {
                            $set: {
                                photo: req.file.originalname,
                            }
                        },
                        { new: true },
                        function (err, update) {
                            if (err) return next(err);
                            res.json({ message: 'Photo updated successfully', user: update, success: true });
                        });
                } else {
                    res.json({ message: 'Invalid Image Type', success: false });
                }
            });
        } else if (!user) {
            res.json({ message: 'User not exist', success: false });
        }

    });
});

/* Get All User */
router.get('/getAllUsers', function (req, res, next) {
    User.find({}, function (err, user) {
        if (err) return next(err);
        res.json(user);
    });
});

/* Get All User */
router.get('/getAllUser/:email', function (req, res, next) {
    User.find({ 'email': { $ne: req.params.email } }, function (err, user) {
        if (err) return next(err);
        if (user) {
            res.json({ user: user, success: true, message: "Users are loading" });
        } else {
            res.json({ success: true, message: "No user found" });
        }

    });
});

/* Get User By  EmailId */
router.get('/getUserByEmailId/:emailId', function (req, res, next) {
    User.find({ email: req.params.emailId }, function (err, user) {
        if (err) return next(err);
        res.json(user);
    });
});


/* Delete All User */
router.get('/deleteAllUser', function (req, res, next) {
    User.remove({}, function (err, user) {
        if (err) return next(err);
        res.json(user);
    });
});

/* Delete User By  EmailId */
router.get('/deleteUserByEmailId/:emailId', function (req, res, next) {
    User.findOneAndRemove({ email: req.params.emailId }, function (err, user) {
        if (err) return next(err);
        res.json(user);
    });
});



// create category
router.post('/createCategory', function (req, res, next) {
    Category.findOne({ 'name': req.body.name }, function (err, category) {
        if (err) return next(err);
        console.log(category)
        if (!category) {
            Category.create(req.body, function (err, newCategory) {
                if (err) return next(err);
                if (newCategory)
                    res.json({ category: newCategory, success: true, message: "Category Created Successfully" });
                else
                    res.json({ success: false, message: "Failed to created Successfully" });
            });
        } else if (category) {
            res.json({ message: 'Category name Already exist', success: false });
        }

    });
});



//search  category
router.get('/searchCategory/:search', function (req, res, next) {
    Category.find({ name: new RegExp(req.params.search, "i") }, function (err, allCategory) {
        if (err) return next(err);
        if (allCategory) {
            res.json({ "message": "Loading categories", success: true, category: allCategory });
        } else {
            res.json({ "message": "No category found", success: true });
        }
    });
});

//search  playlist
router.get('/searchPlaylist/:search', function (req, res, next) {
    Playlist.find({ name: new RegExp(req.params.search, "i") }, function (err, allPlaylist) {
        if (err) return next(err);
        if (allPlaylist) {
            res.json({ "message": "Loading playlist", success: true, playlist: allPlaylist });
        } else {
            res.json({ "message": "No playlist found", success: true });
        }
    });
});

//search  song
router.get('/searchSong/:search', function (req, res, next) {
    Song.find(
        {
            title: new RegExp(req.params.search, "i"), 
            singer: new RegExp(req.params.search, "i"),
            movie: new RegExp(req.params.search, "i"),
            album: new RegExp(req.params.search, "i"),
            lyrics: new RegExp(req.params.search, "i"),
            actor: new RegExp(req.params.search, "i"),
            genre: new RegExp(req.params.search, "i"),
        }, function (err, allSong) {
            if (err) return next(err);
            if (allSong) {
                res.json({ "message": "Loading Songs", success: true, song: allSong });
            } else {
                res.json({ "message": "No song found", success: true });
            }
        });
});


// create category
router.post('/createCategory', function (req, res, next) {
    Category.findOne({ 'name': req.body.name }, function (err, category) {
        if (err) return next(err);
        console.log(category)
        if (!category) {
            Category.create(req.body, function (err, newCategory) {
                if (err) return next(err);
                if (newCategory)
                    res.json({ category: newCategory, success: true, message: "Category Created Successfully" });
                else
                    res.json({ success: false, message: "Failed to created Successfully" });
            });
        } else if (category) {
            res.json({ message: 'Category name Already exist', success: false });
        }

    });
});


/** API path that will upload the image */
router.post('/uploadCategoryImage/:id', function (req, res) {
    console.log("req.params", req.params.id);
    Category.findById(req.params.id, function (err, category) {
        if (err) return next(err);
        console.log(category)
        if (category) {
            upload(req, res, function (err) {
                console.log("req.file", req.file);

                if (err) {
                    res.json({ error_code: 1, err_desc: err });
                    return;
                }
                if (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png') {
                    Category.findOneAndUpdate(
                        { "_id": req.params.id },
                        {
                            $set: {
                                coverphoto: req.file.originalname,
                            }
                        },
                        { new: true },
                        function (err, newcategory) {
                            if (err) return next(err);
                            res.json({ message: 'Photo updated successfully', category: newcategory, success: true });
                        });
                } else {
                    res.json({ message: 'Invalid Image Type', success: false });
                }
            });
        } else if (!category) {
            res.json({ message: 'Category not exist', success: false });
        }

    });
});

/* post api to update category */
router.post('/updateCategory', function (req, res, next) {
    Category.findOne({ '_id': req.body.categoryId }, function (err, category) {
        if (err) return next(err);
        console.log(category)
        if (category) {
            Category.findOneAndUpdate(
                { '_id': req.body.categoryId },
                {
                    $set: {
                        name: req.body.name,
                    }
                },
                { new: true },
                function (err, updatedCategory) {
                    if (err) return next(err);
                    res.json({ message: 'Category updated successfully', category: updatedCategory });
                });
        } else if (!category) {
            res.json({ message: 'Category not exist' });
        }

    });
});


//get all category
router.get('/getAllCategory', function (req, res, next) {
    Category.find({}, function (err, allCategory) {
        if (err) return next(err);
        if (allCategory) {
            res.json({ "message": "Loading categories", success: true, category: allCategory });
        } else {
            res.json({ "message": "No category found", success: true });
        }
    });
});

// get category by categoryId
router.get('/getCategoryById/:categoryId', function (req, res, next) {
    Category.findOne({ _id: req.params.categoryId }, function (err, singleCategory) {
        if (err) return next(err);
        res.json(singleCategory);
    });
});


//delete all category
router.get('/deleteAllCategory', function (req, res, next) {
    Category.remove({}, function (err, deletedCategory) {
        if (err) return next(err);
        res.json(deletedCategory);
    });
});

//delete category by categoryId
router.get('/deleteCategoryById/:categoryId', function (req, res, next) {
    Category.findOneAndRemove({ _id: req.params.categoryId }, function (err, oneDeletedCategory) {
        if (err) return next(err);
        if (oneDeletedCategory) {
            Song.remove({ categoryId: req.params.categoryId }, function (err, deletesongs) {
                if (err) return next(err);
                Category.find({}, function (err, allCategory) {
                    if (err) return next(err);
                    if (allCategory) {
                        res.json({ "message": "Loading categories", success: true, category: allCategory });
                    } else {
                        res.json({ "message": "No category found", success: true });
                    }
                });
            });
        } else {
            res.json({ "message": "Failed to delete category", success: true });
        }

    });
});





router.post('/createSong', function (req, res, next) {
    Song.findOne({ 'title': req.body.title }, function (err, song) {
        if (err) return next(err);
        console.log(song)
        if (!song) {
            Song.create(req.body, function (err, song) {
                if (err) return next(err);
                if (song)
                    res.json({ song: song, success: true, message: "Song Added Successfully" });
                else
                    res.json({ success: false, message: "Failed to add song Successfully" });
            });
        } else if (song) {
            res.json({ message: 'song name song Already exist', success: false });
        }

    });
});


//upload song image and audio
/** API path that will upload the image */
router.post('/uploadSongImageAudio/:id', function (req, res) {
    console.log("req.params", req.params.id);
    Song.findById(req.params.id, function (err, song) {
        if (err) return next(err);
        console.log(song)
        if (song) {
            upload(req, res, function (err) {
                console.log("req.file", req.file);

                if (err) {
                    res.json({ error_code: 1, err_desc: err });
                    return;
                }

                if (req.file.mimetype == 'audio/mp3') {
                    Song.findOneAndUpdate(
                        { "_id": req.params.id },
                        {
                            $set: {
                                audioName: req.file.originalname,
                                duration: req.file.duration,
                                size: req.file.size,
                            }
                        },
                        { new: true },
                        function (err, newsong) {
                            if (err) return next(err);
                            res.json({ message: 'Audio updated successfully', song: newsong, success: true });
                        });
                } else {
                    res.json({ message: 'Invalid Audio Type', success: false });
                }


            });
        } else if (!category) {
            res.json({ message: 'Song not exist', success: false });
        }

    });
});


/* post api to update song */
router.post('/updateSong', function (req, res, next) {
    Song.findOne({ '_id': req.body.songId }, function (err, Song) {
        if (err) return next(err);
        console.log(Song)
        if (Song) {
            Song.update(
                { '_id': req.body.categoryId },
                {
                    $set: {
                        title: req.body.name,
                        singer: req.body.singer,
                        movie: req.body.movie,
                        album: req.body.album,
                        lyricist: req.body.lyricist,
                        actors: req.body.actors,
                        lyrics: req.body.lyrics,
                        genre: req.body.genre,
                        duration: req.body.duration,
                        size: req.body.size,
                    }
                },
                { new: true },
                function (err, updatedCategory) {
                    if (err) return next(err);
                    res.json({ message: 'Category updated successfully', category: updatedCategory });
                });
        } else if (!Song) {
            res.json({ message: 'Song not exist' });
        }

    });
});

//get all category
router.get('/getAllSongs', function (req, res, next) {
    Song.find({}, function (err, allSongs) {
        if (err) return next(err);
        res.json(allSongs);
    });
});

// get category by categoryId
router.get('/getSongsByCategoryId/:categoryId', function (req, res, next) {
    Song.find({ categoryId: req.params.categoryId }, function (err, categorizedSongs) {
        if (err) return next(err);
        if (categorizedSongs)
            res.json({ message: 'Loading Song', song: categorizedSongs, success: true });
        else
            res.json({ message: 'No song Found', success: false });
    });
});


//delete all category
router.get('/deleteAllSongs', function (req, res, next) {
    Song.remove({}, function (err, deletedSong) {
        if (err) return next(err);
        res.json(deletedSong);
    });
});

//delete category by categoryId
router.get('/deleteSongById/:songId', function (req, res, next) {
    Song.findOneAndRemove({ _id: req.params.songId }, function (err, onesongdeleted) {
        if (err) return next(err);
        if (onesongdeleted)
        { res.json({ deletedsong: onesongdeleted, message: "Song Deleted Successfully", success: true }); }
        else {
            res.json({ message: "Failed to deleted song", success: false });
        }
    });
});



// create category
router.post('/createPlaylist', function (req, res, next) {
    Playlist.findOne({ 'name': req.body.name }, function (err, playlist) {
        if (err) return next(err);
        console.log(playlist)
        if (!playlist) {
            Playlist.create(req.body, function (err, newPlaylist) {
                if (err) return next(err);
                if (newPlaylist)
                    res.json({ playlist: newPlaylist, success: true, message: "Playlist Created Successfully" });
                else
                    res.json({ success: false, message: "Failed to create Playlist" });
            });
        } else if (playlist) {
            res.json({ message: 'Playlist name Already exist', success: false });
        }

    });
});

/** API path that will upload the image */
router.post('/uploadPlaylistImage/:id', function (req, res) {
    console.log("req.params", req.params.id);
    Playlist.findById(req.params.id, function (err, playlist) {
        if (err) return next(err);
        console.log(playlist)
        if (playlist) {
            upload(req, res, function (err) {
                console.log("req.file", req.file);

                if (err) {
                    res.json({ error_code: 1, err_desc: err });
                    return;
                }
                if (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png') {
                    Playlist.findOneAndUpdate(
                        { "_id": req.params.id },
                        {
                            $set: {
                                coverphoto: req.file.originalname,
                            }
                        },
                        { new: true },
                        function (err, newplaylist) {
                            if (err) return next(err);
                            res.json({ message: 'Photo updated successfully', playlist: newplaylist, success: true });
                        });
                } else {
                    res.json({ message: 'Invalid Image Type', success: false });
                }
            });
        } else if (!playlist) {
            res.json({ message: 'Playlist not exist', success: false });
        }

    });
});


/* post api to add song in playlist */
router.post('/addSongToPlaylist', function (req, res, next) {
    Playlist.findOne({ '_id': req.body.playlistId }, function (err, playlist) {
        if (err) return next(err);
        console.log(playlist)
        if (playlist) {
            Playlist.update(
                { '_id': req.body.playlistId },
                {
                    $set: {
                        "songId": req.body.songId,
                    }
                },
                { new: true },
                function (err, playlistData) {
                    if (err) return next(err);
                    res.json({ message: 'Song added successfully', playlist: playlistData, success: true });
                });
        } else if (!Song) {
            res.json({ message: 'Failed to add song', success: false });
        }

    });
});

//get all playlist
router.get('/getAllPlaylist', function (req, res, next) {
    Playlist.find({}, function (err, allPlaylist) {
        if (err) return next(err);
        res.json(allPlaylist);
    });
});

//get song by playlistId
// get category by categoryId
router.get('/getSongsByPlaylistId/:playlistId', function (req, res, next) {
    Playlist.findById(req.params.playlistId)
        .populate('songId')
        .exec(function (err, categorizedSongs) {
            if (err) return next(err);
            console.log("categorizedSongs", categorizedSongs.songId);
            if (categorizedSongs)
                res.json({ message: 'Loading Song', song: categorizedSongs.songId, success: true });
            else
                res.json({ message: 'No song Found', success: false });
        });
});


// get playlist by userId
router.get('/getPlaylistByUserId/:userId', function (req, res, next) {
    Playlist.find({ userId: req.params.userId }, function (err, playlist) {
        if (err) return next(err);
        if (playlist)
            res.json({ "message": "Loading playlist", success: true, playlist: playlist });
        else
            res.json({ "message": "Loading playlist", success: false });
    });
});


//delete all playlist
router.get('/deleteAllPlaylist', function (req, res, next) {
    Playlist.remove({}, function (err, deletedPlaylist) {
        if (err) return next(err);
        res.json(deletedPlaylist);
    });
});

var ObjectId = require('mongoose').Types.ObjectId;

//delete song from playlist by playlist and songId
router.get('/deletePlaylistSongById/:songId/:playlistId', function (req, res, next) {
    Playlist.update(
        { _id: req.params.playlistId },
        { "$pull": { songId: new ObjectId(req.params.songId) } },
        function (err, onesongdeleted) {
            if (err) return next(err);
            if (onesongdeleted) {
                res.json({ deletedsong: onesongdeleted, message: "Song Deleted Successfully", success: true });
            }
            else {
                res.json({ message: "Playlist not found", success: false });
            }
        });
});

//delete category by categoryId
router.get('/deletePlaylistById/:PlaylistId', function (req, res, next) {
    Playlist.findOneAndRemove({ _id: req.params.PlaylistId }, function (err, oneplaylistdeleted) {
        if (err) return next(err);
        if (oneplaylistdeleted)
        { res.json({ playlist: oneplaylistdeleted, message: "Playlist Deleted Successfully", success: true }); }
        else {
            res.json({ message: "Failed to deleted playlist", success: false });
        }
    });
});

module.exports = router;

