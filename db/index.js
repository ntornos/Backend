const mongoose = require('mongoose');

const connectDb = () => {
  mongoose.connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    () => console.log('Connected to db successfully')
  );
};

module.exports = connectDb;
