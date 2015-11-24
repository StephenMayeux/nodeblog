var express = require('express');
var router = express.Router();
var mongo = require("mongodb");
var db = require("monk")("localhost/nodeblog");

// Add categories
router.get('/add', function(req, res, next) {
  res.render('addcategory', {
    "title": "Add Category"
  });
});

router.post('/add', function(req, res, next) {
   // get the form values
   var title    = req.body.title; // title comes from jade/view file, in the form's name attribute

   // Form Validation
   req.checkBody('title', 'Title field is required').notEmpty();
   
   // check errors from validator above
   var errors = req.validationErrors();
   
   if (errors) {
      res.render('addcategory', { //render on addpost view
         "errors": errors, // if there are any errors, don't lose form input!
         "title": title,
      });
   } else {
      var categories = db.get('categories');
      
      //submit to db
      categories.insert({
         "title": title
      }, function(err, category){
         if (err) {
            res.send("There was an issue submitting a category");
         } else {
            req.flash('success', 'Category submitted!');
            res.location('/categories/add');
            res.redirect('/categories/add');
         }
      });
   }
});

module.exports = router;
