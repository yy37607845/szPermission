var express = require('express');
var router = express.Router();
var query = require('../db/sqltest');
var basQuery = require('../db/waveviewSql');
const {pool}  = require('../db/mySql');
const async = require('async');
const jwt = require('jsonwebtoken');

//获取所有项目
router.get('/getAllProject', function (req, res, next) {
    var sql = 'select id, name, description,orgids from sz_project';
    query(sql, function (err, vals, fields) {
        if (err) {
            console.log(err);
        } else {
            var data = [];
            for (var i = 0; i < vals.length; i++) {
                var orgidArr = [];
                if (vals[i].orgids != '' && vals[i].orgids != null) {
                    orgidArr = vals[i].orgids.split(",");
                }
                var one = {
                    id: vals[i].id,
                    name: vals[i].name,
                    description: vals[i].description,
                    menus: orgidArr
                }
                data.push(one)
            }
            res.json(data);
        }
    })
})

//新增项目
router.post('/insertProject', function (req, res, next) {
    var name = req.body.name;
    var desc = req.body.description;
    var sql = "insert into sz_project(name,description) values ('" + name + "','" + desc + "')";
    query(sql, function (err, vals, fields) {
        if (err) {
            console.log(err);
        } else {
            var data = { code: '0', msg: '新增项目成功' }
            res.json(data);
        }
    })
})

//更新项目
router.post('/updateProject', function (req, res, next) {
    var id = req.body.id;
    var name = req.body.name;
    var desc = req.body.description;
    var sql = "update sz_project set name = '" + name + "',description = '" + desc + "' where id = " + id;
    query(sql, function (err, vals, fields) {
        if (err) {
            console.log(err);
            var data = { code: '-1', msg: '更新项目失败' }
            res.json(data);
        } else {
            var data = { code: '0', msg: '更新项目成功' }
            res.json(data);
        }
    })
})

//更新项目 关联部门
router.post('/updateRelatedOrg', function (req, res, next) {
    var projectId = req.body.projectId;
    var orgArr = req.body.orgArr;
    var orgIds = orgArr.toString();
    var delSql = 'delete from sz_rel_org_project where project_id = ' + projectId;
    query(delSql, function(err, vals, fields){
        if(err){
            console.log(err)
        }else{
            console.log('成功删除' + orgArr.length + '条')
            for(var i=0; i<orgArr.length; i++){
                var insertSql = "insert into sz_rel_org_project(project_id,org_id) values ('" + projectId.toString() + "','" + orgArr[i].toString() + "')";
                query(insertSql, function(err, vals, fields){
                    if(err){
                        console.log(err)
                    }else{
                        console.log('插入成功')
                    }
                })
            }
        }
    })
    var updateSql = "update sz_project set orgids = '" + orgIds + "' where id = " + projectId;
    query(updateSql, function (err, vals, fields) {
        if (err) {
            console.log(err)
            var data = { code: '-1', msg: '关联部门失败' }
            res.json(data);
        } else {
            var data = { code: '0', msg: '关联部门成功' }
            res.json(data);
        }
    })

})

//根据名称搜索项目
router.post('/queryProjectByName', function (req, res, next) {
    var projectName = req.body.projectName;
    var sql = "select * from sz_project where name like '%" + projectName + "%'"
    query(sql, function (err, vals, fields) {
        if (err) {
            console.log(err);
        } else {
            var data = [];
            for (var i = 0; i < vals.length; i++) {
                var orgidArr = [];
                if (vals[i].orgids != '' && vals[i].orgids != null) {
                    orgidArr = vals[i].orgids.split(",");
                }
                var one = {
                    id: vals[i].id,
                    name: vals[i].name,
                    description: vals[i].description,
                    menus: orgidArr
                }
                data.push(one)
            }
            res.json(data);
        }
    })
})

//删除项目
router.post('/deleteProjectById', function (req, res, next) {
    var id = req.body.id;
    var sql = 'delete from sz_project where id = ' + id;
    var delArtRelSql = 'delete from sz_rel_art_project where project_id = ' + id;
    var delSql = sql + ';' + delArtRelSql
    query(delSql, function (err, vals, fields) {
        if (err) {
            console.log(err);
            var data = { code: '-1', msg: '删除项目失败' }
            res.json(data);
        } else {
            var data = { code: '0', msg: '删除项目成功' }
            res.json(data);
        }
    })
})

//获取所有发布大屏
router.get('/getAllArtOnline', function (req, res, next) {
    // var sql = "select  a.id, a.art_id as artId, a.publish_id as publishId, a.name, GROUP_CONCAT(b.project_id SEPARATOR ',') as projectids from sz_art a " +
    // "left join sz_rel_art_project b on a.id = b.art_id  group by a.id "
    var sql = "select a.id, a.art_id as artId, a.publish_id as publishId, a.name, a.projectids, GROUP_CONCAT(c.station_id SEPARATOR ',') as stationids  from sz_art a " +
            "left join sz_permission c on a.id = c.art_id group by a.id "
    query(sql, function (err, vals, fields) {
        if (err) {
            console.log(err)
        } else {
            var data = [];
            for (var i = 0; i < vals.length; i++) {
                var projectIdArr = [];
                if (vals[i].projectids != '' && vals[i].projectids != null) {
                    projectIdArr = vals[i].projectids.split(",");
                }
                var stationArr = [];
                if(vals[i].stationids != '' && vals[i].stationids != null){
                    stationArr = vals[i].stationids.split(',');
                }
                var one = {
                    id: vals[i].id,
                    artId: vals[i].artId,
                    publishId: vals[i].publishId,
                    name: vals[i].name,
                    menus: projectIdArr,
                    stations: stationArr
                }
                data.push(one)
            }
            res.json(data);
        }
    })
})

//根据大屏名称搜索
router.post('/queryArtByName', function (req, res, next) {
    var name = req.body.name;
    // var sql = "select  a.id, a.art_id as artId, a.publish_id as publishId, a.name, GROUP_CONCAT(b.project_id SEPARATOR ',') as projectids from sz_art a " +
    // "left join sz_rel_art_project b on a.id = b.art_id where a.name like '%" + name + "%' group by a.id "
    var sql = "select a.id, a.art_id as artId, a.publish_id as publishId, a.name, a.projectids, GROUP_CONCAT(c.station_id SEPARATOR ',') as stationids  from sz_art a " +
            "left join sz_permission c on a.id = c.art_id where a.name like '%" + name + "%' group by a.id "
    query(sql, function (err, vals, fields) {
        if (err) {
            console.log(err)
        } else {
            var data = [];
            for (var i = 0; i < vals.length; i++) {
                var projectIdArr = [];
                if (vals[i].projectids != '' && vals[i].projectids != null) {
                    projectIdArr = vals[i].projectids.split(",");
                }
                var stationArr = [];
                if(vals[i].stationids != '' && vals[i].stationids != null){
                    stationArr = vals[i].stationids.split(',');
                }
                var one = {
                    id: vals[i].id,
                    artId: vals[i].artId,
                    publishId: vals[i].publishId,
                    name: vals[i].name,
                    menus: projectIdArr,
                    stations: stationArr
                }
                data.push(one)
            }
            res.json(data);
        }
    })
})

//修改大屏名称
router.post('/updateArtNameById', function (req, res, next) {
    var artId = req.body.artId;
    var name = req.body.name;
    var sql = "update sz_art set name = '" + name + "' where art_id = '" + artId + "'";
    query(sql, function (err, vals, fields) {
        if (err) {
            console.log(err);
            var data = { code: '-1', msg: '修改失败' }
            res.json(data);
        } else {
            var data = { code: '0', msg: '修改成功' }
            res.json(data);
        }
    })
})

//删除大屏
router.post('/delArtById', function (req, res, next) {
    var artId = req.body.artId;
    var sql = "delete from sz_art where id = '" + artId + "'";
    var delRelSql = "delete from sz_rel_art_project where art_id = '" + artId + "'";
    var permissionSql = "delete from sz_permission where art_id = '" + artId + "'";
    var delSql = sql + ";" + delRelSql + ";" + permissionSql;
    console.log('delSql-----', delSql)
    query(delSql, function (err, vals, fields) {
        if (err) {
            console.log(err)
            var data = { code: '-1', msg: '删除大屏失败' }
            res.json(data);
        } else {
            var data = { code: '0', msg: '删除大屏成功' }
            res.json(data);
        }
    })
})

//从澜图获取已经上线的大屏用来 新增到 管理系统大屏
router.get('/getOnlineArt', function (req, res, next) {
    var sql = 'select b.name as projectName,b.project_id as projectId from bas_art a' +
        ' left join bas_project b on a.project_id = b.project_id where a.is_online = 1 and a.dtime is null' +
        ' group by a.project_id'
    basQuery(sql, function (err, vals, fields) {
        if (err) {
            console.log(err);
            var data = { code: '-1', msg: '获取已上线大屏失败' }
            res.json(data);
        } else {
            var result = [];

            async.forEachOf(vals, function (dataElement, i, callback) {
                var projectName = dataElement['projectName']
                var projectId = dataElement['projectId'];
                var sql = "select name as artName, art_id as artId from bas_art where is_online = 1 and dtime is null and project_id = '" + projectId + "'";
                basQuery(sql, function (err, vals, fields) {
                    if (err) {
                        console.log(err);
                        callback(err)
                    } else {
                        var children = [];
                        for (var j = 0; j < vals.length; j++) {
                            var art = {};
                            art = { value: vals[j].artId, label: vals[j].artName }
                            children.push(art);
                        }
                        var data = { value: projectId, label: projectName, children: children }
                        result.push(data)
                        callback(null)
                    }
                })
            },function(err){
                if(err){
                    console.log(err)
                }else{
                    res.json({ code: '0', msg: '获取已上线大屏成功', data: result })
                }
            })
        }
    })
})

//新增大屏
router.post('/insertScreen', function(req, res, next){
    var id = req.body.artId;
    var sql = "select art_id as artId, publish_id as publishId, name from bas_art where art_id = '" + id + "'"
    basQuery(sql, function(err, vals, fields){
        if (err) {
            console.log(err);
            var data = { code: '-1', msg: '无此大屏' }
            res.json(data);
        }else{
            var values = []
            var value = [];
            value.push(vals[0].artId);
            value.push(vals[0].publishId);
            value.push(vals[0].name);
            values.push(value)
            
            pool.getConnection((err, connection) => {
                var insertSql = "insert into sz_art(art_id, publish_id, name) values ?"
                if (err) {
                    console.log(err);
                } else {
                    connection.query(insertSql, [values], (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json({ code: '0', msg: '新增大屏成功' })
                            connection.release();
                        }
                    })
                }
            })
        }
    })
})

//大屏管理获取项目列表
router.get('/getSelectProject', function (req, res, next) {
    var sql = 'select id, name from sz_project';
    query(sql, function (err, vals, fields) {
        if (err) {
            console.log(err);
        } else {
            var data = [];
            for (var i = 0; i < vals.length; i++) {
                var one = {
                    value: vals[i].id,
                    label: vals[i].name
                }
                data.push(one)
            }
            res.json(data);
        }
    })
})

//大屏关联项目
router.post('/artRelProject', function(req, res, next){
    var artId = req.body.artId;
    var projectArr = req.body.projectIds;
    var projectIds = projectArr.toString();
    var delSql = 'delete from sz_rel_art_project where art_id = ' + artId.toString();
    query(delSql, function(err, vals, fields){
        if(err){
            console.log(err)
        }else{
            console.log('成功删除' + projectArr.length + '条')
            for(var i=0; i<projectArr.length; i++){
                var insertSql = "insert into sz_rel_art_project(art_id,project_id) values ('" + artId.toString() + "','" + projectArr[i].toString() + "')";
                query(insertSql, function(err, vals, fields){
                    if(err){
                        console.log(err)
                    }else{
                        console.log('插入成功')
                    }
                })
            }
        }
    })
    var updateSql = "update sz_art set projectids = '" + projectIds + "' where id = " + artId;
    query(updateSql, function (err, vals, fields) {
        if (err) {
            console.log(err)
            var data = { code: '-1', msg: '关联项目失败' }
            res.json(data);
        } else {
            var data = { code: '0', msg: '关联项目成功' }
            res.json(data);
        }
    })
})

//大屏权限配置 -- 获取职位
router.post('/getStationPermission', function(req, res, next){
    var artId = req.body.artId; //主键id
    
    var sql = "select a.id,a.orgid,a.objname as 'stationName',a.parentobjid as 'pid',d.objname as 'deptName' from sz_station a " +
    "left join sz_rel_org_project b on a.orgid = b.org_id " +
    "left join sz_rel_art_project c on b.project_id = c.project_id " +
    "left join sz_org d on d.id = a.orgid " + 
    "where c.art_id = " + artId + " group by a.id";
    query(sql, function(err, vals, fields){
        if(err){
            console.log(err)
        }else{
            var treeData = [];
            treeData = computedMenuData(vals)
            var data = { code: '0', msg: '设置权限成功', data: treeData }
            res.json(data)
        }
    })
})

//数据处理为 treeData
function computedMenuData (array) {
    let treeData = [];
  
    // 外层节点
    array.forEach(menu => {
      if(menu.pid === "402881eb112f5af201112ff3afe10004" || menu.pid === '1be7e4d4550b4c8301550e8a599800ac') {
        treeData.push({
            id: menu.id,
            title: menu.deptName + '-' + menu.stationName,
            pid: menu.pid,
            children: []
          });
      }
        
    });
  
    // 内层节点：递归
    const handleRecurrence = recurrenceData => {
      recurrenceData.forEach(data => {
        array.forEach(menu => {
          data.id === menu.pid &&
            data.children.push({
             id: menu.id,
             title: menu.deptName + '-' + menu.stationName,
             pid: menu.pid,
             children: []
            });
        });
        // console.log(data);
        handleRecurrence(data.children);
      });
    };
    handleRecurrence(treeData);
  
    // 外层第一项若有内层，则展开
    //treeData.length > 0 && (treeData[0].expand = true);
    return treeData;
  };



//大屏 获取新OA 权限配置  -- 获取岗位
router.post('/getNewStationPermission', function(req, res, next){
    var artId = req.body.artId; //大屏主键id

    var sql = " select DISTINCT a.id, a.objname from sz_station a " + 
    "left join sz_user b on a.id = b.mainstation " + 
    "left join sz_rel_org_project c on c.org_id = b.orgid " + 
    "left join sz_rel_art_project d on c.project_id = d.project_id where d.art_id = " + artId;

    query(sql, function(err, vals, fields){
        if(err){
            console.log(err)
        }else{
            var data = [];
            for (var i = 0; i < vals.length; i++) {
                var one = {
                    value: Number(vals[i].id),
                    label: vals[i].objname
                }
                data.push(one)
            }
            // var result = {code: '0', msg: '设置权限成功', data: data}
            // res.json(result);
            res.json(data)
        }
    })
})  

router.post('/setPermission', function(req, res, next){
    var artId = req.body.artId;
    var stationArr = req.body.stationArr;
    var delSql = 'delete from sz_permission where art_id = ' + artId.toString();
    query(delSql, function(err, vals, fields){
        if(err){
            console.log(err)
        }else{
            console.log('成功删除' + stationArr.length + '条')
            for(var i=0; i<stationArr.length; i++){
                var insertSql = "insert into sz_permission(art_id,station_id) values ('" + artId.toString() + "','" + stationArr[i].toString() + "')";
                query(insertSql, function(err, vals, fields){
                    if(err){
                        console.log(err)
                    }else{
                        console.log('插入成功')                       
                    }
                })
            }
            var data = { code: '0', msg: '权限设置成功' }
            res.json(data);
        }
    })
})


module.exports = router;