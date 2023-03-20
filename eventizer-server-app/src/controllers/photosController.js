
async function uploadPhoto(req, res, next) {
  try {
    const result = [];
    req.files['photos'].forEach(file => result.push(file.filename));
    res.json({success: true, data: {result: result}});
  } catch (e) {
    next(e);
  }
}

module.exports = {
  uploadPhoto
}