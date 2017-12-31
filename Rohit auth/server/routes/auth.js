// console.log('routes auth');

var express = require('express');
var router = express.Router();
var multer = require('multer');

var authController = require('./../../controllers/auth');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        // console.log('test for file');
        // console.log(file);
        // console.log('end');
        // image name is set as number+orignal image name
        cb(null, dpname+file.originalname);
        dpindbname = dpname+file.originalname;
    }
});
var upload = multer({
    storage: storage
});

module.exports = function (app) {

    router.get('/',authController.apnicare);

    router.get('/adminprofile',authController.adminprofile);
    router.get('/test',authController.test);
    router.post('/sendOTP',authController.sendOTP);
    router.post('/DoctorsendOTP',authController.DoctorsendOTP);
    router.post('/VerifyOTP',authController.VerifyOTP);
    router.get('/home',authController.home);
    // console.log('test');
    // console.log('routs ');

    router.get('/register',authController.register);
    router.post('/register',authController.registers);
    router.get('/profiles',authController.profiles);
    router.post('/profiles',authController.profiless);
    router.post('/login',authController.login);
    router.post('/doctorlogin',authController.doctorlogin);
    router.get('/logout',authController.logout);
    router.get('/profile',authController.profile);
    router.get('/verifypassword',authController.verifypassword);
    router.post('/verifypassword',authController.verifypasswords);
    router.get('/updatenameandemail',authController.updatenameandemail);
    router.post('/updatenameandemail',authController.updatenameandemails);
    router.get('/updatepassword',authController.updatepassword);
    router.post('/updatepassword',authController.updatepasswords);
    router.get('/verifydetailspassword',authController.verifydetailspassword);
    router.post('/verifydetailspassword',authController.verifydetailspasswords);
    router.get('/updateusersdetails',authController.updateusersdetails);
    router.post('/updateusersdetails',authController.updateusersdetailss);
    router.get('/addresspassword',authController.addresspassword);
    router.post('/addresspassword',authController.addresspasswords);
    router.get('/editaddress',authController.editaddress);
    router.post('/editaddress',authController.editaddresss);
    router.get('/confidentialpassword',authController.confidentialpassword);
    router.post('/confidentialpassword',authController.confidentialpasswords);
    router.get('/editconfidential',authController.editconfidential);
    router.post('/editconfidential',authController.editconfidentials);
    router.get('/emergencypassword',authController.emergencypassword);
    router.post('/emergencypassword',authController.emergencypasswords);
    router.get('/editemergency',authController.editemergency);
    router.post('/editemergency',authController.editemergencys);
    router.post('/doctorregister',authController.doctorregister);
    router.get('/occupation',authController.occupation);
    router.post('/occupation',authController.occupations);
    router.get('/doctor_details',authController.doctor_details);
    router.post('/doctor_details',authController.doctor_detailss);
    router.get('/doctor_profile',authController.doctor_profile);
    router.post('/doctor_profile',authController.doctor_profiles);
    router.post('/checkforgotpassword',authController.checkforgotpassword);
    router.post('/doctorcheckforgotpassword',authController.doctorcheckforgotpassword);
    router.post('/doctorupdatepassword',authController.doctorupdatepassword);
    router.get('/medicine',authController.medicine);
    router.post('/medicine',authController.medicines);
    router.get('/findcompany',authController.findcompany);
    router.get('/go_to_brand',authController.go_to_brand);
    router.get('/go_to_dosage',authController.go_to_dosage);
    router.get('/go_to_strength',authController.go_to_strength);
    router.get('/findbrand',authController.findbrand);
    router.get('/findingredients',authController.findingredients);
    router.get('/disease',authController.disease);
    router.post('/disease',authController.diseases);
    router.get('/molecule',authController.molecule);
    router.post('/molecules',authController.molecules);
    router.get('/search_molecule',authController.search_molecule);
    router.post('/uploadimage',upload.any(),authController.uploadimage);
    router.get('/userregister',authController.userregister);
    router.post('/userregister',authController.userregisters);
    router.get('/findbrands',authController.findbrands);
    router.get('/findcategory',authController.findcategory);
    router.get('/searchdisease',authController.searchdisease);
    router.post('/searchdisease',authController.searchdiseases);
    router.get('/doctorasuser',authController.doctorasuser);
    router.post('/doctorasuser',authController.doctorasusers);



    app.use('/',router);
    // here router is been defined means means it will be the mother directory after which all are defined further

};

