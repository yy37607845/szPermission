var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var token = require('../const/token');
var getNewToken = require('../const/newToken');

const { pool } = require('../db/mySql');


router.get('/testRegist', async function (req, res, next) {
    var newToken = await getNewToken.get('SERVER_TOKEN')
    console.log(newToken)
    res.json(newToken)
})

//获取组织信息 
router.post('/syncOrg', function (req, res, next) {
    //  http://localhost:3000/getToken   http://155.103.100.84:8082/api/getToken
    //  http://localhost:3000/test          http://155.103.100.84:8082/api/getOrgList
    var e1 = request({ url: 'http://155.103.100.84:8082/api/getToken', method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': token }, form: { 'clientId': 'SYS003' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var getToken = JSON.parse(body).result;
                if (getToken == '') {
                    res.send('token 身份认证失败')
                } else {
                    var e = request({ url: 'http://155.103.100.84:8082/api/getOrgList', method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }, form: { 'authToken': getToken } },
                        function (error, response, body) {
                            //请求成功 并且 token验证成功后 插入数据
                            if (!error && response.statusCode == 200 && JSON.parse(body).code == '0') {
                                pool.getConnection((err, connection) => {
                                    var sql = 'insert into sz_org(id,mstationid,objno,dsporder,unitstatus,pid,objname) values ?'
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
                                        var v = JSON.parse(body).result;
                                        for (var i = 0; i < v.length; i++) {
                                            var v1 = [];
                                            v1.push(v[i].id);
                                            v1.push(v[i].mstationid);
                                            v1.push(v[i].objno);
                                            v1.push(v[i].dsporder);
                                            v1.push(v[i].unitstatus);
                                            v1.push(v[i].pid);
                                            v1.push(v[i].objname);
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
                            } else {
                                res.send('token失效或验证失败')
                            }
                        });
                }

            }
        })

});

//同步岗位信息
router.post('/syncStation', function (req, res, next) {
    //  http://localhost:3000/getToken   http://155.103.100.84:8082/api/getToken
    //  http://localhost:3000/test      http://155.103.100.84:8082/api/getStationList
    var e1 = request({ url: 'http://155.103.100.84:8082/api/getToken', method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': token }, form: { 'clientId': 'SYS003' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var getToken = JSON.parse(body).result;
                if (getToken == '') {
                    res.send('token 身份认证失败')
                } else {
                    var e = request({ url: 'http://155.103.100.84:8082/api/getStationList', method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, form: { 'authToken': getToken } },
                        function (error, response, body) {
                            //请求成功 并且 token验证成功后 插入数据
                            if (!error && response.statusCode == 200 && JSON.parse(body).code == '0') {
                                pool.getConnection((err, connection) => {
                                    var sql = 'insert into sz_station(id,orgid,dsporder,stationstatus,code,objname,parentobjid) values ?'
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
                                        var v = JSON.parse(body).result;
                                        for (var i = 0; i < v.length; i++) {
                                            var v1 = [];
                                            v1.push(v[i].id);
                                            v1.push(v[i].orgid);
                                            v1.push(v[i].dsporder);
                                            v1.push(v[i].stationstatus);
                                            v1.push(v[i].code);
                                            v1.push(v[i].objname);
                                            v1.push(v[i].parentobjid);
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
                }
            }
        })
});

//同步人员信息
router.post('/syncUser', function (req, res, next) {
    //  http://localhost:3000/getToken   http://155.103.100.84:8082/api/getToken
    //  http://localhost:3000/test         http://155.103.100.84:8082/api/getHrmList
    var e1 = request({ url: 'http://155.103.100.84:8082/api/getToken', method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': token }, form: { 'clientId': 'SYS003' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var getToken = JSON.parse(body).result;
                if (getToken == '') {
                    res.send('token 身份认证失败')
                } else {
                    var e = request({ url: 'http://155.103.100.84:8082/api/getHrmList', method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, form: { 'authToken': getToken } },
                        function (error, response, body) {
                            //请求成功 并且 token验证成功后 插入数据
                            if (!error && response.statusCode == 200 && JSON.parse(body).code == '0') {
                                pool.getConnection((err, connection) => {
                                    var sql = 'insert into sz_user(id,objno,objname,gender,functionaldept,orgid,mainstation,station,' +
                                        'telephone,mobile,employtype,hrstatus,identitycard,joindate,stationsort,orgsort,sort) values ?';
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
                                        var v = JSON.parse(body).result;
                                        for (var i = 0; i < v.length; i++) {
                                            var v1 = [];
                                            v1.push(v[i].id);
                                            v1.push(v[i].objno);
                                            v1.push(v[i].objname);
                                            v1.push(v[i].gender);
                                            v1.push(v[i].functionaldept);
                                            v1.push(v[i].orgid);
                                            v1.push(v[i].mainstation);
                                            v1.push(v[i].station);
                                            v1.push(v[i].telephone);
                                            v1.push(v[i].mobile);
                                            v1.push(v[i].employtype);
                                            v1.push(v[i].hrstatus);
                                            v1.push(v[i].identitycard);
                                            v1.push(v[i].joindate);
                                            v1.push(v[i].stationsort);
                                            v1.push(v[i].orgsort);
                                            v1.push(v[i].sort);
                                            values.push(v1)
                                        }
                                        connection.query(sql, [values], (err, result) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                res.json({ status: '0', msg: '人员信息添加成功' })
                                                connection.release();
                                            }
                                        })
                                    }
                                })
                            }
                        });
                }
            }
        })
});

module.exports = router