const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');

const storage = new GridFsStorage({ url: process.env.MONGODB_URL });

const upload = multer({ storage });

module.exports = { upload };
