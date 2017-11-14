// require dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var request = require('request');
var mongoose = require('mongoose');
var multer = require('multer');
var promise = require('bluebird');
var sleep = require('thread-sleep');
var session = require('express-session');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcryptjs');
var mongoDBStore = require('connect-mongodb-session')(session);
mongoose.Promise = promise;
var async = require('async');
var keys = require('./private/keys');


// req models
var User  = require('./model/registration');
var Doctor = require('./model/doctorregistration');
//require for medicine index
var Company = require('./model/company');
var Brand = require('./model/brand');
var Dosage = require('./model/dosage');
var Strength = require('./model/strength');
//require for disease
var Disease = require('./model/disease');
//require molecule
var Molecule = require('./model/molecule');

// to save profile pic of user
var routes = require('./model/imagefile');

//declare the app
var app = express();

var store = new mongoDBStore({
    uri : 'mongodb://localhost/ApniCare',
    collection : 'mySessions'
});

store.on('error',function (error) {
    assert.ifError(error);
    assert.ok(false);
});

// to hide X-Powered-By for Security,Save Bandwidth in ExpressJS(node.js)
app.disable('x-powered-by');

//configure the app
app.set('port',9000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// adding favicon of Apnicare
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//set all middleware
app.use(bodyParser.json());
//exteended false means it won't be accepting nested objects (accept only single)
// here security for session to be added like.... session validate
app.use(bodyParser.urlencoded({extended : false}));
app.use(expressValidator());
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

// for imagefile in model
app.use(routes);
// if saveUninitialized : false than it will store session till the instance is in existence
// secret is hashing secret
// secret should be that much complex that one couldnt guess it easily
app.use(session({
    secret : 'keyboard cat',
    cookie : {maxAge : 1000* 60 * 60 * 24 * 7},
    store : store,
    resave : false,
    saveUninitialized : true
}));

app.get('/adminprofile',function (req,res) {
    res.render('admin_home1');
});

// have thread-sleep (tested) . run "npm update --save" for adding modules
app.get('/test',function (req,res) {
    var start = Date.now();
    // set time
    var hit = sleep(10000);
    var end = Date.now();
// testing time been set
    console.log(hit + ' ~= ' + (end - start) + ' ~= 5000');
    //render where you want
    res.render('');
    res.end();

});

//*************************************OTP*******************************************************************

//user
app.post('/sendOTP',function (req, res) {

    var number = req.body.number;
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if(num === false){
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }

    User.findOne({number : number},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if (result) {
                res.send({status: "failure", message: "number Already Exists"});
                res.end();

            }
            else{
                var options = { method: 'GET',
                    url: 'http://2factor.in/API/V1/'+keys.api_key()+'/SMS/'+number+'/AUTOGEN',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    form: {} };

                request(options, function (error, response, body) {
                    if (error) {
                        throw new Error(error);
                    }
                    else {
                        var temp = JSON.parse(body);
                        req.session.sid = temp.Details;
                        res.send({status: "success", message: "OTP sent to your number"});
                    }
                });
            }
        }
    });
});

//doctor
app.post('/DoctorsendOTP',function (req, res) {
    var number = req.body.number;
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if(num === false){
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }

    Doctor.findOne({number : number},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if (result) {
                res.send({status: "failure", message: "number Already Exists"});
                res.end();

            }
            else{
                var options = { method: 'GET',
                    url: 'http://2factor.in/API/V1/'+keys.api_key()+'/SMS/'+number+'/AUTOGEN',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    form: {} };

                request(options, function (error, response, body) {
                    if (error) {
                        throw new Error(error);
                    }
                    else {
                        var temp = JSON.parse(body);
                        req.session.sid = temp.Details;
                        res.send({status: "success", message: "OTP sent to your number"});
                    }
                });
            }
        }
    });
});

app.post('/VerifyOTP',function (req, res) {
    var otp = req.body.number;
    var options = { method: 'GET',
        url: 'http://2factor.in/API/V1/'+keys.api_key()+'/SMS/VERIFY/'+req.session.sid+'/'+otp,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {} };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var temp = JSON.parse(body);
        res.send({message: temp.Status })
        });
});

app.get('/home',function (req,res) {
    if (req.session.userID) {
        res.redirect('/profile');
        res.end();
    }
    if (req.session.doctorID) {
        res.redirect('/doctorpage');
    }
    res.send({status: "success", message: "Please Login First"});
    res.end();
});

app.get('/', function (req, res) {
    if (req.session.userID) {
        res.redirect('/profile');
        res.end();
    }
    if(req.session.doctorID){
        res.render('doctorpage');
        res.end();
    }
        res.render('home');
        res.end();
});

//User registration
app.post('/register', function (req, res) {
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(req.body.number);
    if (num === false) {
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }
    // regex for checking whether password is numeric or not (pass iff pwd is numeric)
    var a = /[0-9]{4}/.test(req.body.password);
    if (a === false) {
        res.send({status: "failure", message: "please enter a numeric password and try again"});
        return;
    }
    User.findOne({number: req.body.number}).exec(function (err, result) {
        if (err) {
            console.log(err);
            res.end();
        } else {
            if (result) {
                res.send({status: "failure", message: "user Already Exists"});
                res.end();
            } else {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        if(err){
                            console.log(err);
                        }
                        else {
                            var user = new User({
                                name: req.body.name,
                                email: req.body.email,
                                number: req.body.number,
                                password: hash
                            });
                            user.save(function (err, results) {
                                if (err) {
                                    console.log(err);
                                    res.end();
                                } else {
                                    req.session.userregistercontact = results.number;
                                    res.send({status: "success", message: "successfully registered"});
                                    res.end();
                                }
                            });
                        }
                    });
                });
            }
        }
    });
});

//render profile page of user
app.get('/profile', function (req, res) {
    if (req.session.userID) {
        res.render('profile', {number: req.session.userID});
    }
    if(req.session.doctorID) {
        res.render('doctorpage', {number: req.session.doctorname});
    }
    res.send({status : "failed" , message : "Please Login First"});
});

app.get('/profiles',function (req,res) {
    if(req.session.userID) {
        res.render('profiles');
    }
    res.send({status : "failed" , message : "Please Login First"});
});

//user profile update
app.post('/profiles',function (req,res) {
    var dob = req.body.dob;
    var gender = req.body.gender;
    var blood_group = req.body.blood_group;
    var marital_status = req.body.marital_status;
    var height = req.body.height;
    var weight = req.body.height;


    var addresses = req.body.address;
    var landmark = req.body.landmarks;
    var pincode = req.body.pincode;
    var city = req.body.city;
    var state = req.body.state;


    var aadhaar_number = req.body.aadhaar_number;
    var income = req.body.income;
    var rel_name = req.body.relative_name;
    var rel_contact = req.body.relative_contact;
    var relation = req.body.relation;


    User.update({number : req.session.userregistercontact}, {
        $set : {
            dob: dob,
            gender: gender,
            blood_group: blood_group,
            marital_status: marital_status,
            height: height,
            weight: weight,
            address: {
                address : addresses,
                landmark : landmark,
                pin_code : pincode,
                city : city,
                state : state
            },
            aadhaar_number: aadhaar_number,
            income: income,
            relative_name : rel_name,
            relative_contact: rel_contact,
            relation: relation
        }
    },function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            res.send("successfully updated");
        }
    });
});

//*****************************************USER LOGIN*******************************************************************
//login with filter and session

app.post('/login',function (req,res) {
    User.findOne({number: req.body.number}).exec(function (err,result) {
        if(err){
            console.log(err);
            res.send({status: "failure", message : "Some error occurred"});
            res.end();
        } else {
            if(result) {
                bcrypt.compare(req.body.password,result.password,function(err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            req.session.userID = result._id;
                            req.session.username = result.name;
                            req.session.usernumber = result.number;
                            req.session.userpassword = result.password;
                            req.session.dpname = req.body.number;
                            //req.session.nextpage = "notmove";
                            if (req.session.userID) {
                                res.send({
                                    status: "success",
                                    message: "successfully login",
                                    number: req.session.userID
                                });
                                res.end();
                            }
                        }
                        else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else {
                res.send({status: "failure", message: "Can't login"});
                res.end();
            }
        }
    });
});

//Doctor login
app.post('/doctorlogin',function (req,res) {
    Doctor.findOne({number: req.body.number}).exec(function (err,result) {
        if(err){
            console.log(err);
            res.send({status: "failure", message : "Some error occurred"});
            res.end();
        } else {
            if(result) {

                bcrypt.compare(req.body.password,result.password,function(err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            req.session.doctorID = result._id;
                            req.session.doctorname = result.name;
                            req.session.doctorpassword = result.password;
                            req.session.dpname = req.body.number;
                            req.session.doctornumber = result.number;
                            if (req.session.userID) {
                                res.send({
                                    status: "success",
                                    message: "successfully login",
                                    number: req.session.doctorID
                                });
                                res.end();
                            }
                        }
                        else{
                            res.send({status : "failure", message : "password incorrect"});
                        }

                    }
                });
            }
            else {
                res.send({status: "failure", message: "Can't login"});
                res.end();
            }
        }
    });
});

//logout the user
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});





//***************************************Edit User Profile*****************************************************************

//***************Edit Name and Email **********************************

app.get('/verifypassword',function (req,res) {
    if(req.session.userID) {
        res.render('verifypassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/verifypassword',function (req,res) {

    var password = req.body.password;
    User.findOne({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result) {
                bcrypt.compare(password, result.password, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            //next();
                            //res.send({status: "success", message: "Password match"})
                            res.render('updatenameandemail',{status: "success", message: "Password match"});
                        }
                        else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else{
                res.send({status: "failure", message: "Incorrect password"});
            }
        }
    });
});

app.get('/updatenameandemail',function (req,res) {
    if(req.session.userID){
        res.render('updatenameandemail');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/updatenameandemail',function (req,res) {
    var name = req.body.name;
    var email = req.body.email;
    User.find({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else {
            if (result[0].password === req.session.userpassword) {
                if (name === "") {
                    name = result[0].name;
                }
                if (email === "") {
                    email = result[0].email;
                }
                User.update({_id: req.session.userID}, {
                    $set: {
                        name: name,
                        email: email
                    }
                }, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.send({status: "success", message: "Successfully Updated"});
                    }
                });
            }
            else {
                res.send({status: "failure", message: "Details Cannot update"});
            }
        }
    });
});

//*******************Edit Password**************************************

app.get('/updatepassword',function (req,res) {
    if(req.session.userID) {
        res.render('updatepassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/updatepassword',function (req,res) {
    var oldpassword = req.body.oldpassword;
    var newpassword = req.body.newpassword;
    var confpassword = req.body.confpassword;

    User.findOne({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result){
                bcrypt.compare(oldpassword,result.password,function(err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (results) {
                            if (newpassword === confpassword) {
                                bcrypt.genSalt(10, function (err, salt) {
                                    bcrypt.hash(newpassword, salt, function (err, hash) {

                                        User.update({_id: req.session.userID}, {
                                            $set: {password: hash}
                                        }, function (err1, result1) {
                                            if (err1) {
                                                console.log(err1);
                                            }
                                            else {
                                                res.send({status: "success", message: "Password Successfully Updated"});
                                            }
                                        });
                                    });
                                });
                            }
                            else {
                                res.send({status: "failure", message: "Both password not match"});
                            }
                        }
                    else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else{
                res.send({status: "failure", message: "Please enter correct old password"});
            }
        }
    });
});

//****************Edit Personal Information********************************

app.get('/verifydetailspassword',function (req,res) {
    if(req.session.userID) {
        res.render('verifydetailspassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/verifydetailspassword',function (req,res) {
    var password = req.body.password;
    User.findOne({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result) {
                bcrypt.compare(password, result.password, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            //res.send({status: "success", message: "Password match"})
                            res.render('updateusersdetails',{status: "success", message: "Password match"});
                        }
                        else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else{
                res.send({status: "failure", message: "Incorrect password"});
            }
        }
    });
});

app.get('/updateusersdetails',function (req,res) {
    if(req.session,userID) {
        res.render('updateusersdetails');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/updateusersdetails',function (req,res) {
    var dob = req.body.dob;
    var gender = req.body.gender;
    var blood_group = req.body.blood_group;
    var marital_status = req.body.marital_status;
    var height = req.body.height;
    var weight = req.body.weight;

    User.find({_id : req.session.userID},function (err,result) {
        if (err) {
            console.log(err);
        }
        else {

            if (result[0].password === req.session.userpassword) {
                if (dob === "") {
                    dob = result[0].dob;
                }
                if (gender === "") {
                    gender = result[0].gender;
                }
                if (blood_group === "") {
                    blood_group = result[0].blood_group;
                }
                if (marital_status === "") {
                    marital_status = result[0].marital_status;
                }
                if (height === "") {
                    height = result[0].height;
                }
                if (weight === "") {
                    weight = result[0].weight;
                }

                User.update({_id: req.session.userID}, {
                    $set: {
                        dob: dob,
                        gender: gender,
                        blood_group: blood_group,
                        marital_status: marital_status,
                        height: height,
                        weight: weight
                    }
                }, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(result);
                        res.send({status: "success", message: "Details Updated"});
                    }
                });
            }
            else {
                res.send({status: "failure", message: "Wrong credentials"});
            }
        }
    });
});

//*****************Edit address*********************************************

app.get('/addresspassword',function (req,res) {
    if(req.session.userID) {
        res.render('addresspassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/addresspassword',function (req,res) {
    var password = req.body.password;
    User.findOne({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result) {
                bcrypt.compare(password, result.password, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            //res.send({status: "success", message: "Password match"})
                            res.render('editaddress',{status: "success", message: "Password match"});
                        }
                        else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else{
                res.send({status: "failure", message: "Incorrect password"});
            }
        }
    });
});

app.get('/editaddress',function (req,res) {
    if(req.session.userID) {
        res.render('editaddress');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/editaddress',function (req,res) {
    var addresses = req.body.address;
    var landmark = req.body.landmark;
    var pincode = req.body.pincode;
    var city = req.body.city;
    var state = req.body.state;

    User.find({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else {
            if (result[0].password === req.session.userpassword) {
                if (addresses === "") {
                    addresses = result[0].address.address;
                }
                if (landmark === "") {
                    landmark = result[0].address.landmarks;
                }
                if (pincode === "") {
                    pincode = result[0].address.pin_code;
                }
                if (city === "") {
                    city = result[0].address.city;
                }
                if (state === "") {
                    state = result[0].address.state;
                }

                User.update({_id: req.session.userID}, {
                    $set: {
                        address: {
                            addresses: addresses,
                            landmarks: landmark,
                            pin_code: pincode,
                            city: city,
                            state: state
                        }
                    }
                }, function (err1, result1) {
                    if (err1) {
                        console.log(err1);
                    }
                    else {
                        res.send({status: "success", message: "Address successfully updated"});
                    }
                });
            }
            else {
                res.send({status: "failure", message: "Wrong credentials"});
            }
        }
    });
});


//********************Edit Confidential *************************************

app.get('/confidentialpassword',function (req,res) {
    if(req.session.userID) {
        res.render('confidentialpassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/confidentialpassword',function (req,res) {
    var password = req.body.password;
    User.findOne({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result) {
                bcrypt.compare(password, result.password, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            //res.send({status: "success", message: "Password match"})
                            res.render('editconfidential',{status: "success", message: "Password match"});
                        }
                        else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else{
                res.send({status: "failure", message: "Incorrect password"});
            }
        }
    });
});

app.get('/editconfidential',function (req,res) {
    if(req.session.userID) {
        res.render('editconfidential');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/editconfidential',function (req,res) {
    var aadhaarnumber = req.body.aadhaar_number;
    var income = req.body.income;
    
    User.find({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else {

            if (result[0].password === req.session.userpassword) {
                if (aadhaarnumber === "") {
                    aadhaarnumber = result[0].aadhaar_number;
                }
                if (income === "") {
                    income = result[0].income;
                }

                User.update({_id: req.session.userID}, {
                    $set: {
                        aadhaar_number: aadhaarnumber,
                        income: income
                    }
                }, function (err1, result1) {
                    if (err1) {
                        console.log(err1);
                    }
                    else {
                        res.send({status: "success", message: "confidential updated"});
                    }
                });
            }
            else {
                res.send({status: "failure", message: "Wrong credentials"});
            }
        }
    });
});

//***********************Edit Emergency **************************************

app.get('/emergencypassword',function (req,res) {
    if(req.session.userID) {
        res.render('emergencypassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/emergencypassword',function (req,res) {
    var password = req.body.password;
    User.findOne({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result) {
                bcrypt.compare(password, result.password, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            //res.send({status: "success", message: "Password match"})
                            res.render('editemergency',{status: "success", message: "Password match"});
                        }
                        else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else{
                res.send({status: "failure", message: "Incorrect password"});
            }
        }
    });
});

app.get('/editemergency',function (req,res) {
    if(req.session.userID) {
        res.render('editemergency');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/editemergency',function (req,res) {
    var rel_name = req.body.relative_name;
    var rel_contact = req.body.relative_contact;
    var relation = req.body.relation;

    User.find({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else {
            if (result[0].password === req.session.userpassword) {
                if (rel_name === "") {
                    rel_name = result[0].relative_name;
                }
                if (rel_contact === "") {
                    rel_name = result[0].relative_contact;
                }
                if (relation === "") {
                    relation = result[0].relation;
                }

                User.update({_id: req.session.userID}, {
                    $set: {
                        relative_name: rel_name,
                        relative_contact: rel_contact,
                        relation: relation
                    }
                }, function (err1, result1) {
                    if (err1) {
                        console.log(err1)
                    }
                    else {
                        res.send({status: "success", message: "Emergency Contact Updates"});
                    }
                });
            }
            else {
                res.send({status: "failure", message: "Wrong credentials"});
            }
        }
    });
});



//////////////////////////////////////////Not Now///////////////////////////////////////////////////////////////////////
////////////////////////////////////////Insert Doctor///////////////////////////////////////////////////////////////////

//Doctor registration
app.post('/doctorregister', function (req, res) {
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(req.body.number);
    if (num === false) {
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }
    // regex for checking whether password is numeric or not (pass iff pwd is numeric)
    var a = /[0-9]{4}/.test(req.body.password);
    if (a === false) {
        res.send({status: "failure", message: "please enter a numeric password and try again"});
        return;
    }
    Doctor.findOne({number: req.body.number}).exec(function (err, result) {
        if (err) {
            console.log(err);
            res.end();
        } else {
            if (result) {
                res.send({status: "failure", message: "user Already Exists"});
                res.end();

            } else {
                var doctor = new Doctor({
                    name: req.body.name,
                    number: req.body.number,
                    password: req.body.password
                });
                doctor.save(function (err, results) {
                    if (err) {
                        console.log(err);
                        res.end();
                    } else {
                        res.send({status: "success", message: "successfully registered"});
                        res.end();
                    }
                });
            }
        }
    });
});

//rendering to occupation
app.get('/occupation',function (req,res) {
    res.render('occupation');
});
//filling occupation
app.post('/occupation',function (req,res) {
    var occupation = req.body.occupation;
    Doctor.update({number : req.session.doctornumber},{
        $set : {occupation : occupation}
    },function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            res.render('doctordetails');
        }
    });
});

//doctors details
app.get('/doctor_details',function (req,res) {
    res.render('doctordetails');
});

app.post('/doctor_details',function (req,res) {
    var name = req.body.name;
    var specialisation = req.body.specialisation;
    var city = req.body.city;

    Doctor.update({number: req.session.doctornumber}, {
        $set: {
            name: name,
            specialisation: specialisation,
            city: city
        }
    }, function (err, result) {
        res.render('doctorprofile');
    });
});

//doctor Profile
app.get('/doctor_profile',function (req,res) {
    res.render('doctorprofile');
});

app.post('/doctor_profile',function (req,res) {
    var title = req.body.title;
    var gender = req.body.gender;
    var experience = req.body.year_of_experience;
    var about = req.body.about_You;
    var qualification = req.body.qualification;
    var college = req.body.college;
    var completion = req.body.completion;
    var council_number = req.body.council_number;
    var council_name = req.body.council_name;
    var council_year = req.body.council_year;

    Doctor.update({ number : req.session.doctornumber },{
        $set : {
            title : title,
            gender : gender,
            year_of_experience : experience,
            about_you : about,
            qualification : qualification,
            college : college,
            completion_year : completion,
            council_registration_number : council_number,
            council_name : council_name,
            council_registration_year : council_year
        }
    },function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            res.send("doctors updated");
        }
    });
});

//forgot password
app.post('/checkforgotpassword',function (req,res) {
    var number = req.body.number;
    //regex for checking whether entered number is indian
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if(num === false){
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }

    User.findOne({number : number}, function (err,result) {
        if (err) {
            console.log(err);
        } else {
            if (result) {
                var options = {
                    method: 'GET',
                    url: 'http://2factor.in/API/V1/' + keys.api_key() + '/SMS/' + number + '/AUTOGEN',
                    headers: {'content-type': 'application/x-www-form-urlencoded'},
                    form: {}
                };

                request(options, function (error, response, body) {
                    if (error) {
                        throw new Error(error);
                    }
                    else {
                        var temp = JSON.parse(body);
                        req.session.sid = temp.Details;
                        res.send({status: "success", message: "OTP sent to your number"});

                    }
                });

            }
            else {
                res.send({status: "failure", message: "this number is not registered"});
            }
        }
    });
});

//forgot password for doctor
app.post('/doctorcheckforgotpassword',function (req,res) {
    var number = req.body.number;
    //regex for checking whether entered number is indian
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if(num === false){
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }

    Doctor.findOne({number : number}, function (err,result) {
        if (err) {
            console.log(err);
        } else {

            if (result) {
                var options = {
                    method: 'GET',
                    url: 'http://2factor.in/API/V1/' + keys.api_key() + '/SMS/' + number + '/AUTOGEN',
                    headers: {'content-type': 'application/x-www-form-urlencoded'},
                    form: {}
                };

                request(options, function (error, response, body) {
                    if (error) {
                        throw new Error(error);
                    }
                    else {
                        var temp = JSON.parse(body);
                        req.session.sid = temp.Details;
                        res.send({status: "success", message: "OTP sent to your number"});
                    }
                });
            }
            else {
                res.send({status: "failure", message: "this number is not registered"});
            }
        }
    });
});

//doc update password
app.post('/doctorupdatepassword',function (req,res) {
    var password = req.body.password;
    Doctor.update({number : req.session.doctornumber},{
        $set : {password : password}
    },function (err,result1) {
        if (err) {
            console.log(err);
        }
        else {
            res.send({status: "success", message: "new password update"});
            res.end();
        }
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////Drug index start from here////////////////////////////////////////////////////////////

app.get('/medicine',function (req,res) {
    // if(req.session.doctorID) {
    //     res.render('medicine');
    // }
    // res.send({status : "failure", message : "Please login first"});
    res.render('medicine');
});

app.post('/medicine',function(req,res) {
    var dosage_form = req.body.dosage_form;
    var brand_name = req.body.brand_name;
    var categories = req.body.categories;
    var primarilyusedfor = req.body.primarilyusedfor;
    var company_name = req.body.company_name;
    var strengtH = req.body.strength;
    var types = req.body.types;
    var active_ingredients = req.body.potent_substance;
    var packaging = req.body.packaging;
    var price = req.body.price;
    var dose_taken = req.body.dose_taken;
    var dose_timing = req.body.dose_timing;
    var warnings = req.body.warnings;
    var prescription = req.body.prescription;
    var molecule_strengths = req.body.molecule_strength;
    async.waterfall([
            function (callback) {
                Company.findOne({company_name: company_name}, function (err, result) {
                    if (err) {
                        console.log(err);
                        throw new Error(err);
                    }
                    else {
                        callback(null, result);
                    }
                });
            },
            function (result,callback) {
                if(result){
                    req.session.companyresult = result._id;
                    Brand.findOne({brand_name : brand_name},function (err,result1) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        else{
                            callback(null,result1);
                        }
                    });
                }
                else{
                    Brand.findOne({brand_name :brand_name},function (err1,result1) {
                        if(err1){
                            console.log(err1);
                            throw new Error(err1);
                        }
                        else{
                            if(result1){
                                res.send("other company cannot have same brand");
                            }
                            else{
                                var STRength = new Strength({
                                    strength : strengtH,
                                    potent_substance : {
                                        name : active_ingredients,
                                        molecule_strength : molecule_strengths
                                    },
                                    packaging : packaging,
                                    price : price,
                                    dose_taken : dose_taken,
                                    dose_timing : dose_timing,
                                    warnings : warnings,
                                    prescription : prescription
                                });
                                STRength.save(function (err2,result2) {
                                    if(err2){
                                        console.log(err2);
                                        throw new Error(err2);
                                    }
                                    else {
                                        var dosage = new Dosage({
                                            dosage_form: dosage_form,
                                            strength_id: result2._id
                                        });
                                        dosage.save(function (err3, result3) {
                                            if(err3){
                                                console.log(err3);
                                                throw new Error(err3);                                        }
                                            else{
                                                var brand = new Brand({
                                                    brand_name : brand_name,
                                                    categories : categories,
                                                    types : types,
                                                    primarily_used_for : primarilyusedfor,
                                                    dosage_id : result3._id
                                                });
                                                brand.save(function (err4,result4) {
                                                    if(err4){
                                                        console.log(err4);
                                                        throw new Error(err4);                                                }
                                                    else{
                                                        var company = new Company({
                                                            company_name : company_name,
                                                            brand_id : result4._id
                                                        });
                                                        company.save(function(err5,result5){
                                                            if(err5){
                                                                console.log(err5);
                                                                throw new Error(err5);                                                        }
                                                            else{
                                                                Brand.update({brand_name : brand_name},{
                                                                    $set : {
                                                                        company_id : result5._id
                                                                    }
                                                                },function (err6) {
                                                                    if(err6){
                                                                        console.log(err6);
                                                                    }
                                                                    else{
                                                                        res.send("New medicine added");
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            },
            function (result,callback) {
                if(result){
                    Dosage.findOne({dosage_form : dosage_form},function (err,result1) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        else{
                            callback(null,result1);
                        }
                    });
                }
                else{
                    var strength = new Strength({
                        strength : strengtH,
                        potent_substance : {
                            name : active_ingredients,
                            molecule_strength : molecule_strengths
                        },
                        packaging : packaging,
                        price : price,
                        dose_taken : dose_taken,
                        dose_timing : dose_timing,
                        warnings : warnings,
                        prescription : prescription
                    });
                    strength.save(function (err,result) {
                        if(err){
                            console.log(err);
                        }
                        else {
                            var dosage = new Dosage({
                                dosage_form: dosage_form,
                                strength_id: result._id
                            });
                            dosage.save(function (err1, result1) {
                                if(err1){
                                    console.log(err1);
                                }
                                else{
                                    var brand = new Brand({
                                        brand_name : brand_name,
                                        categories : categories,
                                        types : types,
                                        primarily_used_for : primarilyusedfor,
                                        dosage_id : result1._id
                                    });
                                    brand.save(function (err2,result2) {
                                        if(err2){
                                            console.log(err2);
                                        }
                                        else{
                                            Company.update({company_name : company_name},{
                                                $push :{brand_id : result2._id}
                                            }).exec(function (err3) {
                                                if (err3) {
                                                    console.log(err3);
                                                }
                                                else {

                                                    Brand.update({brand_name : brand_name},{
                                                        $push : {
                                                            company_id : req.session.companyresult
                                                        }
                                                    },function (err6) {
                                                        if(err6){
                                                            console.log(err6);
                                                        }
                                                        else{
                                                            res.send("Brand added successfully  with dosage and strength");
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            },
            function (result,callback) {
                if(result){
                    Strength.findOne({strength : strengtH},function (err,result1) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        else{
                            callback(null,result1);
                        }
                    });
                }
                else{
                    var sTrength = new Strength({
                        strength : strengtH,
                        potent_substance : {
                            name : active_ingredients,
                            molecule_strength : molecule_strengths
                        },
                        packaging : packaging,
                        price : price,
                        dose_taken : dose_taken,
                        dose_timing : dose_timing,
                        warnings : warnings,
                        prescription : prescription
                    });
                    sTrength.save(function (err,result1) {
                        if(err){
                            console.log(err);
                        }
                        else {
                            var dosage = new Dosage({
                                dosage_form: dosage_form,
                                strength_id: result1._id
                            });
                            dosage.save(function (err1, result2) {
                                if(err1){
                                    console.log(err1);
                                }
                                else{
                                    Brand.update({brand_name : brand_name},{
                                        $push : {
                                            dosage_id : result2._id
                                        }
                                    }).exec(function (err2) {
                                        if(err2){
                                            console.log(err2);
                                        }
                                        else{
                                            res.send("Dosage added successfully with strength");
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            },
            function (result1) {
                if(result1){
                    res.send("Medicines already exists");
                }
                else{
                    var strength = new Strength({
                        strength : strengtH,
                        potent_substance : {
                            name : active_ingredients,
                            molecule_strength : molecule_strengths
                        },
                        packaging : packaging,
                        price : price,
                        dose_taken : dose_taken,
                        dose_timing : dose_timing,
                        warnings : warnings,
                        prescription : prescription
                    });
                    strength.save(function (err,result1) {
                        if(err){
                            console.log(err);
                        }
                        else{
                            Dosage.update({dosage_form : dosage_form},{
                                $push : {strength_id : result1._id}
                            }).exec(function (err2) {
                                if(err2){
                                    console.log(err2);
                                }
                                else{
                                    res.send("strength added successfully");
                                }
                            });
                        }
                    });
                }
            }
        ],
        function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.send("done");
            }
        });
});


app.get('/findcompany',function (req,res) {
    Company.find().exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            var data = {};
            data['result'] = [];
            for (var i=0; i<result.length; i++) {
                data['result'][i] = {
                    company : result[i].company_name,
                    brand : result[i].brand_id
                };
            }
            res.render('findcompany', {data: data});
        }
    });
});

app.get('/go_to_brand',function (req,res) {
    var company = req.query.company;  // take value of brand from front end

    //find all company
    Company.find({company_name : company}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            //create an object of data
            var data = {};
            data['brands'] = [];

            // strt loop to store every brand inside a company
            async.each(result[0].brand_id, function (brand,callback) {
                //find brand by individual id get from collection company
                Brand.findById(brand,function(err,result){
                    if(err){
                        callback("there is an error");
                    }

                    if(!data['brands']) {data['brands'] = [];} // to check if it is the first time you are inserting inside data['brand'], in which case it needs to be initialized.
                    // store the all brand in data object
                    data['brands'].push({
                        brand: result.brand_name,
                        dosage: result.dosage_id
                    });
                    callback();
                });
            },function (err) {
                if(err){
                    console.log(err);
                }
                res.render('showbrand', {data : data});
            });
        }
    });
});

app.get('/go_to_dosage',function (req,res) {
    var brand = req.query.brand;
    Brand.find({brand_name : brand}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            var data = {};
            data['dosage'] = [];

            async.each(result[0].dosage_id, function (dosage,callback) {

                Dosage.findById(dosage,function(err,result){
                    if(err){
                        callback("there is an error");
                    }

                    if(!data['dosage']) {data['dosage'] = [];} // to check if it is the first time you are inserting inside data['brand'], in which case it needs to be initialized.
                    data['dosage'].push({
                        dosage: result.dosage_form,
                        strength: result.strength_id
                    });
                    callback();
                });
            },function (err) {
                if(err){
                    console.log(err);
                }
                res.render('showdosage', {data : data});
            });
        }
    });

});

app.get('/go_to_strength',function (req,res) {
    var dosage = req.query.dosage;
    Dosage.find({dosage_form : dosage}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            var data = {};
            data['strength'] = [];

            async.each(result[0].strength_id, function (strength,callback) {

                Strength.findById(strength,function(err,result){
                    if(err){
                        callback("there is an error");
                    }
                    if(!data['strength']) {data['strength'] = [];} // to check if it is the first time you are inserting inside data['brand'], in which case it needs to be initialized.
                    data['strength'].push({
                        ingredients: result.active_ingredients[0].name
                    });
                    callback();
                });
            },function (err) {
                if(err){
                    console.log(err);
                }
                res.render('showingredients', {data : data});
            });
        }
    });
});

app.get('/findbrand',function (req,res) {
    var brand = req.query.brand;
    Brand.find({categories : brand}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            var data = {};
            data['result'] = [];
            for (var i=0; i<result.length; i++) {
                data['result'][i] = {brand : result[i].brand_name};
            }
            res.send(data);
            //res.render('findbrand', {data: result});
        }
    });
});

app.get('/findingredients',function (req,res) {
    Strength.find().exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            var data = {};
            data['result'] = [];
            for (var i=0; i<result.length; i++) {
                for (var j = 0; j < result[i].active_ingredients.length; j++) {
                    data['result'][i] = {ingredients: result[i].active_ingredients[j].name};
                }
            }
            res.render('findingredients', {data: data});
        }
    });
});

app.get('/disease',function (req,res) {
    res.render('disease');
});

app.post('/disease',function (req,res) {

    var disease_name = req.body.disease_name;
    var risk_factor = req.body.risk_factor;
    var cause = req.body.cause;
    var diagnosis = req.body.diagnosis;
    var treatment = req.body.treatment;
    var outlook = req.body.outlook;
    var prevention = req.body.prevention;

    Disease.findOne({disease_name : disease_name},function (err,result) {
        if (err) {
            console.log(err);
        }
        else {
            if (result) {
                res.send("Medicine already exist");
            }
            else {
                var disease = new Disease({
                    disease_name: disease_name,
                    risk_factor: risk_factor,
                    cause: cause,
                    diagnosis: diagnosis,
                    treatment: treatment,
                    outlook: outlook,
                    prevention: prevention
                });

                disease.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.send("medicine save successfully");
                    }
                });
            }
        }
    });
});




// ************************************About Molecule ***************************************************


// molecule details
app.get('/molecule',function (req,res) {
    res.render('molecule');
});

app.post('/molecules',function (req,res) {
    var molecule_name = req.body.molecule_name;
    var drug_categories = req.body.drug_categories;
    var description = req.body.description;
    var absorption = req.body.absorption;
    var distribution = req.body.distribution;
    var metabolism = req.body.metabolism;
    var excretion = req.body.excretion;
    var side_effect = req.body.side_effect;
    var precaution = req.body.precaution;
    var drug_interaction = req.body.drug_interaction;
    var food_interaction = req.body.food_interaction;
    var dosage = req.body.dosage;
    var food = req.body.food;
    var subhead = req.body.subhead;
    var info = req.body.info;

    var molecule = new Molecule({
        molecule_name: molecule_name,
        drug_categories: drug_categories,
        description: description,
        absorption: absorption,
        distribution: distribution,
        metabolism: metabolism,
        excretion: excretion,
        side_effect: side_effect,
        precaution: precaution,
        drug_interaction: drug_interaction,
        food_interaction: food_interaction,
        dosage: dosage,
        food: food,
        contradictions: [{subhead: subhead}, {info: info}]
    });
    molecule.save(function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.send("Molecules details added");
        }
    });
});

// search molecule
app.get('/search_molecule',function (req,res) {
    var ingredients = req.query.ingredients;
    Molecule.find({molecule_name: ingredients}).exec(function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('moleculedetails', {data: result});
        }
    });
});

app.get('/inmolecule',function (req,res) {
    var molecule = req.query.molecule;
    Molecule.find({molecule_name : molecule},function (err,info) {
        if(err){
            console.log(err);
        }
        else{
            res.render('info',{data : info});
        }
    });
});


//======================= save profile pic ====================


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // image name is set as number+orignal image name
        cb(null, req.session.dpname + file.originalname);
        req.session.dpindbname = req.session.dpname + file.originalname;
    }
});

var upload = multer({
    storage: storage
});

app.post('/uploadimage', upload.any(), function(req, res) {
    var path = req.files[0].path;
    var imageName = req.session.dpindbname ;
    console.log(req.session.userID);
    User.update({_id : req.session.userID},{
        $set : {
            path : path
        }
    },function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
            res.send({status: "success", message: "Image successfully registered"});
        }
    });
    routes.addImage(User, function(err) {
    });
});

//////////////////// try for free /////////////////////////////////////////
app.get('/userregister',function (req,res) {
    res.render('userregister');
});

app.post('/userregister', function (req, res) {
    var dob = req.body.dob;
    var gender = req.body.gender;
    var blood_group = req.body.blood_group;
    var marital_status = req.body.marital_status;
    var height = req.body.height;
    var weight = req.body.height;
    var addresses = req.body.address;
    var landmark = req.body.landmarks;
    var pincode = req.body.pincode;
    var city = req.body.city;
    var state = req.body.state;
    var aadhaar_number = req.body.aadhaar_number;
    var income = req.body.income;
    var rel_name = req.body.relative_name;
    var rel_contact = req.body.relative_contact;
    var relation = req.body.relation;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) {
                console.log(err);
            }
            else {
                var user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    number: req.body.number,
                    password: hash,
                    dob: dob,
                    gender: gender,
                    blood_group: blood_group,
                    marital_status: marital_status,
                    height: height,
                    weight: weight,
                    address: {
                        address: addresses,
                        landmarks: landmark,
                        pin_code: pincode,
                        city: city,
                        state: state
                    },
                    aadhaar_number: aadhaar_number,
                    income: income,
                    relative_name: rel_name,
                    relative_contact: rel_contact,
                    relation: relation
                });
                user.save(function (err, results) {
                    if (err) {
                        console.log(err);
                        res.end();
                    } else {
                        res.send({status: "success", message: "successfully registered"});
                        res.end();
                    }
                });
            }
        });
    });
});

/////////////////////////medicine shows ////////////////////////////////////////////////////////////////////////////////

////////////by Brands////////////////////////////

app.get('/findbrands',function (req,res) {
    Brand.find().populate({path : 'dosage_id',populate : {path : 'strength_id'}}).populate({path : 'company_id'}).exec(function (err,brand) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('all', {data: brand})
        }
    });
});

app.get('/findcategory',function (req,res) {
    Brand.find().exec(function (err,result) {
        res.render('category',{data : result});
    });
});

app.get('/searchdisease',function (req,res) {
    res.render('searchdisease');
});

app.post('/searchdisease',function (req,res) {
    var disease = req.body.disease;
    Brand.find({primarily_used_for : disease}).populate({path : 'dosage_id',populate : {path : 'strength_id'}}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        res.render('diseasebrands',{data : result})
    });
});

/////////my molecule//////////////////////////////

app.get('/searchmolecule',function (req,res) {
    Molecule.find().exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            //res.send(result);
            res.render('molecules',{data : result});
        }
    });
});






////////////////////////////////////////// register as a doctor and user ///////////////////////////////////////////////

app.get('/doctorasuser',function (req,res) {
    res.render('doctoruser');
});

app.post('/doctorasuser',function (req,res) {
    var name = req.body.name;
    var email = req.body.email;
    var number = req.body.number;
    var password = req.body.password;

    User.find({number : number}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result === ""){
                res.send({status: "failure", message: "User already exist"});
            }
            else{
                Doctor.find({number : number},function (err1,result1) {
                    if(err1){
                        console.log(err1);
                    }
                    else{
                        if(result1){
                            var doctor = new Doctor({
                                name: name,
                                email : email,
                                number: number,
                                password: password

                            });
                            doctor.save(function (err, results) {
                                if (err) {
                                    console.log(err);
                                    res.end();
                                } else {
                                    doctor_contact = results.number;
                                    res.send({status: "success", message: "successfully registered"});
                                    res.end();
                                }
                            });
                        }
                        else{
                            res.send({status: "failure", message: "Doctor already exist"});
                        }
                    }
                });
            }
        }
    });
});

///////////////////////////////////////Doctor  Profile Insert //////////////////////////////////////////////////////////


app.post('/createprofile',function (req,res) {
    var name = req.body.name;
    var specialization = req.body.specialization;
    var city = req.body.city;

    Doctor.update({number : req.session.doctornumber},{
        $push : {
            name : name,
            specialization : specialization,
            city : city
        }
    },function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
            res.send({ status : "success" , message : "Profile successfully updates"});
        }
    });
});

app.post('/basic',function (req,res) {
    var gender = req.body.gender;
    var city = req.body.city;
    var experience = req.body.experience;
    var about = req.body.about;

    Doctor.update({number : req.session.doctornumber},{
        $push : {
            gender : gender,
            city : city,
            year_of_experience : experience,
            About_you : about
        }
    },function (err,result) {
        if(err){
            console.log(err);
        }
        console.log(result);
        res.send({ status : "success" , message : "Basic Details successfully updates"});
    });
});

app.post('/education',function (req,res) {
    var qualification = req.body.qualification;
    var college = req.body.college;
    var completion = req.body.completion;

    Doctor.update({number : req.session.doctornumber},{
        $push : {
            qualification : qualification,
            college : college,
            completion_year : completion
        }
    },function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
            res.send({ status : "success" , message : "Basic Details successfully updates"});        }
    });
});

app.post('/certificate',function (req,res) {
    var council_number = req.body.council_number;
    var council_name = req.body.council_name;
    var council_year = req.body.council_year;
    var path = req.files[0].path;
    var imageName = req.session.dpindbname ;
    var path1 = req.files[0].path;
    var imageName1 = req.session.dpindbname ;


    Doctor.update({number : req.session.doctornumber},{
        $push : {
            council_registration_number : council_number,
            council_name : council_name,
            council_registration_year : council_year,
            document : path,
            certificate : path1
        }
    },function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
            res.send({ status : "success" , message : "Basic Details successfully updates"});
        }
    });
});


//==========================Database connection===========================

//data base connection and opening port
var db = 'mongodb://localhost/ApniCare';
mongoose.connect(db, {useMongoClient: true});


//=============================Start server========================
//connecting database and starting server
var database = mongoose.connection;
database.on('open', function () {
    console.log("database is connected");
    app.listen(app.get('port'), function () {
        console.log('server connected to http:localhost:' + app.get('port'));
    });
});


