var mongoose = require('mongoose');


var Medicines = new mongoose.Schema({
    Company: [{
        Company_name: {type: String},
        Brands: [{
            Brand_name: {type: String},
            Salts: [{
                Salt_name: {type: String},
                Strength: {type: String}
            }],
            Dosage_form: {type: String},
            Price: {type: String}
        }]
    }]
});


module.exports=mongoose.model('medicines',Medicines);