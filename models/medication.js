var mongoose=require('mongoose');

var MedicationSchema = new mongoose.Schema({
    AppId:mongoose.Types.ObjectId,
    SubId:mongoose.Types.ObjectId,
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