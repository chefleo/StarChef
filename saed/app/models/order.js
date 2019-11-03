var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var orderSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref:'User', required: true},
  products: [{type:Schema.Types.ObjectId, ref:'Product', required: true}],
  quantity: {type: Number, default: 1},
  total: {type: Number, default: 0}
})

module.exports = mongoose.model('Order', orderSchema);
