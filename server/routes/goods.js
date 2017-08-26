var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

mongoose.connect('mongodb://127.0.0.1:27017/mall');

mongoose.connection.on("connected", () => {
    console.log("MonogoDB connected success");
});

mongoose.connection.on("error", () => {
    console.log("MonogoDB connected fail");
});
mongoose.connection.on("disconected", () => {
    console.log("MonogoDB disconnected")
});


router.get("/", (req, res, next) => {
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let priceLevel = req.param("priceLevel");
    let sort = req.param("sort");
    let skip = (page - 1) * pageSize;
    let params = {};
    let priceGt = '',
        priceLte = '';
    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0':
                priceGt = 0;
                priceLte = 100;
                break;
            case '1':
                priceGt = 100;
                priceLte = 500;
                break;
            case '2':
                priceGt = 500;
                priceLte = 1000;
                break;
            case '3':
                priceGt = 1000;
                priceLte = 5000;
                break;
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }

    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({ 'salePrice': sort });
    goodsModel.exec((error, doc) => {
        if (error) {
            res.json({
                status: '1',
                msg: error.message
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});

//加入购物车
router.get("/addCart", (req, res, next) => {
    var userId = '100000077';
    var productId = req.query.productId;
    var User = require("../models/user");

    User.findOne({ userId: userId }, (err, userDoc) => {
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            });
        } else {
            if (userDoc) {
                let goodsItem = '';
                userDoc.cartList.forEach((item) => {
                    if (item.productId == productId) {
                        goodsItem = item;
                        item.productNum++;
                    }
                });

                if (goodsItem) {
                    userDoc.save((err2, doc) => {
                        if (err2) {
                            res.json({
                                status: "1",
                                msg: err2.message
                            })
                        } else {
                            res.json({
                                status: "0",
                                msg: '',
                                result: 'suc'
                            });
                        }
                    });

                } else {
                    Goods.findOne({ productId: productId }, (err, doc) => {
                        if (err) {
                            res.json({
                                status: "1",
                                msg: err.message
                            });
                        } else {
                            if (doc) {
                                doc.productNum = 1;
                                doc.checked = 1;
                                userDoc.cartList.push(doc);
                                userDoc.save((err2, doc) => {
                                    if (err2) {
                                        res.json({
                                            status: "1",
                                            msg: err2.message
                                        })
                                    } else {
                                        res.json({
                                            status: "0",
                                            msg: '',
                                            result: 'suc'
                                        });
                                    }
                                });
                            }
                        }
                    });
                }


            }
        }
    })
});
module.exports = router;