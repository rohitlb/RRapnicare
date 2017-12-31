var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Molecule = new Schema({
    //about molecule
    molecule_name : {type : String},
    drug_categories : {type : String},
    description : {type : String},
    // pharmacokinetics
    absorption : {type : String},
    distribution : {type :String},
    metabolism : {type : String},
    excretion : {type : String},
    //adverse reactions/side effects
    side_effect : {type : String},
    precaution : {type : String},
    drug_interaction : {type : String},
    food_interaction : {type : String},
    oral : {type : String},
    intravenous : {type : String},
    food : {type : String},
    //list of contra indications
    contraindications : [ {subhead : {type : String},info : {type : String}}],
    source : {type:String}
});

module.exports = mongoose.model('molecule',Molecule);