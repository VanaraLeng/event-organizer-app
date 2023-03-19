const path = require('path');
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'assets', 'photos'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.jpg');
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/jpeg') cb(null, true);
    else {
      cb(null, false);
      return cb(new Error('Only .jpg format is accepted'));
    }
  },
  limits: {
    fileSize: 5000000
  }
})

module.exports = multer({storage: storage});