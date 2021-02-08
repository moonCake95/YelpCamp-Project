const Campground = require("../models/campground"),
      Comment    = require("../models/comment");
// all the middleware goes here
const middlewareObj = {};

// campground ownership middleware
middlewareObj.checkCampgroundOwnership = (req ,res, next) => {
    if(req.isAuthenticated()){
      Campground.findById(req.params.id,(err, foundCampground) =>{
        if(err || !foundCampground){
          req.flash("error", "Campground not found!");
          console.log(err);
          res.redirect("back");
        } else {
          // does user own the campground?
          if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
            next();
          } else {
            req.flash("error", "You don't have permission to do that!");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to be logged in to do that");
      res.redirect("back");
    }
  }

// comment ownership middleware
middlewareObj.checkCommentOwnership = (req ,res, next) => {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, (err, foundComment) =>{
      if(err || !foundComment){
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        // does user own the comment?
        if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Yoy need to logged in to do that");
    res.redirect("back");
  }
}

// login middleware
middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
}

module.exports = middlewareObj