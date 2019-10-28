var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ProductSchema = new Schema({
    person_id: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true}
})

module.exports = mongoose.model('Product', ProductSchema);
