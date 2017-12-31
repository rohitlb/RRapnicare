var mongoose = require('mongoose');

var Professional = new mongoose.Schema({
    //general information
    doctor_image : {type : String},
    name : {type:String},
    email : {type : String},
    number : {type : String},
    password : {type:String}
});

module.exports = mongoose.model('professional',Professional);
