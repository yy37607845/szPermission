var express = require('express');
var router = express.Router();
var query = require('../db/sqltest')

//  获取所有已经发布大屏
router.post('/getAllArt', function(req, res, next){
  var sql = 'select id,art_id as artId, publish_id as publishId, name from bas_art where is_online = 1'
    // var sql = 'select a.project_id, a.name from bas_project a left join bas_user b ' +
    // "on a.user_id = b.user_id where b.mobile = '19804067924'"

    query(sql, function(err, vals, fields){
        if (err) {
            console.log(err);
          } else {
            res.json(vals)
          }
    })
})

router.post('/getArt', function(req, res, next){
    var project_id = req.body.projectId;
    var sql = 'select a.project_id, a.art_id, a.name from bas_art a '+
    'left join bas_project b on a.project_id = b.project_id ' +
    "left join bas_user c on a.user_id = c.user_id where c.mobile = '19804067924' " +
    "and b.project_id = '" + project_id + "'";

    query(sql, function(err, vals, fields){
        if (err) {
            console.log(err);
          } else {
            res.json(vals)
          }
    })
})

router.post('/getProjectMenuByOrgId', function(req, res, next){
  var orgId = req.body.orgId;
  var userId = req.body.userId;
  var sql = "select b.id as projectId, b.name as projectName from sz_rel_org_project a " +
  "left join sz_project b on a.project_id = b.id where a.org_id = '" + orgId + "'";

  var allSql = "select a.id as projectId, a.name as projectName from sz_project a"
  if(userId == '8930767'){
    query(allSql, function(err, vals, fields){
      if(err){
        console.log(err)
      }else{
        res.json(vals)
      }
    })
  }else{
    query(sql, function(err, vals, fields){
      if(err){
        console.log(err)
      }else{
        res.json(vals)
      }
    })
  }

  
})

router.post('/getArtTableByProjectId', function(req, res, next){
  var projectId = req.body.projectId;
  var stationId = req.body.stationId;
  // var sql = "select b.publish_id as publishId,b.name as artName from sz_rel_art_project a " +
  // "left join sz_art b on a.art_id = b.id where a.project_id = '" + projectId + "'"
  var sql = "select b.publish_id as publishId,b.name as artName from sz_rel_art_project a " +
  "left join sz_art b on a.art_id = b.id " + 
  "left join sz_permission c on a.art_id = c.art_id " + 
  "where a.project_id = '" + projectId + "' and c.station_id = '" + stationId + "'";
  query(sql, function(err, vals, fields){
    if(err){
      console.log(err)
    }else{
      // var prefix = "http://119.45.200.52:9099/publish/";
      // for(var i = 0; i < vals.length; i++){
      //   vals[i].publishId = prefix + vals[i].publishId;
      // }
      res.json({ code: '0', msg: '获取已上线大屏成功', data: vals })
    }
  })
  
})

module.exports = router;