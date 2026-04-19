const express= require('express');
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {isLoggedIn, isOwner,validateListing  } = require("../middleware.js");
const listingController = require("../controllers/listings.js")

const {storage} = require("../cloudConfig.js")
const multer  = require('multer')
const upload = multer({ storage })

// lisitings

router
    .route('/')
    //Index Route 
    .get(wrapAsync(listingController.index))
    //create route
    .post(isLoggedIn,validateListing, upload.single('image'), wrapAsync(listingController.createListing));


// new Route
router.get("/new",isLoggedIn,wrapAsync (listingController.renderNewForm))

router
    .route('/:id')
    // update route
    .put(isLoggedIn,isOwner, validateListing,upload.single('image'),wrapAsync(listingController.updateListing))
    //delete
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))
    // Show Route
    .get(wrapAsync(listingController.showListing));
    
// edit
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm)
)



module.exports = router;