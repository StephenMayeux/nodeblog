var express = require('express');
var router = express.Router();
var mongo = require("mongodb");
var db = require("monk")("mongodb://heroku_8xwp74s4:3156sl4po200kp378e9h46aur1@ds063124.mongolab.com:63124/heroku_8xwp74s4");

// HOme page blog posts
router.get('/', function(req, res, next) {
  db = req.db;
  var posts = db.get('posts'); //name of the collection we're getting
  posts.find({},{},function(err, posts) { // empty curlies bc we want all posts
      if (err) throw err;
      res.render('index',{
          "posts": posts
      });
  });
});

module.exports = router;
