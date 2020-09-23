const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');

const mongooseConnection = mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const storage = new GridFsStorage({ db: mongooseConnection });

module.exports = storage;
