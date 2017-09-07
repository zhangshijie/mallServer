var mongooose = require('mongoose');
var userSchema = new mongooose.Schema({
    "userId": String,
    "userName": String,
    "userPwd": String,
    "orderList": Array,
    "cartList": [{
        "productId": String,
        "productName": String,
        "salePrice": String,
        "productImage": String,
        "checked": String,
        "productNum": String
    }],
    "addressList": Array
});

module.exports = mongooose.model("User", userSchema, "users");