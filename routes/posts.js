/* 
Can create a new blog post without an image
Cannot upload image
*/

var express = require('express');
var router = express.Router();
var mongo = require("mongodb");
var db = require("monk")("localhost/nodeblog");

router.get('/add', function(req, res, next) {
   var categories = db.get('categories'); // grab categories from db
   
   categories.find({}, {}, function(err, categories) { // list all of them
      if (err) throw err;
      res.render('addpost', {
       "title": "Add Post",
       "categories": categories
      });
   });
});

router.post('/add', function(req, res, next) {
   // get the form values
   var title    = req.body.title; // title comes from jade/view file, in the form's name attribute
   var category = req.body.category;
   var body     = req.body.body;
   var author   = req.body.author;
   var date     = new Date();

   
   if (req.files.mainimage) { // if we upload an image, grab this info
        var mainImageOriginalName   = req.files.mainimage.originalname;
        var mainImageName           = req.files.mainimage.name;
        var mainImageMime           = req.files.mainimage.mimetype;
        var mainImagePath           = req.files.mainimage.path;
        var mainImageExt            = req.files.mainimage.extension;
        var mainImageSize           = req.files.mainimage.size;
   } else {
      mainImageName = 'noimage.png'; // if not, set a default image
   }
   
   // Form Validation
   req.checkBody('title', 'Title field is required').notEmpty();
   req.checkBody('body', 'You cannot have a blog post with some text!');
   
   // check errors from validator above
   var errors = req.validationErrors();
   
   if (errors) {
      res.render('addpost', { //render on addpost view
         "errors": errors, // if there are any errors, don't lose form input!
         "title": title,
         "body": body
      });
   } else {
      var posts = db.get('posts');
      
      //submit to db
      posts.insert({
         "title": title,
         "body": body,
         "category": category,
         "date": date,
         "author": author,
         "mainImageName": mainImageName
      }, function(err, post){
         if (err) {
            res.send("There was an issue submitting a post");
         } else {
            req.flash('success', 'Post submitted!');
            res.location('/');
            res.redirect('/');
         }
      });
   }
});

module.exports = router;