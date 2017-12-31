var mongoose = require('mongoose'),
    promise = require('bluebird');

mongoose.Promise = promise;

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AdminSchema = new Schema(
    {
        admin_id: {type: ObjectId},
        name: {type: String},
        username: {type: String},
        mobNum: {type: String},
        password: {type: String}
    }
);

module.exports = mongoose._model('Admin',AdminSchema);