var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Disease = new Schema({
    disease_name : {type : String},
    symptoms : {type:String},
    risk_factor : {type : String},
    cause : {type : String},
    diagnosis : [ {subhead : {type : String},info : {type : String}}],//a sub+text
    treatment : [{type : String}],//
    outlook : [{type : String}],//a
    prevention : [{type : String}],//a
    source : [{type : String}]//a
});

module.exports = mongoose.model('disease',Disease);
