// console.log('cont auth');


var request = require('request');
var mongoose = require('mongoose');
var multer = require('multer');
var promise = require('bluebird');
var sleep = require('thread-sleep');
var bcrypt = require('bcryptjs');
mongoose.Promise = promise;
var async = require('async');
var keys = require('./../private/keys');

// variables for profile image
var ID;
var dpname;
var dpindbname;

// req models
var User = require('./../models/registration');
var Doctor  = require('./../models/doctorregistration');
//require for medicine index
var Company = require('./../models/Company');
var Brand = require('./../models/Brand');
var Disease = require('./../models/Disease');
var Dosage = require('./../models/Dosage');
//require for disease
//require molecule
var Molecule = require('./../models/Molecule');
var Strength = require('./../models/Strength');


// to save profile pic of user
var routes = require('./../models/imagefile');



module.exports = {

    adminprofile : function (req,res) {
        res.render('admin_home1');
    },

    test : function (req,res) {
        var start = Date.now();
        // set time
        var hit = sleep(10000);
        var end = Date.now();
        // testing time been set
        console.log(hit + ' ~= ' + (end - start) + ' ~= 5000');
        //render where you want
        res.render('');
        res.end();
    },

    sendOTP : function (req, res) {

        var number = req.body.number;
        //regex for checking whether entered number is indian or not
        var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
        if(num === false){
            console.log("wrong number entered");
            res.send({status: "failure", message: "wrong number ! please try again "});
            return;
        }

        User.findOne({number : number},function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
                if (result) {
                    console.log("User Already Exist");
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
                            console.log(body);
                            var temp = JSON.parse(body);
                            console.log(temp.Details);
                            sid = temp.Details;
                            res.send({status: "success", message: "OTP sent to your number"});
                        }
                    });
                }
            }
        });
    },

    DoctorsendOTP : function (req, res) {

        var number = req.body.number;
        //regex for checking whether entered number is indian or not
        var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
        if(num === false){
            console.log("wrong number entered");
            res.send({status: "failure", message: "wrong number ! please try again "});
            return;
        }

        Doctor.findOne({number : number},function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
                if (result) {
                    console.log("User Already Exist");
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
                            console.log(body);
                            var temp = JSON.parse(body);
                            console.log(temp.Details);
                            sid = temp.Details;
                            res.send({status: "success", message: "OTP sent to your number"});
                        }
                    });
                }
            }
        });
    },

    VerifyOTP : function (req, res) {
        var otp = req.body.number;
        console.log(otp);

        var options = { method: 'GET',
            url: 'http://2factor.in/API/V1/'+keys.api_key()+'/SMS/VERIFY/'+sid+'/'+otp,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: {} };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log('verifyotp');
            console.log(body);
            var temp = JSON.parse(body);
            console.log(temp.Details);
            res.send({message: temp.Status })
        });
    },

    home : function (req,res) {
        if (req.session.userID) {
            res.redirect('/profile');
            res.end();
        } else {
            res.render('home');
            res.end();
        }
    },

    apnicare : function (req, res) {
        console.log('apni');
        if (req.session.userID) {
            res.redirect('/profile');
            res.end();
        } else {
            res.render('home');
            res.end();
        }
    },

    register : function (req,res) {
        if (req.session.userID) {
            res.redirect('/profiles');
            res.end();
        } else {
            res.render('home');
            res.end();
        }
    },

    registers : function (req, res) {
        //regex for checking whether entered number is indian or not
        var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(req.body.number);
        if (num === false) {
            console.log("wrong number entered");
            res.send({status: "failure", message: "wrong number ! please try again "});
            return;
        }
        // regex for checking whether password is numeric or not (pass iff pwd is numeric)
        var a = /[0-9]{4}/.test(req.body.password);
        if (a === false) {
            console.log(typeof req.body.password);
            console.log("password is not numeric");
            res.send({status: "failure", message: "please enter a numeric password and try again"});
            return;
        }
        User.findOne({number: req.body.number}).exec(function (err, result) {
            if (err) {
                console.log("Some error occured");
                res.end();
            } else {
                //console.log(result);
                if (result) {
                    console.log("User Already Exist");
                    res.send({status: "failure", message: "user Already Exists"});
                    res.end();
                } else {
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(req.body.password, salt, function (err, hash) {
                            if(err){
                                console.log("error in hashing");
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
                                        console.log("There is an error");
                                        res.end();
                                    } else {
                                        user_contact = results.number;
                                        console.log('user save successfully');
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
    },

    profiles : function (req,res) {
        res.render('profiles');
    },

    profiless : function (req,res) {

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

        User.update({number : user_contact}, {
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
                console.log(result);
                res.send("successfully updated");
            }
        });
    },

    login : function (req,res) {
        console.log("login reaches here");
        User.findOne({number: req.body.number}).exec(function (err,result) {
            if(err){
                console.log("Some error occurred");
                res.send({status: "failure", message : "Some error occurred"});
                res.end();
            } else {
                //console.log(result);
                if(result) {
                    bcrypt.compare(req.body.password,result.password,function(err, results) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            if(results) {
                                console.log("Successfully login");
                                req.session.userID = result._id;
                                sessionID = result._id;
                                dpname = req.body.number;
                                ID = req.session.userID;
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
                    console.log("check your name or password");
                    res.send({status: "failure", message: "Can't login"});
                    res.end();
                }
            }
        });
    },

    doctorlogin : function (req,res) {
        console.log("login reaches here");
        Doctor.findOne({number: req.body.number , Password : req.body.password}).exec(function (err,result) {
            if(err){
                console.log("Some error occurred");
                res.send({status: "failure", message : "Some error occurred"});
                res.end();
            } else {
                console.log(result);
                if(result) {
                    console.log("Successfully login");
                    req.session.userID = result._id;
                    if (req.session.userID) {
                        res.send({status: "success", message: "successfully login" ,number: req.session.userID});
                        res.end();
                    }
                } else {
                    console.log("check your name or password");
                    res.send({status: "failure", message: "Can't login"});
                    res.end();
                }
            }
        });
    },

    logout : function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/register');
            }
        });
    },

    profile : function (req, res) {
        res.render('profile', {number: req.session.userID});
    },

    verifypassword : function (req,res) {
        res.render('verifypassword');
    },

    verifypasswords : function (req,res,next) {

        var password = req.body.password;
        User.findOne({_id : sessionID},function (err,result) {
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
                                var new_password = result.password;
                                console.log("password match");
                                req.password = new_password;
                                //next();
                                //res.send({status: "success", message: "Password match"})
                                //res.render('updatenameandemail',{status: "success", message: "Password match"});
                            }
                            else{
                                res.send({status: "failure", message: "Wrong credentials"});
                            }
                        }
                    });
                }
                else{
                    console.log("password not match");
                    res.send({status: "failure", message: "Incorrect password"});
                }
            }
        });
    },

    updatenameandemail : function (req,res,next) {

        if (req.session.userID) {
            res.send({status: "failure", message: "Please verify Password first"});
            res.end();
        } else {
            console.log(req.password);
            res.render('updatenameandemail');
            res.end();
        }

        // if(!req.session.userID) {
        //     res.send({status: "failure", message: "Please verify Password first"});
        // }
        // else {
        //     res.render('updatenameandemail');
        // }

    },

    updatenameandemails : function (req,res) {
        var name = req.body.name;
        var email = req.body.email;
        User.find({_id : sessionID},function (err,result) {
            if(err){
                console.log(err);
            }
            else {
                if (result[0].password === new_password) {
                    if (name === "") {
                        name = result[0].name;
                    }
                    if (email === "") {
                        email = result[0].email;
                    }
                    User.update({_id: sessionID}, {
                        $set: {
                            name: name,
                            email: email
                        }
                    }, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(result);
                            res.send({status: "success", message: "Successfully Updated"});
                        }
                    });
                }
                else {
                    res.send({status: "failure", message: "Details Cannot update"});
                }
            }
        });
    },

    updatepassword : function (req,res) {
        res.render('updatepassword');
    },

    updatepasswords : function (req,res) {
        var oldpassword = req.body.oldpassword;
        var newpassword = req.body.newpassword;
        var confpassword = req.body.confpassword;

        User.findOne({_id : sessionID},function (err,result) {
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

                                            User.update({_id: sessionID}, {
                                                $set: {password: hash}
                                            }, function (err1, result1) {
                                                if (err1) {
                                                    console.log(err1);
                                                }
                                                else {
                                                    console.log(result1);
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
    },

    verifydetailspassword : function (req,res) {
        res.render('verifydetailspassword');
    },

    verifydetailspasswords : function (req,res) {
        var password = req.body.password;
        User.findOne({_id : sessionID},function (err,result) {
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
                                details_password = result.password;
                                console.log("password match");
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
                    console.log("password not match");
                    res.send({status: "failure", message: "Incorrect password"});
                }
            }
        });
    },

    updateusersdetails : function (req,res) {
        res.render('updateusersdetails');
    },

    updateusersdetailss : function (req,res) {
        console.log('req from app');
        console.log(sessionID);
        var dob = req.body.dob;
        var gender = req.body.gender;
        var blood_group = req.body.blood_group;
        var marital_status = req.body.marital_status;
        var height = req.body.height;
        var weight = req.body.weight;

        User.find({_id : sessionID},function (err,result) {
            if (err) {
                console.log(err);
            }
            else {

                if (result[0].password === details_password) {
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

                    User.update({_id: sessionID}, {
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
    },

    addresspassword : function (req,res) {
        res.render('addresspassword');
    },

    addresspasswords : function (req,res) {
        var password = req.body.password;
        User.findOne({_id : sessionID},function (err,result) {
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
                                address_password = result.password;
                                console.log("password match");
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
                    console.log("password not match");
                    res.send({status: "failure", message: "Incorrect password"});
                }
            }
        });
    },

    editaddress : function (req,res) {
        res.render('editaddress');
    },

    editaddresss : function (req,res) {
        var addresses = req.body.address;
        var landmark = req.body.landmark;
        var pincode = req.body.pincode;
        var city = req.body.city;
        var state = req.body.state;

        User.find({_id : sessionID},function (err,result) {
            if(err){
                console.log(err);
            }
            else {
                if (result[0].password === address_password) {
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

                    User.update({_id: sessionID}, {
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
                            console.log(result1);
                            res.send({status: "success", message: "Address successfully updated"});
                        }
                    });
                }
                else {
                    res.send({status: "failure", message: "Wrong credentials"});
                }
            }
        });
    },

    confidentialpassword : function (req,res) {
        res.render('confidentialpassword');
    },

    confidentialpasswords : function (req,res) {
        var password = req.body.password;
        User.findOne({_id : sessionID},function (err,result) {
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
                                confidential_password = result.password;
                                console.log("password match");
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
                    console.log("password not match");
                    res.send({status: "failure", message: "Incorrect password"});
                }
            }
        });
    },

    editconfidential : function (req,res) {
        res.render('editconfidential');
    },

    editconfidentials : function (req,res) {
        var aadhaarnumber = req.body.aadhaar_number;
        var income = req.body.income;

        User.find({_id : sessionID},function (err,result) {
            if(err){
                console.log(err);
            }
            else {

                if (result[0].password === confidential_password) {
                    if (aadhaarnumber === "") {
                        aadhaarnumber = result[0].aadhaar_number;
                    }
                    if (income === "") {
                        income = result[0].income;
                    }

                    User.update({_id: sessionID}, {
                        $set: {
                            aadhaar_number: aadhaarnumber,
                            income: income
                        }
                    }, function (err1, result1) {
                        if (err1) {
                            console.log(err1);
                        }
                        else {
                            console.log(result1);
                            res.send({status: "success", message: "confidential updated"});
                        }
                    });
                }
                else {
                    res.send({status: "failure", message: "Wrong credentials"});
                }
            }
        });
    },

    emergencypassword : function (req,res) {
        res.render('emergencypassword');
    },

    emergencypasswords : function (req,res) {
        var password = req.body.password;
        User.findOne({_id : sessionID},function (err,result) {
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
                                emergency_password = result.password;
                                console.log("password match");
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
                    console.log("password not match");
                    res.send({status: "failure", message: "Incorrect password"});
                }
            }
        });
    },

    editemergency : function (req,res) {
        res.render('editemergency');
    },

    editemergencys : function (req,res) {
        var rel_name = req.body.relative_name;
        var rel_contact = req.body.relative_contact;
        var relation = req.body.relation;

        User.find({_id : sessionID},function (err,result) {
            if(err){
                console.log(err);
            }
            else {
                if (result[0].password === emergency_password) {
                    if (rel_name === "") {
                        rel_name = result[0].relative_name;
                    }
                    if (rel_contact === "") {
                        rel_name = result[0].relative_contact;
                    }
                    if (relation === "") {
                        relation = result[0].relation;
                    }

                    User.update({_id: sessionID}, {
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
                            console.log(result1);
                            res.send({status: "success", message: "Emergency Contact Updates"});
                        }
                    });
                }
                else {
                    res.send({status: "failure", message: "Wrong credentials"});
                }
            }
        });
    },

    doctorregister : function (req, res) {
        //regex for checking whether entered number is indian or not
        var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(req.body.number);
        if (num === false) {
            console.log("wrong number entered");
            res.send({status: "failure", message: "wrong number ! please try again "});
            return;
        }
        // regex for checking whether password is numeric or not (pass iff pwd is numeric)
        var a = /[0-9]{4}/.test(req.body.password);
        if (a === false) {
            console.log("password is not numeric");
            res.send({status: "failure", message: "please enter a numeric password and try again"});
            return;
        }
        Doctor.findOne({number: req.body.number}).exec(function (err, result) {
            if (err) {
                console.log("Some error occured");
                res.end();
            } else {
                console.log(result);
                if (result) {
                    console.log("User Already Exist");
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
                            console.log("There is an error");
                            res.end();
                        } else {
                            //console.log(results);
                            doctor_contact = results.number;
                            console.log('user save successfully');
                            res.send({status: "success", message: "successfully registered"});
                            res.end();
                        }
                    });
                }
            }
        });
    },

    occupation : function (req,res) {
        res.render('occupation');
    },

    occupations : function (req,res) {
        var occupation = req.body.occupation;
        Doctor.update({number : doctor_contact},{
            $set : {occupation : occupation}
        },function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
                res.render('doctordetails');
            }
        });
    },

    doctor_details : function (req,res) {
        res.render('doctordetails');
    },

    doctor_detailss : function (req,res) {
        var name = req.body.name;
        var specialisation = req.body.specialisation;
        var city = req.body.city;

        Doctor.update({number : doctor_contact},{
            $set : {
                name : name,
                specialisation : specialisation,
                city : city
            }
        },function (err,result) {
            console.log(result);
            res.render('doctorprofile');
        });
    },

    doctor_profile : function (req,res) {
        res.render('doctorprofile');
    },

    doctor_profiles : function (req,res) {
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

        Doctor.update({ number : doctor_contact },{
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
                console.log(result);
                res.send("doctors updated");
            }
        });
    },

    checkforgotpassword : function (req,res) {
        console.log("app");
        console.log(req.body.number);
        number = req.body.number;
        console.log(number);
        //regex for checking whether entered number is indian
        var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
        if(num === false){
            console.log("wrong number entered");
            res.send({status: "failure", message: "wrong number ! please try again "});
            return;
        }

        User.findOne({number : number}, function (err,result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);

                if (result) {
                    console.log("sending otp");
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
                            console.log(body);
                            var temp = JSON.parse(body);
                            console.log(temp.Details);
                            sid = temp.Details;
                            res.send({status: "success", message: "OTP sent to your number"});

                        }
                    });

                }
                else {
                    console.log("user is not registered");
                    res.send({status: "failure", message: "this number is not registered"});
                }
            }
        });
    },

    doctorcheckforgotpassword : function (req,res) {
        console.log("app");
        console.log(req.body.number);
        number = req.body.number;
        console.log(number);
        //regex for checking whether entered number is indian
        var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
        if(num === false){
            console.log("wrong number entered");
            res.send({status: "failure", message: "wrong number ! please try again "});
            return;
        }

        Doctor.findOne({number : number}, function (err,result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);

                if (result) {
                    console.log("sending otp");
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
                            console.log(body);
                            var temp = JSON.parse(body);
                            console.log(temp.Details);
                            sid = temp.Details;
                            res.send({status: "success", message: "OTP sent to your number"});

                        }
                    });
                }
                else {
                    console.log("user is not registered");
                    res.send({status: "failure", message: "this number is not registered"});
                }
            }
        });
    },

    doctorupdatepassword : function (req,res) {
        console.log('updating password');
        console.log(req.body.number);
        console.log(number);
        var password = req.body.password;
        console.log(password);
        Doctor.update({number : number},{
            $set : {password : password}
        },function (err,result1) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result1);
                res.send({status: "success", message: "new password update"});
                res.end();
            }
        });
    },

    medicine : function (req,res) {
        res.render('medicine');
    },

    medicines : function (req,res) {
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
                        company_result = result._id;
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
                                                                        $push : {
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
                                                                company_id : company_result
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
    },

    findcompany : function (req,res) {
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
    },

    go_to_brand : function (req,res) {
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
                    console.log(data);
                    res.render('showbrand', {data : data});
                });
            }
        });
    },

    go_to_dosage : function (req,res) {
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
                    //console.log(data);
                    res.render('showdosage', {data : data});
                });
            }
        });

    },

    go_to_strength : function (req,res) {
        var dosage = req.query.dosage;
        Dosage.find({dosage_form : dosage}).exec(function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                //console.log(result[0].strength_id);
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
    },

    findbrand : function (req,res) {
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
                //console.log(data);
                res.send(data);
                //res.render('findbrand', {data: result});
            }
        });
    },

    findingredients : function (req,res) {
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
                console.log(data);
                res.render('findingredients', {data: data});
            }
        });
    },

    disease : function (req,res) {
        res.render('disease');
    },

    diseases : function (req,res) {

        var disease_name = req.body.disease_name;
        var risk_factor = req.body.risk_factor;
        var cause = req.body.cause;
        var diagnosis = req.body.diagnosis;
        var treatment = req.body.treatment;
        var outlook = req.body.outlook;
        var prevention = req.body.prevention;

        Disease.findOne({disease_name : disease_name},function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                if(result){
                    res.send("Medicine already exist");
                }
                else{
                    var disease = new Disease({
                        disease_name : disease_name,
                        risk_factor : risk_factor,
                        cause : cause,
                        diagnosis : diagnosis,
                        treatment : treatment,
                        outlook : outlook,
                        prevention : prevention
                    });

                    disease.save(function (err) {
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.send("medicine save successfully");
                        }
                    });
                }
            }
        });

    },

    molecule : function (req,res) {
        res.render('molecule');
    },

    molecules : function (req,res) {
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
    },

    search_molecule : function (req,res) {
        var ingredients = req.query.ingredients;
        Molecule.find({molecule_name: ingredients}).exec(function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('moleculedetails', {data: result});
            }
        });
    },

    uploadimage : function(req, res) {


        res.send('Done');
        var path = req.files[0].path;
        var imageName = dpindbname ;
        console.log('storing in databases '+imageName+' test');
        //console.log(req.session.userID);
        console.log(path);
        console.log(imageName);

        User.update({_id : ID},{
            $set : {
                'image.path' : path,
                'image.originalname' : imageName
            }
        },function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
            }
        });
        routes.addImage(User, function(err) {
        });
    },

    userregister : function (req,res) {
        res.render('userregister');
    },

    userregisters : function (req, res) {
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
                    console.log("error in hashing");
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
                            console.log("There is an error");
                            res.end();
                        } else {
                            user_contact = results.number;
                            console.log('user save successfully');
                            res.send({status: "success", message: "successfully registered"});
                            res.end();
                        }
                    });
                }
            });
        });
    },

    findbrands : function (req,res) {
        Brand.find().populate({path : 'dosage_id',populate : {path : 'strength_id'}}).populate({path : 'company_id'}).exec(function (err,brand) {
            if (err) {
                console.log(err);
            }
            else {
                //res.send(brand[0]);
                res.render('all', {data: brand})
            }
        });
    },

    findcategory : function (req,res) {
        Brand.find().exec(function (err,result) {
            res.render('category',{data : result});
        });
    },

    searchdisease : function (req,res) {
        res.render('searchdisease');
    },

    searchdiseases : function (req,res) {
        var disease = req.body.disease;
        Brand.find({primarily_used_for : disease}).populate({path : 'dosage_id',populate : {path : 'strength_id'}}).exec(function (err,result) {
            if(err){
                console.log(err);
            }
            res.render('diseasebrands',{data : result})
        });
    },

    doctorasuser : function (req,res) {
        res.render('doctoruser');
    },

    doctorasusers : function (req,res) {
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
                    console.log(result);
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
                                        console.log("There is an error");
                                        res.end();
                                    } else {
                                        //console.log(result1);
                                        doctor_contact = results.number;
                                        console.log('user save successfully');
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
    }


};