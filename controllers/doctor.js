var Organisation=require('../models/organisation');
var Doctor=require('../models/doctor');
var Patient=require('../models/patient');
var Appointment=require('../models/appointment');
var Medication=require('../models/medication');
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

exports.getDoctorAppointments=function(req,res){
    var doctor=req.value1._doc;
    var query=Appointment.find({});
    query.where('Doctor').equals(doctor.Phone)
        .exec(function (err,appointments) {
            if(err)
                res.send(err);
            else{
                var result=[];
                var q=JSON.stringify(appointments);
                for(var i=0;i<q.length;i++){
                    var obj=q[i];
                    var patient=Patient.find({}).where('Phone').equals(obj.Patient).select('Name Phone').exec(function (err,patient) {
                        if(err) res.send(err);
                        else return patient;
                    });
                    var last_date=q[i].History[q[i].History.length-1].AppointmentDate;
                    result.push({
                        "Name":patient.Name,
                        "Phone":patient.Phone,
                        "AppointmentId":q[i].AppointmentId,
                        "LastAppointment":last_date
                    });
                }
                res.json(result);
            }
        });
};

exports.getDoctorAppointment=function(req,res){
    var doctor=req.value1._doc;
    var patient=req.param('Phone');
    var query=Appointment.find({}).where('Id').equals(req.param('AppointmentId'))
        .exec(function (err,appointments) {
            if(err) res.send(err);
            else res.json(appointments);
        });
};

exports.addMedication=function(req,res){
    var doctor=req.value1._doc;
    var med=new Medication();
    med.AppointmentId=req.param('AppointmentId');
    med.SubId=req.param('SubId');
    var MedList=req.param('MedList');
    MedList=JSON.stringify(MedList);
    for(var i=0;i<MedList.length;i++){
        var obj=MedList[i];
        med.MedList.push(obj);
    }
    med.save(function (err) {
        if(err) res.send(err);
        else res.json({
            success:true
        })
    });
};

exports.getDoctorPatients=function(req,res){
    var doctor=req.value1._doc;
    Patient.find({}).where('Doctor').equals(doctor.Phone)
        .select('Phone Name Cause')
        .exec(function (err,patients) {
            if(err) res.send(err);
            else res.json(patients);
        });
};

exports.getDoctorPatient=function (req,res) {
    var doctor=req.value1._doc;
    var patient=Patient.find({}).where('Patient').equals(req.param('Phone')).exec(function (err,patient) {
        if(err) res.send(err);
        else return patient;
    });
    Appointment.find({}).where('Patient').equals(patient.Phone).select('History Cause isActive')
        .exec(function (err, appointments) {
            if(err)
                res.send(err);
            else res.json(appointments);
        });
};
