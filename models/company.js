var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

const CompanySchema = new Schema({
	Name : {type : String , required: true},
	email : {type: String , unique: true , required : true, dropDups :true},
	Location : {type : String , required : true},
    Industry : {type : String , required : true},
	Creator : {type : String , required : true},
	Created_at: {type : Date ,  default: Date.now()}
} , {
	collection: 'Company'
});


var Company = mongoose.model('Company' , CompanySchema);

module.exports = Company;