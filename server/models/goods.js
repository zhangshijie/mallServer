var mongoose = require('mongoose')
var schema = mongoose.Schema;

var productSchema = new schema({
    "productId": String,
    "productName": String,
    "salePrice": Number,
    "productImage": String,
    "productUrl": String,
    "checked": String,
    "productNum": String
});


module.exports = mongoose.model('Good', productSchema, 'Goods');