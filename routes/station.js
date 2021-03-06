var express = require('express');
var router = express.Router();
var query = require('../db/sqltest')
const jwt = require('jsonwebtoken');

//获取所有岗位
router.get('/getAllStation', function (req, res, next) {
    // var sql = 'select a.objname as stationName, b.objname as orgName from sz_station a ' +
    // " left join sz_org b on a.orgid = b.id where a.objname != '' order by b.objname "
    var sql = 'select objname as stationName,id as code from sz_station ' +
    " where objname != '' "
    query(sql, function (err, vals, fields) {
      if (err) {
        console.log(err);
      } else {
        res.json(vals)
      }
    })
  });

//根据职位名称搜索
router.post('/queryStationByName', function(req, res, next){
    var stationName = req.body.stationName;
    // var sql = 'select a.objname as stationName, b.objname as orgName from sz_station a ' +
    // " left join sz_org b on a.orgid = b.id where a.objname != '' and a.objname like  '%" + stationName + "%'"
    // + ' order by b.objname '
    var sql = 'select objname as stationName,id as code from sz_station ' +
    " where objname != '' and objname like  '%" + stationName + "%'";
    query(sql, function(err, vals, fields){
        if(err){
            console.log(err);
        }else{
            res.json(vals);
        }
    })
})

//获取所有部门 部分字段
router.get('/getAllStationSome', function(req, res, next){
  var sql = 'select id,objname from sz_station '
  query(sql, function(err, vals, fields){
    if(err){
      console.log(err)
    }else{
      res.json(vals)
    }
  })
})

//新OA 获取部门字段
router.get('/getNewAllStation', function(req, res, next){
  var sql = 'select id,objname from sz_station '
  query(sql, function(err, vals, fields){
    if(err){
      console.log(err)
    }else{
      var data = [];
            for (var i = 0; i < vals.length; i++) {
                var one = {
                    value: vals[i].id,
                    label: vals[i].objname
                }
                data.push(one)
            }
            res.json(data);
    }
  })
})

  module.exports = router;