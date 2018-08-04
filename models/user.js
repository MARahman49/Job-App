var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

const UserSchema = new Schema({
	FirstName : {type : String , required: true},
	LastName : {type : String , required: true},
	email : {type: String , unique: true , required : true, dropDups :true},
    isVerified: { type: Boolean, default: false },
	password : {type : String , required : true},
	Created_at: {type : Date ,  default: Date.now()}
} , {
	collection: 'user'
});

UserSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            });
            
        });
    }else{
        next();
    }
});

var User = mongoose.model('User' , UserSchema);

module.exports = User;