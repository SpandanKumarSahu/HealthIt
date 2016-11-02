var mongoose= require('mongoose');
var Schema=mongoose.Schema;

var HistorySchema= new mongoose.Schema({
    SubId:{
        type:String,
        unique:true,
        required:true
    },
    AppointmentDate:Date
});

var AppointmentSchema= new mongoose.Schema({
    Id:{
        type:String,
        unique:true,
        required:true
    },
    Patient:String,
    Doctor:String,
    History:[{
        type:Schema.ObjectId,
        ref:'History'
    }],
    Cause:String,
    isActive:Boolean,
    Feedback:String
});

module.exports=mongoose.model('History',HistorySchema);
module.exports= mongoose.model('Appointment',AppointmentSchema);
