var express = require('express');
var router = express.Router();
var query = require('../db/sqltest')
const jwt = require('jsonwebtoken');

// router.post('/', function (req, res, next) {
//     var sql = 'select permission_id from sz_user where objno = ' + req.body.userName;
//     query(sql, function (err, vals, fields) {
//         if (err) {
//             console.log(err);
//           } else {
//             var sqlone = 'select publish_id,name from sz_art';
//               if(vals[0].permission_id == 1){
//                   query(sqlone, function (err, vals, fields) {
//                     if (err) {
//                         console.log(err);
//                       } else {
//                           res.json(vals)
//                       }
//                   })
//               }else{
//                   var sqltwo = sqlone + ' where permission_id = "0" '
//                   query(sqltwo, function (err, vals, fields) {
//                     if (err) {
//                         console.log(err);
//                       } else {
//                           res.json(vals)
//                       }
//                   })
//               }
//           }
//     })
// })


router.post('/', function (req, res, next) {
    var sql = 'select publish_id,name from sz_art';
    query(sql, function (err, vals, fields) {
        if (err) {
            console.log(err);
        } else {
            res.json(vals)
        }
    })
})

module.exports = router;