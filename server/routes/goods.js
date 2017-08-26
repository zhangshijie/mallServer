var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

mongoose.connect('mongodb://127.0.0.1:27017/mall');

mongoose.connection.on("connected",()=>{
  console.log("MonogoDB connected success");
});

mongoose.connection.on("error",()=>{
  console.log("MonogoDB connected fail");
});
mongoose.connection.on("disconected",()=>{
  console.log("MonogoDB disconnected")
});


router.get("/", (req, res,next) => {
  Goods.find({}, (error, doc)=> {
     if(error){
       res.json({
         status: '1',
         msg: error.message
       });
     } else {
       res.json({
         status:'0',
         msg:'',
         result: {
          count: doc.length,
          list: doc
         } 
       })
     }
  })
});


module.exports = router;