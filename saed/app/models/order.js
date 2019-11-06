var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref:'User', required: true },
  product: { type: Schema.Types.ObjectId, ref:'Product', required: true },
  quantity: { type: Number, default: 1 }
})

module.exports = mongoose.model('Order', orderSchema);
