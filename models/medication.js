var mongoose=require('mongoose');

var MedicationSchema = new mongoose.Schema({
    AppointmentId:String,
    SubId:String,
    MedList:[{
        Name:String,
        Duration:Number,
        Quantity:{
            Breakfast:{
                Before:Number,
                After:Number
            },
            Lunch:{
                Before:Number,
                After:Number
            },
            Dinner:{
                Before:Number,
                After:Number
            }
        }
    }]
});

module.exports=mongoose.model('Medication',MedicationSchema);