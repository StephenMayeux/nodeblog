var express = require('express');
var router = express.Router();
var mongo = require("mongodb");
var db = require("monk")("localhost/nodeblog");

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
