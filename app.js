const express           = require("express"),
      app               = express(),
      bodyParser        = require("body-parser"),
      mongoose          = require("mongoose"),
      flash             = require("connect-flash"),
      passport          = require("passport"),
      LocalStrategy     = require("passport-local"),
      User              = require("./models/user"),
      methodOverride    = require("method-override"),
      seedDB            = require("./seeds");

//requiring routes
const commentRoutes     = require("./routes/comments"),
      campgroundsRoutes = require("./routes/campgrounds"),
      indexRoutes        = require("./routes/index");



mongoose.connect("mongodb://localhost/yelp_camp_v18", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.set("view engine", "ejs");

// seedDB(); //seed the database
app.locals.moment = require('moment');

// PASSPORT CONFIGURATION /////////////////////////
app.use(require("express-session")({
  secret: "Once again Lior is the best!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

////////////////////////////////////////////////////
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.info = req.flash("info");
  next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundsRoutes);

app.listen(3000, function() {
  console.log("The YelpCamp Server Has Started!");
});