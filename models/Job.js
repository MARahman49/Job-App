var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

const JobSchema = new Schema({
	JobName : { type: String, required : true},
	JobType : { type: String, required : true},
	JobLocation : { type: String, required : true},
	JobSalary: { type: String, required : true},
	PostedBy: { type: String, required : true},
	Applicants : [{
		Name : {type : String , require : true},
		Email : {type : String , require : true},
		Status : {type : String , default : "Applied"}
	}],
	Posted_at: {type : Date ,  default: Date.now()}
} , {
	collection: 'Job'
});


var Job = mongoose.model('Job' , JobSchema);

module.exports = Job;