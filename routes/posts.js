/* 
Can create a new blog post without an image
Cannot upload image
*/

var express = require('express');
var router = express.Router();
var mongo = require("mongodb");
var db = require("monk")("MONGOLAB_URI");

router.get('/show/:id', function(req, res, next) {
   var posts = db.get('posts');
   posts.findById(req.params.id, function(err, post) { // findById is a monk function
      if (err) throw err;
      res.render('show', {
       "title": "Add Post",
       "post": post
      });
   });
});

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
         console.log(req.body.mainimage);
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
   req.checkBody('body', 'You cannot have a blog post with some text!').notEmpty();
   
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

router.post('/addcomment', function(req, res, next) {
   // get the form values
   var name       = req.body.name; // name comes from jade/view file, in the form's name attribute
   var email      = req.body.email;
   var body       = req.body.body;
   var postid     = req.body.postid;
   var commentdate = new Date();

   // Form Validation
   req.checkBody('name', 'Name field is required').notEmpty();
   req.checkBody('email', 'Email field is required').notEmpty();
   req.checkBody('email', 'Invalide email').isEmail();
   req.checkBody('body', 'You need to leave a comment!').notEmpty();
   
   // check errors from validator above
   var errors = req.validationErrors();
   
   if (errors) {
      var posts = db.get('posts');
      posts.findById(postid, function(err, post) {
         res.render('show', {
            "errors": errors,
            "post": post
         });
      });
   } else {
      var comment = {"name": name, "email": email, "body": body, "commentdate": commentdate};
      var posts = db.get('posts');
      console.log('this is the post id ' + postid);
      
      posts.update({
            "_id": postid,
         },
         {
            $push: {
               "comments": comment
            }
         },
         function(err, doc) {
            if (err) {
               throw err;
            } else {
               req.flash('success', 'your comment has posted!');
               res.location('/posts/show/' + postid);
               res.redirect('/posts/show/' + postid);
            }
         }
      );
   }
});

module.exports = router;