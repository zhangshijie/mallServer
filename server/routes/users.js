var express = require('express');
var router = express.Router();
var User = require('./../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});




router.post("/login", (req, res, next) => {
    var param = {
        userName: req.body.userName,
        userPwd: req.body.userPwd
    }
    User.findOne(param, (err, doc) => {
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            });
        } else {
            console.log(doc);
            if (doc) {
                res.cookie("userId", doc.userId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                res.cookie("userName", doc.userName, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                res.json({
                    status: "0",
                    msg: "",
                    result: {
                        userName: doc.userName
                    }
                })
            }
        }
    })
});

//退出登录
router.post("/logout", (req, res, next) => {

    if (!req.cookies.userId) {
        res.json({
            status: "0",
            result: '',
            msg: ''
        });
    } else {
        res.cookie("userId", "", {
            path: "/",
            maxAge: -1
        })

        res.json({
            status: "0",
            result: '',
            msg: ''
        })
    }
});

router.get("/checkLogin", (req, res, next) => {
    // console.log('进来checkLogin了')
    // console.log(req.cookies);
    if (req.cookies.userId) {
        res.json({
            status: '0',
            msg: '',
            result: req.cookies.userName
        });
    } else {
        res.json({
            status: '1',
            msg: '未登录',
            result: ''
        });
    }
});


router.get("/cartList", (req, res, next) => {
    var userId = req.cookies.userId;
    User.findOne({ userId: userId }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            });
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: doc.cartList
                });
            }
        }

    });
});

router.post("/cart/del", (req, res, next) => {
    var userId = req.cookies.userId,
        productId = req.body.productId;
    User.update({ userId: userId }, {
        $pull: {
            'cartList': {
                'productId': productId
            }
        }
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: 'suc'
            });
        }
    });
});


router.post("/cart/edit", function(req, res, next) {
    var userId = req.cookies.userId,
        productId = req.body.productId,
        productNum = req.body.productNum,
        checked = req.body.checked;
    console.log("服务端收到productNum")
    console.log(productNum)
    User.update({ "userId": userId, "cartList.productId": productId }, {
        "cartList.$.productNum": productNum,
        "cartList.$.checked": checked,
    }, function(err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: 'suc'
            });
        }
    })
});

router.post("/editCheckAll", (req, res, next) => {

    var userId = req.cookies.userId,
        checkAll = req.body.checkAll ? '1' : '0';
    User.findOne({ "userId": userId }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            });
        } else {
            if (doc) {
                doc.cartList.forEach((item) => {
                    item.checked = checkAll;
                });
                doc.save((err, doc) => {
                    if (err) {
                        res.json({
                            status: '1',
                            msg: err.message,
                            result: ''
                        });

                    } else {
                        res.json({
                            status: '0',
                            msg: '',
                            result: doc
                        });
                    }
                })

            }

        }
    });
});


router.get("/addressList", (req, res, next) => {
    var userId = req.cookies.userId;
    User.findOne({ userId: userId }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            });
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: doc.addressList
                });
            }
        }

    });
});

router.post("/setDefaultAddress", (req, res, next) => {

    var userId = req.cookies.userId,
        addressId = req.body.addressId;
    if (!addressId) {
        res.json({
            status: '1003',
            msg: 'addressid is null',
            result: ''
        })
    }
    User.findOne({ "userId": userId }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            });
        } else {
            if (doc) {
                doc.addressList.forEach((item) => {
                    item.isDefault = item.addressId == addressId;
                });
                doc.save((err, doc) => {
                    if (err) {
                        res.json({
                            status: '1',
                            msg: err.message,
                            result: ''
                        });

                    } else {
                        res.json({
                            status: '0',
                            msg: '',
                            result: doc
                        });
                    }
                })
            }
        }
    });
});

router.post("/delAddress", (req, res, next) => {
    var userId = req.cookies.userId,
        addressId = req.body.addressId;
    User.update({
        userId: userId
    }, {
        $pull: {
            'addressList': {
                'addressId': addressId
            }
        }
    }, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: ''
            });
        }
    });
});

module.exports = router;