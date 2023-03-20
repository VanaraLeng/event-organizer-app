// dependencies
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const usersRouter = require('./src/routes/usersRouter');
const eventsRouter = require('./src/routes/eventsRouter');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('./src/utils/error');
const upload = require('./src/utils/setupMulter');
const { uploadPhoto } = require('./src/controllers/photosController');

// initialisations
const app = express();
(async function () {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/eventizer')
    console.log('connected to db');
  } catch (e) {
    console.log('fail to connect to db');
    console.log(e);
  }
})();

// configs
app.disable('x-powered-by');

// middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/api/photos', express.static(path.join(__dirname, 'assets', 'photos')));

// routers
app.post('/api/photos', upload.fields([{ name: 'photos', maxCount: 3 }]), uploadPhoto);
app.use('/api/users', usersRouter);
app.use('/api/events', eventsRouter);

app.all('*', (req, res, next) => {
  next(new NotFoundError("api not found"));
});

// error handling
app.use((err, req, res, next) => {
  let status = 500;
  if (err instanceof BadRequestError) status = 400;
  if (err instanceof UnauthorizedError) status = 401;
  if (err instanceof NotFoundError) status = 404;
  res.status(status).json({ success: false, message: err.message });
});

// bootup
app.listen(3000, () => console.log("server is running"));

// disconnect from db
process.on('exit', () => mongoose.disconnect());