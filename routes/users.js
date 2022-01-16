var express = require('express');
var router = express.Router();
var query = require('../db/sqltest')
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//登录
router.post('/login', function (req, res, next) {
  const key = '402881e70ad1d990010ad1e5ec930008';
  var data = {
    userName: req.body.userName,
    password: req.body.password
  }
  var sql = 'select * from sz_user where objno = ' + data.userName;
  query(sql, function (err, vals, fields) {
    if (err) {
      console.log(err);
    } else {
      if (vals == '') {
        console.log('没有该人员')
      } else {
        if(data.userName == '8930767'){
          var userInfo = {
            userId: vals[0].objno,
            userName: vals[0].objname,
            userOrgId: vals[0].orgid,
            userStationId : vals[0].mainstation,
            access: ['sysadmin']
          }
        }else{
          var userInfo = {
            userId: vals[0].objno,
            userName: vals[0].objname,
            userOrgId: vals[0].orgid,
            userStationId : vals[0].mainstation,
            access: []
          }
        }
        
        if (data.password == '123' || data.password == key) {
          const userToken = jwt.sign(userInfo, 'secret');
          
          res.send(userToken)
        } else {
          res.send('密码错误')
        }
      }
    }
  })

})

//退出登录
router.post('/logout', function (req, res, next) {
  res.clearCookie('token');
  res.send("退出成功")
})

//获取用户信息
router.get('/getUserInfo', function(req, res, next){
  const token = req.query.token;
  jwt.verify(token, 'secret', (error, decoded) => {
    if(error){
      console.log(error.message)
      return
    }
    res.json(decoded)
  })
})

//获取所有人员信息列表
router.get('/getAllUserInfo', function(req, res, next){
  var sql = 'select a.id, a.objno as userId, a.objname as userName, b.objname as stationName, c.objname as orgName from sz_user a' + 
  ' left join sz_station b on b.id = a.mainstation' +
  ' left join sz_org c on c.id = a.orgid '
  query(sql, function(err, vals, fields){
    if (err) {
      console.log(err);
    }else{
      res.json(vals)
    }
  })
})

//分页查询人员信息列表
router.post('/queryUserByPage', function(req, res, next){
  var data = {
    pageNo: req.body.pageNo,
    pageSize: req.body.pageSize
  }
  var limitMin = (data.pageNo-1)*data.pageSize
  var sql = 'select a.id, a.objno as userId, a.objname as userName, b.objname as stationName, c.objname as orgName from sz_user a' + 
  ' left join sz_station b on b.id = a.mainstation' +
  ' left join sz_org c on c.id = a.orgid limit ' + limitMin + ',' + data.pageSize
  query(sql, function(err, vals, fields){
    if (err) {
      console.log(err);
    }else{
      res.json(vals)
    }
  })
})

//根据userId搜索人员信息
router.post('/queryUserByUserId', function(req, res, next){
  var userId = req.body.userId;
  var sql = 'select a.id, a.objno as userId, a.objname as userName, b.objname as stationName, c.objname as orgName from sz_user a' + 
  ' left join sz_station b on b.id = a.mainstation' +
  " left join sz_org c on c.id = a.orgid  where a.objno like '%" + userId + "%' or a.objname like '%" + userId + "%'";
  query(sql, function(err, vals, fields){
    if (err) {
      console.log(err);
    }else{
      res.json(vals)
    }
  })
})

module.exports = router;
