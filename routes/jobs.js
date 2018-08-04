var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Job = require('../models/Job');

/* GET home page. */

router.get('/', isLoggedIn , function(req, res, next) {	
  Job.find({}).then(function(Jobs) {
  	res.render('jobs' , {"Jobs" : Jobs});
  });
});


router.get('/:id/apply' , isLoggedIn , function(req , res , next) {
	var Candidate = { 
		Name : req.user.FirstName +" "+req.user.LastName,
		Email : req.user.email,
			Status : "Applied" // status will be updated later 
		};
	var id = req.params.id;
    Job.findOne({_id : id}).then(function(Job) {
        Job.Applicants.push(Candidate);
        Job.save().then(function(Job){
		req.flash('sucess_msg' , 'Applied Sucessfully');
        	res.redirect('/jobs');
        });
    });
 });


//User Jobs
router.get('/:Name/job' , isLoggedIn , function(req , res , next) {
	Job.find({}).then(function(Job) {
			res.render('UserJobs',{
            "Job" :Job
		});
	});
});


function isLoggedIn(req , res , next) {
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash('error_msg' , "Please Log In");
		res.redirect('/login')
	}
}
module.exports = router;
