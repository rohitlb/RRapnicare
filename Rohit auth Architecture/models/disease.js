var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Disease = new Schema({
    disease_name : {type : String},
    risk_factor : {type : String},
    cause : {type : String},
    diagnosis : {type : String},
    treatment : {type : String},
    outlook : {type : String},
    prevention : {type : String}
});

module.exports = mongoose.model('disease',Disease);
