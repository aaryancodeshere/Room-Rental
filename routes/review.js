const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const {reviewvalidate, isLoggedIn, isAuthor} = require("../middlewares.js");
const reviewController = require("../controllers/reviews.js");


//Review
//Post Review Route

router.post("/",
    isLoggedIn,
    reviewvalidate,
    wrapAsync(reviewController.createReview))
  
 //Delete Review Route
  router.delete("/:reviewId",
    isLoggedIn,
    isAuthor,
    wrapAsync(reviewController.deleteReview))





    module.exports=router;