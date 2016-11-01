var Organisation=require('../models/organisation');
var Doctor=require('../models/doctor');
var Patient=require('../models/patient');
var jwt=require('jsonwebtoken');
var uuid=require('node-uuid');

exports.postDoctor= function(req,res){
    var doctor = new Doctor();
    doctor.Name=req.param('Name');
    doctor.Qualification=req.param('Qualification');
    doctor.Specialisation=req.param('Specialisation');
    doctor.ImgLink=req.param('ImgLink');
    doctor.Email=req.param('Email');
    doctor.Phone=req.param('Phone');
    doctor.Password=req.param('Password');
    doctor.Verified=false;
    doctor.Schedule=req.param('Schedule');
    doctor.Organisation=req.param('Organisation');
    var token=jwt.sign(doctor,doctor.Password,{
        expiresIn: 86400
    });
    doctor.Token=token;
    doctor.save(function (err) {
        if(err)
            res.json({
                success:false
            });
        else
            res.json({
                success:true,
                token:token
            });
    });
};

exports.getDoctorToken= function (req,res) {
    Doctor.findOne({
        Phone:req.param('Phone')
    }, function (err, doctor) {
        if (err)
            throw err;
        if (!doctor) {
            res.json({
                success: false,
                message: 'User Not Registered'
            })
        }
        else if (doctor) {
            doctor.verifyPassword(req.param('Password'), function (err, isMatch) {
                if (err)
                    res.json({
                        success: false,
                        message: 'Error'
                    });
                else if (isMatch) {
                    var token =doctor.Token;
                    res.json({
                        success: true,
                        message: 'Successful Login',
                        token: token
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

exports.getDoctorPatients=function (req, res) {
    Patient.find({Doctor:req.param('Id')},function (err, patients) {
        if(err)
            res.send(err)
        else
            res.json(patients);
    });
};

exports.DoctorResign=function (req, res) {
    Doctor.findOne({Phone:req.param('Phone')}, function (err, doctor) {
        if(err)
            res.send(err);
        else{
            doctor.Verified=!(doctor.Verified);
            doctor.Organisation=req.param('Organisation');
        }
    });
};


