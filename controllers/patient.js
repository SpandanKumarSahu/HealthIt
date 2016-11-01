var Organisation=require('../models/organisation');
var Doctor=require('../models/doctor');
var Patient=require('../models/patient');
var jwt=require('jsonwebtoken')

exports.postPatient= function(req,res){
    var patient = new Patient();
    patient.Name=req.param('Name');
    patient.BloodGroup=req.param('BloodGroup');
    patient.Address=req.param('Address');
    patient.ImgLink=req.param('ImgLink');
    patient.Email=req.param('Email');
    patient.Phone=req.param('Phone');
    patient.Password=req.param('Password');
    patient.EmergencyContact=req.param('EmergencyContact');
    patient.DOB=req.param('DOB');
    var token=jwt.sign(patient, patient.Password, {
        expiresIn: 86400  //expires in 2 months.
    });
    patient.Token=token;
    patient.save(function (err) {
        if(err)
            res.json({
                message:'Unsuccessful'
            });
        else
            res.json({
                message:'Successful',
                token:token
            });
    });
};

exports.getPatientToken= function (req,res) {
    Patient.findOne({
        Phone:req.param('Phone')
    }, function (err, patient) {
        if (err)
            throw err;
        if (!patient) {
            res.json({
                success: false,
                message: 'User Not Registered'
            })
        }
        else if (patient) {
            patient.verifyPassword(req.param('Password'), function (err, isMatch) {
                if (err)
                    res.json({
                        success: false,
                        message: 'Error'
                    });
                else if (isMatch) {
                    var token=patient.Token;
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

exports.putPatientResign=function (req, res) {
    Doctor.findOne({Phone:req.param('Phone')}, function (err, doctor) {
        if(err)
            res.send(err);
        else{
            doctor.Verified=!(doctor.Verified);
            doctor.Organisation=req.param('Organisation');
        }
    });
};


