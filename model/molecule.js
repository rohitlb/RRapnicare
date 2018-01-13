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
    side_effect : [{type : String}],
    precaution : [{type : String}],
    other_drug_interaction : [{type : String}],
    other_interaction :[ {subhead : {type : String},info : {type : String}}],
    // like food_interaction, etc : [{type : String}],
    dosage : [ {subhead : {type : String},info : {type : String}}],
    // dasage can be oral,intravenous ,  liver disorder , hepatic , COPD

    food : {type : String},
    //list of contra indications
    contraindications : [ {subhead : {type : String},info : {type : String}}],
    source : [{type : String}]
});

module.exports = mongoose.model('molecule',Molecule); //