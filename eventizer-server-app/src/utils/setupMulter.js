const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer')
const multerS3 = require('multer-s3');
const { S3_REGION, S3_BUCKET, ACCESS_KEY, SECRET_ACCESS_KEY } = require('../../configs.json');

const s3 = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
  }
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + path.extname(file.originalname));
    },

  })
});

module.exports = {
  s3,
  upload
}
