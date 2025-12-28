const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const flash = require("connect-flash");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer = require("multer");
const { cloudinary, storage } = require("../cloudConfig.js");
const upload = multer({ storage });
//controlers
const listingControler = require("../controler/listings.js");
const validateListings = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};

//index route
router
  .route("/")
  .get(wrapAsync(listingControler.index)) //all listings
  .post(
    //create new listings
    isLoggedIn,
    upload.single("listings[image]"),
    validateListings,
    wrapAsync(listingControler.postNewListings)
  );

//create new listings
router.get("/new", isLoggedIn, listingControler.renderNewForm);
//search listings
router.get("/search",wrapAsync(listingControler.searchListing))
module.exports = router;

router
  .route("/:id")
  .get(wrapAsync(listingControler.showListings)) //show perticular listings
  .put(
    //update existing listings
    isOwner,
    upload.single("listings[image]"),
    validateListings,
    wrapAsync(listingControler.updateEditListings)
  )
  .delete(
    // delete listings
    isLoggedIn,
    isOwner,
    wrapAsync(listingControler.deleteListings)
  );

//edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControler.renderEditForm)
);
 


