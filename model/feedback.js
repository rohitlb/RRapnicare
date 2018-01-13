var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Feedback = new Schema({
    usefulness : {type : String},
    suggestion : {type : String}
});

module.exports = mongoose.model('feedback',Feedback);
