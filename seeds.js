const mongoose    = require("mongoose"),
      Campground  = require("./models/campground"),
      Comment     = require("./models/comment");


var data = [
  {
    name: "Cloud Rest", 
    image: "https://cdn.pixabay.com/photo/2017/09/11/14/11/fisherman-2739115__480.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Ocean Island", 
    image: "https://cdn.pixabay.com/photo/2019/08/30/21/16/mountains-4442337__480.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Lake Lucerne", 
    image: "https://cdn.pixabay.com/photo/2020/03/25/16/52/lake-lucerne-region-4967952__480.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
];

function seedDB(){
  //Remove all campgrounds
  Campground.remove({}, (err) => {
    if(err){
      console.log(err);
    }
    console.log("removed campgrounds!");
    Comment.remove({}, (err)  => {
      if(err){
        console.log(err);
      }
      console.log("removed comments!");
    });
    //add a few campgrounds
    data.forEach((seed) => {
      Campground.create(seed, (err, campground) => {
        if(err){
          console.log(err);
        } else {
          console.log("added a campground");
          //add a few comments
          Comment.create(
            {
              text: "This place is greate, but I wish there was internet",
              author: "Homer"
            }, (err, comment) => {
              if(err){
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("Created new comment");
              }
            });
        }
      });
    });
  });
  
}
        
module.exports = seedDB;