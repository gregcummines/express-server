const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config');
const cors = require('cors');
const pinsRouter = require('./routes/pins');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.set('view engine', 'html');

app.use('/pins', pinsRouter);

function getRoot(request, response) {
  response.sendFile(path.resolve('../app/dist/automation/index.html'));
}

function getUndefined(request, response) {
  response.sendFile(path.resolve('../app/dist/automation/index.html'));
}

// Note the dot at the beginning of the path
app.use(express.static('../app/dist/automation'));

app.get('/', getRoot);
app.get('/*', getUndefined);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
