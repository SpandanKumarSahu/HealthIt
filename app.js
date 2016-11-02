var express=require('express');
var app=express();
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var jwt=require('jsonwebtoken');
var config=require('./config');
var DoctorController=require('./controllers/doctor');
var OrganisationController=require('./controllers/organisation');
var PatientController=require('./controllers/patient');
var passport=require('passport');


var port= process.env.PORT || 7000;
app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());
var router=express.Router();

mongoose.connect(config.database);

app.listen(port);
app.use('/api',router);

router.get('/',function(req,res){
    res.json({
        message: 'Connected'
    });
});

router.route('/organisation/signup')
    .post(OrganisationController.postOrganisation);
router.route('/doctor/signup')
    .post(DoctorController.postDoctor);
router.route('/patient/signup')
    .post(PatientController.postPatient);
router.route('/organisation/signin')
    .get(OrganisationController.getOrganisationToken);
router.route('/doctor/signin')
    .get(DoctorController.getDoctorToken);
router.route('/patient/signin')
    .get(PatientController.getPatientToken);


var OrganisationRouter=new express.Router();
var PatientRouter= new express.Router();
var DoctorRouter= new express.Router();
app.use('/authenticate/organisation',OrganisationRouter);
app.use('/authenticate/doctor',DoctorRouter);
app.use('/authenticate/patient',PatientRouter);
var auth=function (req,res,next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.param('Token');
    if(token){
        jwt.verify(token, req.param('Password'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.value1=decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};
OrganisationRouter.use(auth);
DoctorRouter.use(auth);
PatientRouter.use(auth);


OrganisationRouter.route('/getOrganisationDoctors')
    .get(OrganisationController.getOrganisationDoctors);
OrganisationRouter.route('/getOrganisationDoctor')
    .get(OrganisationController.getOrganisationDoctor);
OrganisationRouter.route('/verifyOrganisationDoctor')
    .get(OrganisationController.verifyOrganisationDoctor);

// Don't forget to delete this piece of code.
OrganisationRouter.route('/checkWorking')
    .get(OrganisationController.checkWorking);

DoctorRouter.route('/getDoctorAppointments')
    .get(DoctorController.getDoctorAppointments);
DoctorRouter.route('/getDoctorAppointment')
    .get(DoctorController.getDoctorAppointment);
DoctorRouter.route('/addMedication')
    .post(DoctorController.addMedication);
DoctorRouter.route('/getPatients')
    .get(DoctorController.getDoctorPatients);
DoctorRouter.route('/getPatientHistory')
    .get(DoctorController.getDoctorPatient);

PatientRouter.route('/getPatientAppointments')
    .get(PatientController.getPatientAppointments);
PatientRouter.route('/getPatientAppointment')
    .get(PatientController.getPatientAppointment);
PatientRouter.route('/newAppointment')
    .post(PatientController.postAppointment);
PatientRouter.route('/addHistory')
    .post(PatientController.addHistory);
PatientRouter.route('/giveFeedback')
    .put(PatientController.giveFeedback);

