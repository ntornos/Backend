const router = require('express').Router();
const Listing = require('../../db/models/Listing');
const { isAdmin } = require('../auth/utils');

module.exports = router;

//  @desc        Create listing
//  @route       POST /admin/create-listing
//  @access      Private
router.post('/create-listing', isAdmin, (req, res, next) => {
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
//  @route       PUT /admin/update-listing/:id
//  @access      Private
router.put('/update-listing/:id', isAdmin, async (req, res, next) => {
  const { id } = req.params;

  try {
    // if the logged in userId doesn't match the userId on the current listing, it can't be edited. Unless it's an admin.
    const currListing = await Listing.findById(id);

    if (!(currListing.userId !== req.user._id)) {
      return res.send({ status: false, message: 'No permission to edit this listing' });
    }

    await Listing.updateOne({ _id: id }, { ...req.body }, (err, response) => {
      if (err) return next(err);

      return res.send({
        status: true,
        message: 'Updated Listing Successfully',
        response,
      });
    });
  } catch (e) {
    next(e);
  }
});

//  @desc        Delete listing
//  @route       DELETE /admin-actions/delete-listing/:id
//  @access      Public
router.delete('/delete-listing/:id', isAdmin, async (req, res, next) => {
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
