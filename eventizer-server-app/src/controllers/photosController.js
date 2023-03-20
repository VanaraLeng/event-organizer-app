const { S3_BUCKET } = require('../../configs.json');
const { s3 } = require('../utils/setupMulter');

const {GetObjectCommand} = require('@aws-sdk/client-s3');

async function uploadPhoto(req, res, next) {
  try {
    res.json({ success: true, data: { result: req.file.key } });
  } catch (e) {
    next(e);
  }
}

function getObject(Bucket, Key) {
  return new Promise(async (resolve, reject) => {
    const getOjectCommand = new GetObjectCommand({Bucket, Key});
    try {
      const res = await s3.send(getOjectCommand);
      let resDataChunks = [];
      res.Body.once('error', err => reject(err));
      res.Body.on('data', chunk => resDataChunks.push(chunk));
      res.Body.once('end', () => resolve(resDataChunks.join('')));
    } catch(e) {
      return reject(e);
    }
  })
}

async function getPhoto(req, res, next) {
  try {
    const { photo_key } = req.params;
    getObject(S3_BUCKET, photo_key).then(data => res.send(data));
  } catch (e) {
    next(e);
  }
}

module.exports = {
  uploadPhoto,
  getPhoto
}