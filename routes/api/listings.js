const router = require('express').Router();
const Listing = require('../../db/models/Listing');

module.exports = router;

//  @desc        Find all listings
//  @route       GET /api/listings
//  @access      Public
router.get('/', (req, res) => {
  try {
    Listing.find((err, listings) => {
      if (err) throw err;

      if (listings.length) {
        return res.send({
          status: true,
          message: 'All listings',
          data: listings,
        });
      }

      return res.send({
        status: false,
        message: 'No listings to show',
      });
    });
  } catch (err) {
    console.error(err);
  }
});

//  @desc        Create new listing
//  @route       POST /api/listings
//  @access      Public
router.post('/', (req, res) => {
  const { title, subtitle, price, address, images, userId, ameneties } = req.body;

  const { bathroomNum, bedroomNum, area } = ameneties;
  try {
    Listing.create(
      {
        title,
        subtitle,
        price,
        address,
        images,
        userId,
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
//  @route       PUT /api/listings/:id
//  @access      Public
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const listingUpdates = { ...req.body.data };
  const options = { new: true, useAndModify: false };

  try {
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
//  @route       DELETE /api/listings/:id
//  @access      Public
router.delete('/:id', async (req, res) => {
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
