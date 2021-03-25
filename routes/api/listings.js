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
