var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Dosage = new Schema({
    dosage_form : {type : String},
    strength_id : [{type : Schema.Types.ObjectId , ref : 'strength'} ],
    keywords : [{dosageform : {type : String}, strength : {type : String}}]
});

module.exports = mongoose.model('dosage',Dosage);