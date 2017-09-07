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
            if (doc) {
                res.cookie("userId", doc.userId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                // req.session.header = user;
                res.json({
                    status: "1",
                    msg: err.message,
                    result: doc.userName
                })
            }
        }
    })
});


module.exports = router;