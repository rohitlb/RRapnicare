var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// all these elements in keyword have to be stored in this JSON, it will make search easier

var Brand = new Schema({
    brand_name : {type: String},
    categories : { type : String },
    primarily_used_for : [{type : String}],
    types : {type : String},
    dosage_id : [{type : Schema.Types.ObjectId , ref : 'dosage'}],
    company_id : [{type : Schema.Types.ObjectId , ref : 'company'}],
    keywords :[{brandname, category, types, dosage , company name}]
});

module.exports = mongoose.model('brand',Brand);