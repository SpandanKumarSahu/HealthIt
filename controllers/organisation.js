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

exports.checkWorking=function(req,res){
    console.log('Hello');
    var ans=req.value1._doc;
    console.log(ans.Phone);
    var query=Organisation.find({})
        .where('Phone',ans.Phone)
        .select('Name Phone');
    query.exec(function (err,organisation) {
        if(err)
            res.send(err);
        else res.json(organisation);
    })
};

exports.getOrganisationDoctors=function (req, res) {
    var organisation=req.value1._doc;
    var query=Doctor.find({});
    query.where('Organisation').equals(organisation.Name)
        .select('Name Specialisation Phone');
    query.exec(function (err,doctors) {
        if(err)
            res.send(err);
        else
            res.json(doctors);
    });
};

exports.getOrganisationDoctor=function(req,res){
    var orgaisation= req.value1._doc;
    var query=Doctor.find({});
    query.where('Organisation').equals(orgaisation.Name)
        .where('Phone').equals(orgaisation.Phone);
    query.exec(function (err, doctor) {
        if(err)
            res.send(err);
        else res.json(doctor);
    })
};

exports.verifyOrganisationDoctor=function (req,res) {
    var organisation = req.value1._doc;
    var query = Doctor.find({});
    query.where('Organisation').equals(organisation.Name)
        .where('Phone').equals(req.param('Phone'));
    query.exec(function (err, doctor) {
        doctor.Verified = !doctor.Verified;
        doctor.save(function (err) {
            if (err)
                res.send(err);
            else res.json({
                success: true
            })
        })
    });
};



