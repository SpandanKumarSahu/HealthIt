var Organisation=require('../models/organisation');
var Doctor=require('../models/doctor');
var Patient=require('../models/patient');
var Appointment=require('../models/appointment');
var uuid=require('node-uuid');
var jwt=require('jsonwebtoken');

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

exports.getPatientAppointments=function(req,res){
    var patient=req.value1._doc;
    var query=Appointment.find({})
        .where('Patient').equals(patient.Phone)
        .exec(function (err,appointments) {
            if(err)
                res.send(err);
            else{
                var result=[];
                var q=JSON.stringify(appointments);
                for(var i=0;i<q.length;i++){
                    var obj=q[i];
                    var doctor=Doctor.find({}).where('Phone').equals(obj.Doctor).select('Name Phone').exec(function (err,doctor) {
                        if(err) res.send(err);
                        else return doctor;
                    });
                    var last_date=q[i].History[q[i].History.length-1].AppointmentDate;
                    result.push({
                        "Name":doctor.Name,
                        "Phone":doctor.Phone,
                        "LastAppointment":last_date
                    });
                }
                res.json(result);
            }
        });
};

exports.getPatientAppointment=function(req,res){
    var patient=req.value1._doc;
    Appointment.find({})
        .where('Id').equals(req.param('AppointmentId'))
        .exec(function (err,appointments) {
            if(err) res.send(err);
            else res.json(appointments);
        });
};

exports.postAppointment=function(req,res){
    var patient=req.value1._doc;
    var appointment=new Appointment();
    appointment.Id=uuid.v4();
    appointment.Patient=patient.Phone;
    appointment.Doctor=req.param('Doctor');
    var history=new History();
    history.SubId=uuid.v4();
    history.AppointmentDate=new Date();
    appointment.History.push(history);
    appointment.Cause=req.param('Cause');
    appointment.isActive=true;
    appointment.Feedback="This is a moderately important appointment.";
    appointment.save(function (err) {
        if(err) res.send(err);
        else res.json({
            success:true
        })
    });
};

exports.addHistory=function (req,res) {
    var patient=req.value1._doc;
    var history=new History();
    history.SubId=uuid.v4();
    history.AppointmentDate=new Date();
    Appointment.find({}).where('Id').equals(req.param('AppointmentId')).exec(function (err,appointment) {
        if(err)
            res.send(err);
        else{
            appointment.History.push(history);
            appointment.save(function (err) {
                if(err)
                    res.send(err);
                else res.json({success:true});
            })
        }
    });
};

exports.giveFeedback=function (req,res) {
    var patient=req.value1._doc;
    Appointment.find({}).where('Id').equals(req.param('AppointmentId')).exec(function (err,appointment) {
        if(err) res.send(err);
        else{
            appointment.Feedback=req.param("Feedback");
            appointment.save();
            res.json({
                success:true
            })
        }
    });
};
