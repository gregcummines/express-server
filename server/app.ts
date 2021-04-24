import * as express from 'express';

const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const cors = require('cors');
const WebSocket = require('ws');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const controller = require('./controller.js');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
const pinsRouter = require('./routes/pins');
const commandCenterRouter = require('./routes/command-center');

app.use('/pins', pinsRouter);
app.use('/command-center', commandCenterRouter);



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
  res.json({ error: 'error'});
});

module.exports = app;
