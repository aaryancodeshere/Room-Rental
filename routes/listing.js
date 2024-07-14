const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn, isOwner,schemavalidate} = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



//index route

router.get("/",wrapAsync(listingController.index));

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm)

//Create route

router.post("/",isLoggedIn,upload.single('listing[image]'),schemavalidate,wrapAsync(listingController.createListing))


//show route

router.get("/:id", wrapAsync(listingController.showListing))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing))

//Update Route

router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),schemavalidate, wrapAsync(listingController.updateListing))

//Delete Route

router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing))




module.exports = router;