var express = require('express');
var router = express.Router();
var query = require('../db/sqltest')
const jwt = require('jsonwebtoken');

//获取所有组织机构
router.get('/getAllOrg', function (req, res, next) {
  var sql = 'select a.objname as orgName, a.objno as orgNo, b.objname as mstationName from sz_org a ' +
  ' left join sz_station b on a.mstationid = b.id order by a.dsporder'
  query(sql, function (err, vals, fields) {
    if (err) {
      console.log(err);
    } else {
      res.json(vals)
    }
  })
});

//搜索组织机构
router.post('/queryOrgByName', function(req, res, next){
  var orgName = req.body.orgName;
  var sql = 'select a.objname as orgName, a.objno as orgNo, b.objname as mstationName from sz_org a ' +
  "left join sz_station b on a.mstationid = b.id where a.objno like '%" + orgName + "%' or a.objname like '%" + orgName + "%'" ;
  query(sql, function (err, vals, fields) {
    if (err) {
      console.log(err);
    } else {
      res.json(vals)
    }
  })
})

//获取所有部门 部分字段
router.get('/getAllOrgSome', function(req, res, next){
  var sql = 'select id,objno,objname,pid from sz_org '
  query(sql, function(err, vals, fields){
    if(err){
      console.log(err)
    }else{
      res.json(vals)
    }
  })
})

module.exports = router;