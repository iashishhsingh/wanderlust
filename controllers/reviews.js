const Listing = require('../models/listing.js')
const Review = require('../models/reviews.js')

  module.exports.addReview = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review Added Successfully");
    res.redirect(`/listings/${req.params.id}`);

  } catch (err) {
    next(err); // 🔥 VERY IMPORTANT
  }
};


 module.exports.deleteReview = async (req, res, next) => {
  try {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);

  } catch (err) {
    next(err);
  }
};