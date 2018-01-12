var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Molecule = new Schema({
    //about molecule
    molecule_name : {type : String},
    drug_categories : {type : String},
    description : [{type : String}],//a
    // pharmacokinetics
    absorption : {type : String},
    distribution : {type :String},
    metabolism : {type : String},
    excretion : {type : String},
    //adverse reactions/side effects
    side_effect : [{type : String}],//a
    precaution : [{type : String}],//a
    drug_interaction : [{type : String}],//a
    // topic other_interaction
    food_interaction : [{type : String}],//a
    oral : {type : String},
    intravenous : {type : String},
    food : {type : String},
    //list of contra indications
    contraindications : [ {subhead : {type : String},info : {type : String}}],
    source : [{type : String}]//a
});

module.exports = mongoose.model('molecule',Molecule);