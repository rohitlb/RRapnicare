var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Brand = new Schema({
    brand_name : {type: String},
    categories : { type : String },
    dosage_id : [{type : Schema.Types.ObjectId , ref : 'dosage'} ],
    strengths_ids : [{type : Schema.Types.ObjectId , ref : 'strength'} ]
});

module.exports = mongoose.model('brand',Brand);