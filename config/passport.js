var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    	User.findById(id, function(err, user) {
      	done(err, user);
    });
  });


module.exports = function(passport) {
	passport.use('user-login' , new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	} , function(req , email , password , done) {
		User.findOne({'email' : email}).then(function(user) {
			if(!user){
				return done(null , false , req.flash('error_msg' , 'User not Found'));
			}
			bcrypt.compare(password , user.password , function(err, isMatch) {
				if(err) throw err;
				if(isMatch){
					return done(null , user);
				}else{
					return done(null , false , req.flash('error_msg' , "Password Didn't Matched"));
				}
			});
		});
	}));
};