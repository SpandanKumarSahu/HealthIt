var mongoose= require('mongoose');
var bcrypt=require('bcrypt-nodejs');

var PatientSchema= new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Email:String,
    Phone:{
        type:String,
        required:true,
        unique:true
    },
    EmergencyContact:Number,
    Address:String,
    BloodGroup:String,
    DOB:Date,
    ImgLink:String,
    Password:{
        type:String,
        required:true
    },
    Token:String
});


PatientSchema.pre('save',function (cb) {
    var user=this;
    if(!user.isModified('Password')) return cb();
    bcrypt.genSalt(5,function (err,salt) {
        if(err)
            return cb(err);
        bcrypt.hash(user.Password, salt, null, function(err, hash) {
            if (err) return callback(err);
            user.Password = hash;
            cb();
        });
    });
});

PatientSchema.methods.verifyPassword=function (password,cb) {
    bcrypt.compare(password,this.Password,function (err,isMatch) {
        if(err)
            return cb(err);
        return cb(null,isMatch);
    });
};


module.exports= mongoose.model('Patient',PatientSchema);