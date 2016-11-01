var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');
//Define the Schema

var OrganisationSchema= new mongoose.Schema({
    Name: {
        type:String,
        unique:true,
        required:true
    },
    DOJ:Date,
    Certificate: {
        type:Number,
        unique:true,
        required:true
    },
    ImgLink:String,
    Email:String,
    Phone:Number,
    Password:{
        type:String,
        required:true
    },
    Token:String
});

OrganisationSchema.pre('save',function (cb) {
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

OrganisationSchema.methods.verifyPassword=function (password,cb) {
    bcrypt.compare(password,this.Password,function (err,res) {
        if(err)
            return cb(err,res);
        else
            return cb(null,res);

    });
};

module.exports=mongoose.model('Organisation', OrganisationSchema);