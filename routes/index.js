var express = require('express');
var router = express.Router();
const User = require('../models/user');
var passport = require('passport');

/* GET home page. */
router.get('/', isLoggedout , function(req, res, next) {
  res.render('index');
});

/* GET Login page. */
router.get('/login', isLoggedout , function(req, res, next) {
  res.render('UserLogin', { errors : [] });
});

/* POST Login page. */
router.post('/login', passport.authenticate('user-login', {
	successRedirect : '/home',
	failureRedirect : '/login',
	failureFlash : true
}));
/* GET Signup page. */
router.get('/signup', isLoggedout , function(req, res, next) {
  res.render('UserSignup', {errors : [] });
});

/* Post Signup page. */

router.post('/signup', function(req, res, next) {

	var FirstName = req.body.FirstName;
	var LastName = req.body.LastName;
	var email = req.body.email;
	var password = req.body.password;
	var confirm = req.body.confirm;

	let errors = [];

	if (!FirstName) {
		errors.push('First Name Required');
	}if (!LastName) {
		errors.push('Last Name Required');
	}if (!email) {
		errors.push('Email Required');
	}if (!password) {
		errors.push('Password Required');
	}if (!confirm) {
		errors.push('Confirm Password Required');
	}if (confirm) {
		if(confirm!=password){
		errors.push("Password didn't Marched");
		}
	}if(errors.length > 0){
		res.render('UserSignup', {errors : errors });
	}else{
		User.findOne({'email' : email}).then(function(user) {
			if(user){
				req.flash('error_msg' , 'Email Already Exist');
				res.redirect('/signup');
			}else{
				var user = new User({
					FirstName : FirstName,
					LastName : LastName,
					email : email , 
					password : password
				});
				user.save().then(function(result){
			        req.flash('sucess_msg' , 'Registration Sucessfull');
					res.redirect('/login')
			     
				}).catch(function(err) {
					res.send(err);
				});
			}
		});
	}
});

router.get('/home', isLoggedIn ,  function(req, res, next) {
  res.render('home');
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('sucess_msg','Logout Successfully');
    res.redirect('/login')
});

function isLoggedIn(req , res , next) {
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash('error_msg' , "Please Log In");
		res.redirect('/login')
	}
}

function isLoggedout(req , res , next) {
	if(!req.isAuthenticated()){
		return next();
	}else{
		req.flash('error_msg' , "you Need Log Out First");
		res.redirect('/home')
	}
}
module.exports = router;
