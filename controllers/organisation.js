var Organisation=require('../models/organisation');
var Doctor=require('../models/doctor');
var Patient=require('../models/patient');
var jwt=require('jsonwebtoken');


exports.postOrganisation= function(req,res){
    var organisation = new Organisation();
    organisation.Name=req.param('Name');
    organisation.DOJ=new Date();
    organisation.Certificate=req.param('Certificate');
    organisation.ImgLink=req.param('ImgLink');
    organisation.Email=req.param('Email');
    organisation.Phone=req.param('Phone');
    organisation.Password=req.param('Password');
    var token=jwt.sign(organisation, organisation.Password, {
        expiresIn: 86400  //expires in 2 months.
    });
    organisation.Token=token;
    organisation.save(function (err) {
        if(err)
            res.json({
                success:false
            });
        else
            res.json({
                success:true,
                Token:token
            });
    });
};

exports.getOrganisationToken= function (req,res) {
    Organisation.findOne({
        Name:req.param('Name')
    }, function (err, organisation) {
        if (err)
            throw err;
        if (!organisation) {
            res.json({
                success: false,
                message: 'User Not Registered'
            })
        }
        else if (organisation) {
            organisation.verifyPassword(req.param('Password'), function (err, isMatch) {
                if (err)
                    res.json({
                        success: false,
                        message: 'Error'
                    });
                else if (isMatch) {
                    var token=organisation.Token;
                    res.json({
                        success: true,
                        message: 'Successful Login',
                        Token: token
                    });
                }
                else {
                    res.json({
                        success: false,
                        message: 'Password Incorrect'
                    });
                }
            });
        }
    });
};

exports.checkWorking=function(req,res,decoded){
    console.log('Hello');
    var ans=req.value1;
    console.log(ans);
    console.log('same shit!');
    res.json(decoded);
};

exports.getOrganisationDoctors=function (req, res, decoded) {
    var query=Doctor.find({});
    query.where('Organisation',decoded._doc.Organisation);
    query.exec(function (err,doctors) {
        if(err)
            res.send(err);
        else
            res.json(doctors);
    });
};

exports.verifyOrganisationDoctors=function(req,res){
    Doctor.findOne({Organisation:req.param('Id')},function (err, doctor) {
        if(err)
            res.send(err);
        else{
            doctor.Verified=!(doctor.Verified);
            doctor.save(function (err) {
                if(err)
                    res.json({
                        success:false
                    });
                else
                    res.json({
                        success:true
                    });
            });
        }
    });
};


