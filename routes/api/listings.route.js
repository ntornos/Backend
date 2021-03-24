const router = require('express').Router();
const Listing = require('../../db/models/Listing');

module.exports = router;

router.post('/', (req, res) => {
  const {
    title,
    subtitle,
    price,
    address,
    images,
    userId,
    ameneties,
  } = req.body;

  const { bathroomNum, bedroomNum, area } = ameneties;

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
      if (err) {
        return res.send({
          status: false,
          message: 'Listing not created',
          error: err,
        });
      }
      await listing.save();
      return res.send({
        status: true,
        message: 'Listing created',
        data: listing,
      });
    }
  );
});

router.get('/', async (req, res) => {
  console.log(req.body);

  const allListings = await Listing.find();
  if (allListings) {
    return res.send({
      status: true,
      message: 'All listings',
      data: allListings,
    });
  } else {
    return res.send({
      status: false,
      message: 'No listings to show',
    });
  }
});

router.get('/:id/edit', async (req, res) => {
  const { id } = req.params;
  await Listing.findById(id, (err, listing) => {
    if (err) {
      throw error;
    } else {
      res.send({
        status: true,
        message: 'Retrieved Edit Form Data',
        data: listing,
      });
    }
  });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const listingUpdates = { ...req.body.data };
  const options = { new: true, useAndModify: false };
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      listingUpdates,
      options
    );
    res.send({
      status: true,
      message: 'Updated Listing Successfully',
      data: updatedListing,
    });
  } catch (e) {
    throw error;
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await Listing.findByIdAndDelete(id, (err, listing) => {
    if (err) {
      throw error;
    } else {
      res.send({
        status: true,
        message: 'Deleted Listing Successfully',
        data: listing,
      });
    }
  });
});
