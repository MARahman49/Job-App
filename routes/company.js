var express = require('express');
var router = express.Router();
const Company = require('../models/company');
const Job = require('../models/Job');
var passport = require('passport');

/*  GET Index Page with users company*/

router.get('/',  isLoggedIn ,  function(req, res, next) {
	Company.find({'Creator': req.user.id}).then(function(companies) {
		res.render('Company', { "Companies" : companies });
	});
});


/* GET register page. */
router.get('/register',  isLoggedIn ,  function(req, res, next) {
  res.render('CompanySignup', { errors : [] });
});

/* Post register page. */
router.post('/register',  isLoggedIn ,  function(req, res, next) {
	var CompanyName = req.body.CompanyName;
	var email = req.body.Companyemail;
	var Location = req.body.CompanyLocation;
	var industry = req.body.CompanyType;
	let errors = [];
	if (!CompanyName) {
		errors.push('Company Name Required');
	}if (!email) {
		errors.push('Email Required');
	}if(!Location){
		errors.push("Company Location Required");
	}if(!industry){
		errors.push("Company Type Required");
	}
	if(errors.length > 0){
		res.render('CompanySignup', {errors : errors });
	}else{
		Company.findOne({'Name' : CompanyName}).then(function(user) {
			if(user){
				req.flash('error_msg' , 'Name Already Exist');
				res.redirect('/company/register');
			}else{
				var company = new Company({
					Name : CompanyName,
					email : email,
					Location : Location,
					Industry : industry,
					Creator : req.user.id,
				});
				company.save().then(function(result){
					req.flash('sucess_msg' , 'New Company Registration Sucessfull');
					res.redirect('/company')
				}).catch(function(err) {
					res.send(err);
				});
			}
		});
	}
});



/*    Get company by name*/

router.get('/:name' , isLoggedIn , function(req , res , next) {
    Company.findOne({Name : req.params.name}).then(function(Company) {
		Job.find({PostedBy : req.params.name}).then(function(Jobs) {
			res.render('dashboard',{
            "Company" : Company ,
            "Jobs" :Jobs
		});
	});
	});
});

router.post('/:id' , function(req , res , next) {
  Company.remove({_id : req.params.id} , function(err) {
    if(err) throw err;
    req.flash('sucess_msg' , 'Company Deleted Sucessfull');
    res.redirect('/company');
  });
});
//Get Company Job Page
router.get('/:name/Job' , isLoggedIn , function(req , res , next) {
	var name = req.params.name;
   Job.find({PostedBy : name}).then(function(Jobs) {
			res.render('dashboard',{
            "Company" : Company ,
            "Jobs" :Jobs
		});
			console.log(Company);
	});
});

//Get Add Job Page
router.get('/:name/Addjob' , isLoggedIn , function(req , res , next) {
	var name = req.params.name;
    Company.findOne({Name : name}).then(function(Company) {
			res.render('AddJobs',{
            "Company" : Company ,
		});
	});
});

/* Post a Job */
router.post('/:name/Addjob' , isLoggedIn , function(req , res , next) {
   	var Jobname = req.body.JobName;
	var Jobtype = req.body.JobType;
	var JobLoc = req.body.JobLocation;
	var Salary = req.body.Salary;
	var name = req.params.name;
	var job = new Job({
		JobName : Jobname,
		JobType : Jobtype,
		JobLocation : JobLoc,
		JobSalary: Salary,
		PostedBy: name,
	});
	job.save().then(function(result) {
	req.flash('sucess_msg' , 'Job Added Sucessfull');
		res.redirect('/company' );
	});
});

/* Delete Job */
router.post('/:name/:id' , function(req , res , next) {
  Job.remove({_id : req.params.id} , function(err) {
    if(err) throw err;
    req.flash('sucess_msg' , 'Job Deleted Sucessfull');
    res.redirect('/company');
  });
});


/* Job Page */
router.get('/:name/:id' , isLoggedIn , function(req , res , next) {
		Job.find({_id : req.params.id}).then(function(Job) {
			res.render('Applications',{
            "Company" : Company ,
            "job" :Job
		});
	});
});

//Update Status

router.get('/:name/edit/:id/status' , isLoggedIn , function(req , res , next) {
	Job.Applicants.find({Email : req.params.Email}).then(function(Job) {
			res.render('Status',{
            "Company" : Company ,
            "job" :Job
		});
	});
});

router.put('/:name/edit/:id/status', isLoggedIn ,function(req , res , next) {
    var id=req.params.id;
    Job.findOne({_id:id}).then(function(Job) {
    	Job.findOne({_id : id}).then(function(Job) {
        Applicants.Name = req.body.Name;
        Applicants.Email = req.body.Email;
        Applicants.Status = req.body.Status;
        Job.save().then(function(job){
            req.flash('sucess_msg','Status Update Sucessfully')
            res.redirect('/:name/:id')
        }).catch((err)=>{
            req.send(err);
        });
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
