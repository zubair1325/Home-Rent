const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createNewReview = async (req, res) => {
  let listings = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  listings.reviews.push(newReview);
  await newReview.save();
  await listings.save();
  req.flash("success", "Review added sucessfully:)");
  res.redirect(`/listings/${listings.id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  console.log(req.params);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted sucessfully:(");
  res.redirect(`/listings/${id}`);
};
