var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Brand = new Schema({
    brand_name : {type: String},
    categories : { type : String },
    primarily_used_for : [{type : String}],
    types : {type : String},
    dosage_id : [{type : Schema.Types.ObjectId , ref : 'dosage'}],
    company_id : [{type : Schema.Types.ObjectId , ref : 'company'}],
    keywords :[{
        brandname : {type : String},
        category : {type : String},
        types : {type : String},
        dosage : {type : String} ,
        companyname : {type : String}
    }]
});

module.exports = mongoose.model('brand',Brand);