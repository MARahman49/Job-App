var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport=require('passport');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/JobApp',{useMongoClient: true});

var index = require('./routes/index');
var company = require('./routes/company');
var jobs = require('./routes/jobs');
require('./config/passport')(passport);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Flash message middleware
app.use(session({
    secret: 'Secret',
    resave: true,
    saveUninitialized: true,
  }));

  //passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  
  //Set Global Variable
  app.use(function(req,res,next){
    res.locals.sucess_msg=req.flash('sucess_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user||null
    next();
  });


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//cookie parser middleware
app.use(cookieParser());

//Static Files
app.use(express.static(path.join(__dirname, 'public')));


//routes
app.use('/', index);
app.use('/company', company);
app.use('/jobs', jobs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
