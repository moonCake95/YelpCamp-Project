// ======================
// CAMPGROUNDS ROUTTES
// ======================
const express     = require("express"),
      router      = express.Router(),
      middleware  = require("../middleware"),
      Campground  = require("../models/campground");

//INDEX -show all campgrounds
router.get("/", (req, res) => {
  if(req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    //get all campgrounds from db
    Campground.find({name: regex}, (err, allCampgrounds) =>{
      if(err){
        console.log(err);
      } else {
        if(allCampgrounds.length < 1){
          req.flash("error", "No campgrounds match that query, please try again.");
          return res.redirect('back');
        }
        res.render("campgrounds/index", {campgrounds:allCampgrounds, page: 'campgrounds'});
      }
    });
  } else {
    //get all campgrounds from db
    Campground.find({}, (err, allCampgrounds) =>{
      if(err){
        console.log(err);
      } else {
        res.render("campgrounds/index", {campgrounds:allCampgrounds, page: 'campgrounds'});
      }
    });
  }
});


//CREATE - add a new campground to DB
router.post("/",middleware.isLoggedIn, (req, res) => {
  //get data from "form" and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, image: image, description: desc, author: author}
  //create a new campground and save to db
  Campground.create(newCampground,(err,newCreated) =>{
    if(err){
      console.log(err);
    } else {
      req.flash("success", "campground successsfully created");
      //redirect back to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id",(req, res) =>{
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
    if(err || !foundCampground){
      req.flash("error", "Campground not found");
      res.redirect("back");
    } else {
      console.log(foundCampground);
      //render show template with that campground
      res.render("campgrounds/show", {campground:foundCampground});
    }
  });
});

//EDIT CAMPGROUND ROUTE
  router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res) => {
      Campground.findById(req.params.id,(err, foundCampground) =>{
        res.render("campgrounds/edit",{campground: foundCampground})
      });
  });

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership ,(req, res) => {
  //find and update the correct campground
  const data = {}
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp)=>{
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      //redirect somewhere(show page)
      req.flash("info", "your campground is updated");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership ,(req, res)=> {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground deleted");
      res.redirect("/campgrounds");
    }
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;