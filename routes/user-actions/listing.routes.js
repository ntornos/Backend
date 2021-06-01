const router = require('express').Router();

const Listing = require('../../db/models/Listing');
const { isLoggedIn } = require('../auth/utils');
const ErrorResponse = require('../../utils/errorResponse');

module.exports = router;

//  @desc        Find all user listings
//  @route       GET /user-actions/find-all
//  @access      Private
router.get('/find-all', isLoggedIn, (req, res, next) => {
  try {
    Listing.find({ userId: req.user.id }, (err, listings) => {
      if (err) return next(err);

      return res.send({ status: true, count: listings.length, data: listings });
    });
  } catch (err) {
    next(err);
  }
});

//  @desc        Find unarchived user listings
//  @route       GET /user-actions/find-unarchived
//  @access      Private
router.get('/find-unarchived', isLoggedIn, (req, res, next) => {
  try {
    Listing.find({ userId: req.user.id, archived: false }, (err, listings) => {
      if (err) return next(err);

      return res.send({ status: true, count: listings.length, data: listings });
    });
  } catch (err) {
    next(err);
  }
});

//  @desc        Find archived user listings
//  @route       GET /user-actions/find-archived
//  @access      Private
router.get('/find-archived', isLoggedIn, (req, res, next) => {
  try {
    Listing.find({ userId: req.user.id, archived: true }, (err, listings) => {
      if (err) return next(err);

      return res.send({ status: true, count: listings.length, data: listings });
    });
  } catch (err) {
    next(err);
  }
});

//  @desc        Create new listing
//  @route       POST /user-actions/create-listing
//  @access      Private
router.post('/create-listing', isLoggedIn, (req, res, next) => {
  const { listingStatus, address, listingType, mapImg } = req.body;
  console.log(mapImg);

  try {
    Listing.create(
      {
        status: listingStatus,
        address,
        type: listingType,
        userId: req.user.id,
        mapImg,
      },
      async (err, listing) => {
        if (err) return next(err);

        await listing.save();

        return res.send({
          status: true,
          message: 'Listing created',
          data: listing,
        });
      }
    );
  } catch (err) {
    next(err);
  }
});

//  @desc        Edit listing
//  @route       PUT /user-actions/update-listing/:id
//  @access      Private
router.put('/update-listing/:id', isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const { bathrooms, bedrooms } = req.body;

  const amenities = {
    bathrooms,
    bedrooms,
  };

  try {
    // if the logged in userId doesn't match the userId on the current listing, it can't be edited. Unless it's an admin.
    const currListing = await Listing.findById(id);

    if (!(currListing.userId !== req.user._id)) {
      return next(new ErrorResponse('No permission to edit this listing', 401));
    }

    await Listing.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true }, (err, doc) => {
      if (err) return next(new ErrorResponse(err, 500));

      return res.send({ status: true, message: 'Updated Listing Successfully', doc });
    });
  } catch (err) {
    next(new ErrorResponse(err, 500));
  }
});

//  @desc        Delete listing
//  @route       DELETE /user-actions/delete-listing/:id
//  @access      Public
router.delete('/delete-listing/:id', isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  try {
    await Listing.findByIdAndDelete(id, err => {
      if (err) return next(err);

      res.send({
        status: true,
        message: 'Deleted Listing Successfully',
      });
    });
  } catch (err) {
    next(err);
  }
});
