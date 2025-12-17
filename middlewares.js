const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const {listingschema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error","You must be logged in to do that");
        return res.redirect("/login");
        }
        next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
        }
        next();

}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser.id) ){
      req.flash("error","You do not have permission to do that");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser.id) ){
      req.flash("error","You are not the author");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.schemavalidate = (req,res,next)=>{
    const {error} = listingschema.validate(req.body);
    if(error){
      throw new ExpressError("400", error);
    }
    next();
}

 module.exports.reviewvalidate = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
      throw new ExpressError("400", error);
    }
    next();
  }