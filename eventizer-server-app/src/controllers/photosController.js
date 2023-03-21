const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../utils/setupMulter');

async function uploadPhoto(req, res, next) {
  try {
    res.json({ success: true, data: { result: req.file.key } });
  } catch (e) {
    next(e);
  }
}

function getObject(Bucket, Key) {
  return new Promise(async (resolve, reject) => {
    const getOjectCommand = new GetObjectCommand({ Bucket, Key });
    try {
      const res = await s3.send(getOjectCommand);
      resolve(res.Body.transformToByteArray());
    } catch (e) {
      reject(e);
    }
  })
}

async function getPhoto(req, res, next) {
  const { photo_key } = req.params;
  getObject(process.env.S3_BUCKET, photo_key)
    .then(data => {
      res.writeHead(200, { "Content-Type": 'image/jpeg, image/png' });
      res.write(data, 'binary');
      res.end(null, 'binary');
    })
    .catch(e => {
      res.json({success: false, message: "no image found"});
    });
}

module.exports = {
  uploadPhoto,
  getPhoto
}