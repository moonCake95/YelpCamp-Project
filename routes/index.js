// ======================
// INDEX ROUTTES
// ======================

const express    = require("express"),
      router     = express.Router(),
      passport   = require("passport"),
      Campground = require("../models/campground"),
      User       = require("../models/user");
//root route
router.get("/", (req, res) => {
  res.render("landing");
});

// =============
// AUTH ROUTES
// =============

//SHOW REGISTER FORM

router.get("/register", (req,res) => {
  res.render("register", {page: 'register'});
});

//handle sign up logic
router.post("/register", (req, res) => {
  const newUser = new User({   // build user object from user model
      username  : req.body.username,
      firstName : req.body.firstName,
      lastName  : req.body.lastName,
      email     : req.body.email,
      avatar    : req.body.avatar
    });
  if(req.body.adminCode === 'Nani===>>>'){  // check if user admin
    newUser.isAdmin = true;
  }
  // req.body.password as second argument
  // dosen't saved in the database just gets salted & hashes hashed = passport encrypt
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      console.log(err);
      return res.render("register", {error: err.message});
    }
    passport.authenticate("local")(req, res,() => {
      req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// Show login form
router.get("/login", (req, res) => {
  res.render("login", {page: 'login'});
});
//handling login logic
router.post("/login",passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
    }), (req,res) => {
    });


//logout route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

//USER PROFILE ROUTE
router.get("/users/:id", (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {  // find the user
    if(err){                                          
      req.flash("error", "Something went wrong!");    // if no error
      return res.redirect("/");
    }
                                                      // then find the campground
    Campground.find().where("author.id").equals(foundUser._id).exec((err, campgrounds) =>{
      if(err){
        req.flash("error", "Something went wrong!");
        return res.redirect("/");
      }
      res.render("../views/users/show", {user: foundUser, campgrounds: campgrounds});
    });
  });
});

module.exports = router;