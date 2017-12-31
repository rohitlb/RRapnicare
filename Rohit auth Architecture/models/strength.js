var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Strength = new Schema({
    strength : {type : String},
    potent_substance : [{
        name : {type : String},
        molecule_strength : {type : String}
    }],
    packaging : {type : String},
    price : {type : String},
    prescription : {type : String},
    dose_taken : {type : String},
    dose_timing : {type : String},
    warnings : {type : String}
});

module.exports = mongoose.model('strength',Strength);
