var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Brand = new Schema({
    brand_name : {type: String},
    categories : { type : String },
    primarily_used_for : [{type : String}],
    types : {type : String},
    // here all the molecules should be mentioned which are used in it
    // so that it can help for finding the similar brands
    // molecules : [{type : String}],
    dosage_id : [{type : Schema.Types.ObjectId , ref : 'dosage'}],
    company_id : [{type : Schema.Types.ObjectId , ref : 'company'}]
});

module.exports = mongoose.model('brand',Brand);