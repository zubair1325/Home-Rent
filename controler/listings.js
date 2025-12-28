require("dotenv").config();

const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.searchListing = async (req, res, next) => {
  let { search } = req.query;
  let allLesting = await Listing.find({
    location: { $regex: search, $options: "i" },
  });

  if (allLesting.length === 0) {
    req.flash("error", "Home not Found:(");
    return res.redirect("/listings");
  }
  res.render("./listings/index.ejs", { allLesting });
};

module.exports.index = async (req, res, next) => {
  let allLesting = await Listing.find({});
  res.render("./listings/index.ejs", { allLesting });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};
module.exports.postNewListings = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listings.location,
      limit: 1,
    })
    .send();

  let newListing = new Listing(req.body.listings);
  let url = req.file.path;
  let filename = req.file.filename;
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListings = await newListing.save();
  console.log(savedListings);
  req.flash("success", "New Listing Added:)");
  res.redirect("/listings");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  let oneLesting = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!oneLesting) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { l: oneLesting });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let info = await Listing.findById(id);
  if (!info) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }
  let orginalImageUrl = info.image.url;
  // console.log(orginalImageUrl);
  // console.log(req.file.path);
  orginalImageUrl = orginalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("./listings/edit.ejs", { l: info, orginalImageUrl });
};

module.exports.updateEditListings = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findByIdAndUpdate(id, { ...req.body.listings });
  console.log(list);

  if (req.file) {
    let url = req.file.path; //url link of cloud saved image
    let filename = req.file.filename; //file name of cloud saved image
    list.image = { url, filename };
    await list.save();
  }

  req.flash("success", "listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListings = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted sucessfully:(");
  res.redirect("/listings");
};
