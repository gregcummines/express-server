var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const config = require('./config');
//const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

var pinsRouter = require('./routes/pins');

var app = express();

/* console.log("Connecting to MongoDB...");

MongoClient.connect(`mongodb://${config.dbHost}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(client => {
    const db =  client.db(config.dbName);
    const collection = db.collection(config.dbCollection);
    app.locals[config.dbCollection] = collection;
    console.log(app.locals[config.dbCollection]);
  })
  .catch(error => console.error(error)); 
 */
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

/* app.use((req, res, next) => {
  const collection = req.app.locals[config.dbCollection];
  console.log(collection);
  req.collection = collection;
  next();
}); */

app.use('/pins', pinsRouter);

function getRoot(request, response) {
  response.sendFile(path.resolve('../app/dist/automation/index.html'));
}

function getUndefined(request, response) {
  response.sendFile(path.resolve('../app/dist/automation/index.html'));
}

// Note the dot at the beginning of the path
app.use(express.static(process.cwd()+'../app/dist/automation'));

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
