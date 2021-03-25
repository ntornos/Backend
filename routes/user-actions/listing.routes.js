const router = require('express').Router();

const Listing = require('../../db/models/Listing');
const { isLoggedIn } = require('../auth/utils');

module.exports = router;

//  @desc        Find all user listings
//  @route       GET /user-actions/find-all
//  @access      Private
router.get('/find-all', isLoggedIn, (req, res, next) => {
  try {
    Listing.find({ userId: req.user.id }, (err, listings) => {
      if (err) throw err;

      return res.send({ status: true, count: listings.length, data: listings });
    });
  } catch (err) {
    console.error(err);
  }
});

//  @desc        Find unarchived user listings
//  @route       GET /user-actions/find-unarchived
//  @access      Private
router.get('/find-unarchived', isLoggedIn, (req, res, next) => {
  try {
    Listing.find({ userId: req.user.id, archived: false }, (err, listings) => {
      if (err) throw err;

      return res.send({ status: true, count: listings.length, data: listings });
    });
  } catch (err) {
    console.error(err);
  }
});

//  @desc        Find archived user listings
//  @route       GET /user-actions/find-archived
//  @access      Private
router.get('/find-archived', isLoggedIn, (req, res, next) => {
  try {
    Listing.find({ userId: req.user.id, archived: true }, (err, listings) => {
      if (err) throw err;

      return res.send({ status: true, count: listings.length, data: listings });
    });
  } catch (err) {
    console.error(err);
  }
});

//  @desc        Create new listing
//  @route       POST /user-actions/create-listing
//  @access      Private
router.post('/create-listing', isLoggedIn, (req, res) => {
  const { title, subtitle, price, address, images, ameneties } = req.body;

  const { bathroomNum, bedroomNum, area } = ameneties;
  try {
    Listing.create(
      {
        title,
        subtitle,
        price,
        address,
        images,
        userId: req.user._id,
        ameneties: {
          bathroomNum,
          bedroomNum,
          area,
        },
      },
      async (err, listing) => {
        if (err) throw err;

        await listing.save();

        return res.send({
          status: true,
          message: 'Listing created',
          data: listing,
        });
      }
    );
  } catch (err) {
    console.error(err);
  }
});

//  @desc        Edit listing
//  @route       PUT /user-actions/update-listing/:id
//  @access      Private
router.put('/update-listing/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;

  try {
    // if the logged in userId doesn't match the userId on the current listing, it can't be edited. Unless it's an admin.
    const currListing = await Listing.findById(id);

    if (!(currListing.userId !== req.user._id)) {
      return res.send({ status: false, message: 'No permission to edit this listing' });
    }

    await Listing.updateOne({ _id: id }, { ...req.body }, (err, response) => {
      if (err) throw err;

      return res.send({
        status: true,
        message: 'Updated Listing Successfully',
        response,
      });
    });
  } catch (e) {
    console.error(e);
  }
});

//  @desc        Delete listing
//  @route       DELETE /user-actions/delete-listing/:id
//  @access      Public
router.delete('/delete-listing/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  try {
    await Listing.findByIdAndDelete(id, err => {
      if (err) throw error;

      res.send({
        status: true,
        message: 'Deleted Listing Successfully',
      });
    });
  } catch (err) {
    console.error(err);
  }
});
