var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Company = new Schema({
    company_name : {type : String},
    brand_id : [{type : Schema.Types.ObjectId , ref : 'brand'} ],
    keywords : [{type : String}]
    //[{companyname : {type : String} , brandname : {type : String} }]
});

module.exports = mongoose.model('company',Company);
