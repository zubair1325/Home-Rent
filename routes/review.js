const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewControler = require("../controler/review.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};

//reviews
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewControler.createNewReview)
);

//delete post review route
//delete review  route
router.delete(
  "/:reviewId",
  isReviewAuthor,
  wrapAsync(reviewControler.deleteReview)
);

module.exports = router;
