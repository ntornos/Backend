const router = require('express').Router();

const Listing = require('../../db/models/Listing');
const ErrorResponse = require('../../utils/errorResponse');

module.exports = router;

//  @desc        Search Listing by sector
//  @route       GET /public-actions/search-listings/:sectorName
//  @access      Public
router.get('/search-listings/:sectorName', async (req, res, next) => {
  // console.log('ROUTEEEEE');
  // const { sectorName } = req.params;
  // console.log(req.params);
  // let decodedURI = decodeURIComponent(req.params.sectorName);

  // console.log(decodedURI, 123);

  try {
    await Listing.find(
      { address: 'Bella Vista, Santo Domingo, Dominican Republic' },
      (err, docs) => {
        if (err) return next(new ErrorResponse(err, 500));

        if (docs.length)
          return res.send({ status: true, message: `All listings for ${sectorName}`, data: docs });

        return res.send({ status: true, message: `No listings for ${sectorName}` });
      }
    );
  } catch (err) {
    next(new ErrorResponse(err, 500));
  }
});
