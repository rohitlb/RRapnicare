var mongoose = require('mongoose');


var Doctor = new mongoose.Schema({
    //general information
    name : {type:String},
    email : {type : String},
    number : {type : String},
    password : {type:String},
    //his/her occupation
    occupation : {type : String},
    //personal details
    title : {type : String},
    gender : {type : String},
    city : {type : String},
    year_of_experience : {type :String},
    About_you : {type : String},
    //educations
    qualification : {typec :String},
    college : {type : String},
    completion_year : {type : String},
    specialisation : {type : String},
    //registration and document
    council_registration_number : {type : String},
    council_name : {type : String},
    council_registration_year : {type : String}
    //document /certificate
    //yet left
});

module.exports = mongoose.model('Doctor',Doctor);