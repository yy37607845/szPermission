var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var getNewToken = require('../const/newToken');
const { pool } = require('../db/mySql');
const Map = require('../utils/mapUtil');

var map = new Map();
//请求ip + port
//const address = "http://192.168.0.31:81";
const address = "http://155.103.100.98";
//许可证id
//测试环境
//const appId = "43FD572D-32A0-4620-BB76-8E1FDE878BB2";
//生产环境
const appId = "70A9DBB3-30DF-459A-A902-84F169E1C347"

tk = ()=> {
    handle = async () => {
        var getV = await getNewToken;
        return getV;    
    }

    handle().then(value => {
        var data = value;
        var token = data.data.SERVER_TOKEN;
        console.log('请求到的token--', token);
        return token;
        
    })
    
}


//测试
router.get('/getNewToken', function(req, res, next){
    handle = async () => {
        var getV = await getNewToken;
        return getV;    
    }

    handle().then(value => {
        var data = value;
        var token = data.data.SERVER_TOKEN;
        console.log('请求到的token--', token);
        res.send('ddddd--')
        return token;
        
        
    })
    //res.send('dddd---')
    
})

//同步组织信息 
router.post('/syncOrg', function (req, res, next) {
    handle = async () => {
        var getV = await getNewToken;
        return getV;    
    }
    handle().then(value => {
        //获取服务器token
        var data = value;
        var newToken = data.data.SERVER_TOKEN;

    var e = request({
        url: address + '/api/custom/hr/getDeptList', method: 'get',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8', 'token': newToken, 'appid': appId, 'skipsession': '1' }
    },
        function (error, response, body) {
            //请求成功 并且 token验证成功后 插入数据
            if (!error && response.statusCode == 200 && JSON.parse(body).code == '0') {
                pool.getConnection((err, connection) => {
                    var sql = 'insert into sz_org(id,objno,dsporder,unitstatus,pid,objname) values ?'
                    var deleteSql = 'delete from sz_org';
                    if (err) {
                        console.log(err);
                    } else {
                        //先删除所有组织 然后同步
                        connection.query(deleteSql, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('删除成功');
                            }
                        })
                        var values = [];
                        var v = JSON.parse(body).data;
                        for (var i = 0; i < v.length; i++) {
                            var v1 = [];
                            v1.push(v[i].id);
                            //v1.push(v[i].mstationid);
                            v1.push(v[i].departmentcode);
                            v1.push(v[i].showorder);
                            v1.push(v[i].status);
                            v1.push(v[i].supdepid);
                            v1.push(v[i].departmentname);
                            values.push(v1)
                        }
                        connection.query(sql, [values], (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.json('组织信息添加成功')
                                connection.release();
                            }
                        })
                    }
                })
            }
         })
    })
});

//同步岗位信息
router.post('/syncStation', function (req, res, next) {
    handle = async () => {
        var getV = await getNewToken;
        return getV;    
    }
    handle().then(value => {
        //获取服务器token
        var data = value;
        var newToken = data.data.SERVER_TOKEN;

    var e = request({
        url: address + '/api/custom/hr/getJobTitlesList', method: 'get',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': newToken, 'appid': appId, 'skipsession': '1' }
    },
        function (error, response, body) {
            //请求成功 并且 token验证成功后 插入数据
            if (!error && response.statusCode == 200 && JSON.parse(body).code == '0') {
                pool.getConnection((err, connection) => {
                    var sql = 'insert into sz_station(id,stationstatus,code,objname) values ?'
                    var deleteSql = 'delete from sz_station';
                    if (err) {
                        console.log(err);
                    } else {
                        //先删除所有岗位 然后同步
                        connection.query(deleteSql, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('删除成功');
                            }
                        })
                        var values = [];
                        var v = JSON.parse(body).data;
                        for (var i = 0; i < v.length; i++) {
                            var v1 = [];
                            v1.push(v[i].id);
                            //v1.push(v[i].orgid);
                            //v1.push(v[i].dsporder);
                            v1.push(v[i].status);
                            v1.push(v[i].jobtitlecode);
                            v1.push(v[i].jobtitlename);
                            //v1.push(v[i].parentobjid);
                            values.push(v1)
                        }
                        connection.query(sql, [values], (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.json('岗位信息添加成功')
                                connection.release();
                            }
                        })
                    }
                })
            }
        });
    })

    
});

//同步人员信息
router.post('/syncUser', function (req, res, next) {
    handle = async () => {
        var getV = await getNewToken;
        return getV;    
    }
    handle().then(value => {
        //获取服务器token
        var data = value;
        var newToken = data.data.SERVER_TOKEN;

        var e = request({ url: address + '/api/custom/hr/getHrmUserList', method: 'get', 
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': newToken, 'appid': appId, 'skipsession': '1'  } },
        function (error, response, body) {
            //请求成功 并且 token验证成功后 插入数据
            if (!error && response.statusCode == 200 && JSON.parse(body).code == '0') {
                pool.getConnection((err, connection) => {
                    var sql = 'insert into sz_user(objno,objname,gender,orgid,mainstation,' +
                        'telephone,mobile,employtype,hrstatus,identitycard,joindate,sort) values ?';
                    var deleteSql = 'delete from sz_user';
                    if (err) {
                        console.log(err);
                    } else {
                        //先删除所有人员 然后同步
                        connection.query(deleteSql, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('删除成功');
                            }
                        })
                        var values = [];
                        var v = JSON.parse(body).data;
                        for (var i = 0; i < v.length; i++) {
                            var v1 = [];
                            //v1.push(v[i].id);
                            v1.push(v[i].workcode);
                            v1.push(v[i].lastname);
                            v1.push(v[i].sex);
                            //v1.push(v[i].functionaldept);
                            v1.push(v[i].departmentid);
                            v1.push(v[i].jobtitle);
                            //v1.push(v[i].station);
                            v1.push(v[i].telephone);
                            v1.push(v[i].mobile);
                            v1.push(v[i].employtype);
                            v1.push(v[i].status);
                            v1.push(v[i].certificatenum);
                            v1.push(v[i].companystartdate);
                            // v1.push(v[i].stationsort);
                            // v1.push(v[i].orgsort);
                            v1.push(v[i].dsporder);
                            values.push(v1)
                        }
                        connection.query(sql, [values], (err, result) => {
                            if (err) {
                                console.log(err);
                                res.json({ status: '101', msg: '人员信息添加失败'})
                            } else {
                                res.json({ status: '0', msg: '人员信息添加成功' })
                                connection.release();
                            }
                        })
                    }
                })
            }
        });
    })
    
});


// //获取组织信息 
// router.post('/syncOrg', function (req, res, next) {
//     var newToken = getNewToken.get('SERVER_TOKEN');
//     if (newToken == '' || newToken == null) {
//         newToken = getNewToken.get('SERVER_TOKEN');
//     }
//     console.log('newToken-----------', newToken)
//     var e = request({
//         url: address + '/api/custom/hr/getDeptList', method: 'get',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8', 'token': newToken, 'appid': appId, 'skipsession': '1' }
//     },
//         function (error, response, body) {
//             //请求成功 并且 token验证成功后 插入数据
//             if (!error && response.statusCode == 200 && JSON.parse(body).code == '0') {
//                 pool.getConnection((err, connection) => {
//                     var sql = 'insert into sz_org(id,objno,dsporder,unitstatus,pid,objname) values ?'
//                     var deleteSql = 'delete from sz_org';
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         //先删除所有组织 然后同步
//                         connection.query(deleteSql, (err, result) => {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 console.log('删除成功');
//                             }
//                         })
//                         var values = [];
//                         var v = JSON.parse(body).data;
//                         for (var i = 0; i < v.length; i++) {
//                             var v1 = [];
//                             v1.push(v[i].id);
//                             //v1.push(v[i].mstationid);
//                             v1.push(v[i].departmentcode);
//                             v1.push(v[i].showorder);
//                             v1.push(v[i].status);
//                             v1.push(v[i].supdepid);
//                             v1.push(v[i].departmentname);
//                             values.push(v1)
//                         }
//                         connection.query(sql, [values], (err, result) => {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 res.json('组织信息添加成功')
//                                 connection.release();
//                             }
//                         })
//                     }
//                 })
//             } else {
//                 res.send('token失效或验证失败')
//             }
//         });
// });

// //同步岗位信息
// router.post('/syncStation', function (req, res, next) {
//     var newToken = getNewToken.get('SERVER_TOKEN');
//     if (newToken == '' || newToken == null) {
//         newToken = getNewToken.get('SERVER_TOKEN');
//     }
//     console.log('newToken--', newToken)
//     var e = request({
//         url: address + '/api/custom/hr/getJobTitlesList', method: 'get',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': newToken, 'appid': appId, 'skipsession': '1' }
//     },
//         function (error, response, body) {
//             //请求成功 并且 token验证成功后 插入数据
//             if (!error && response.statusCode == 200 && JSON.parse(body).code == '0') {
//                 pool.getConnection((err, connection) => {
//                     var sql = 'insert into sz_station(id,stationstatus,code,objname) values ?'
//                     var deleteSql = 'delete from sz_station';
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         //先删除所有岗位 然后同步
//                         connection.query(deleteSql, (err, result) => {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 console.log('删除成功');
//                             }
//                         })
//                         var values = [];
//                         var v = JSON.parse(body).data;
//                         for (var i = 0; i < v.length; i++) {
//                             var v1 = [];
//                             v1.push(v[i].id);
//                             //v1.push(v[i].orgid);
//                             //v1.push(v[i].dsporder);
//                             v1.push(v[i].status);
//                             v1.push(v[i].jobtitlecode);
//                             v1.push(v[i].jobtitlename);
//                             //v1.push(v[i].parentobjid);
//                             values.push(v1)
//                         }
//                         connection.query(sql, [values], (err, result) => {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 res.json('岗位信息添加成功')
//                                 connection.release();
//                             }
//                         })
//                     }
//                 })
//             }
//         });
// });

// //同步人员信息
// router.post('/syncUser', function (req, res, next) {
//     var newToken = getNewToken.get('SERVER_TOKEN');
//     if (newToken == '' || newToken == null) {
//         newToken = getNewToken.get('SERVER_TOKEN');
//     }
//     var e = request({ url: address + '/api/custom/hr/getHrmUserList', method: 'get', 
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'token': newToken, 'appid': appId, 'skipsession': '1'  } },
//         function (error, response, body) {
//             //请求成功 并且 token验证成功后 插入数据
//             if (!error && response.statusCode == 200 && JSON.parse(body).code == '0') {
//                 pool.getConnection((err, connection) => {
//                     var sql = 'insert into sz_user(objno,objname,gender,functionaldept,orgid,mainstation,' +
//                         'telephone,mobile,employtype,hrstatus,identitycard,joindate,sort) values ?';
//                     var deleteSql = 'delete from sz_user';
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         //先删除所有人员 然后同步
//                         connection.query(deleteSql, (err, result) => {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 console.log('删除成功');
//                             }
//                         })
//                         var values = [];
//                         var v = JSON.parse(body).data;
//                         for (var i = 0; i < v.length; i++) {
//                             var v1 = [];
//                             //v1.push(v[i].id);
//                             v1.push(v[i].workcode);
//                             v1.push(v[i].lastname);
//                             v1.push(v[i].sex);
//                             v1.push(v[i].functionaldept);
//                             v1.push(v[i].departmentid);
//                             v1.push(v[i].jobtitle);
//                             //v1.push(v[i].station);
//                             v1.push(v[i].telephone);
//                             v1.push(v[i].mobile);
//                             v1.push(v[i].employtype);
//                             v1.push(v[i].status);
//                             v1.push(v[i].certificatenum);
//                             v1.push(v[i].companystartdate);
//                             // v1.push(v[i].stationsort);
//                             // v1.push(v[i].orgsort);
//                             v1.push(v[i].dsporder);
//                             values.push(v1)
//                         }
//                         connection.query(sql, [values], (err, result) => {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 res.json({ status: '0', msg: '人员信息添加成功' })
//                                 connection.release();
//                             }
//                         })
//                     }
//                 })
//             }
//         });
// });

module.exports = router