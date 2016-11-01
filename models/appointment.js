var mongoose= require('mongoose');
var Schema=mongoose.Schema;

var HistorySchema= new mongoose.Schema({
    SubId:{
        type:Schema.Types.ObjectId,
        unique:true
    },
    AppointmentDate:Date
});

var AppointmentSchema= new mongoose.Schema({
    Id:{
        type:mongoose.Types.ObjectId,
        unique:true
    },
    PatientId:mongoose.Types.ObjectId,
    DoctorId:mongoose.Types.ObjectId,
    History:[History],
    Cause:String,
    isActive:Boolean,
    Feedback:String
});

module.exports=mongoose.model('History',HistorySchema);
module.exports= mongoose.model('Appointment',AppointmentSchema);
