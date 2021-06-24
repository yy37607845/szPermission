var express = require('express');
var router = express.Router();
var query = require('../db/sqltest')

const routedata = [{
    path: '/oaInfo',
    name: '人员',
    meta: {
      access: ['sysadmin'],
      hideInBread: true
    },
    component: 'components/main',
    children: [
      {
        path: 'person',
        name: 'person',
        meta: {
          icon: 'ios-people',
          title: '人员',
        },
        component: 'view/oaInfo/person.vue'
      }
    ]
  },
  {
    path: '/oaInfo',
    name: '部门',
    meta: {
      access: ['sysadmin'],
      hideInBread: true
    },
    component: 'components/main',
    children: [
      {
        path: 'org',
        name: 'org',
        meta: {
          icon: 'ios-people',
          title: '部门'
        },
        component: 'view/oaInfo/org.vue'
      }
    ]
  },
  {
    path: '/oaInfo',
    name: '职位',
    meta: {
      access: ['sysadmin'],
      hideInBread: true
    },
    component: 'components/main',
    children: [
      {
        path: 'station',
        name: 'station',
        meta: {
          icon: 'ios-people',
          title: '职位'
        },
        component: 'view/oaInfo/station.vue'
      }
    ]
  },
  {
    path: '/projectMenu',
    name: '项目列表',
    meta: {
      // showAlways : true,
      // icon: 'ios-options',
      // title: '项目列表'
      hideInBread: true
    },
    component: 'components/main',
    children: [
      {
        path: 'projectList',
        name: 'projectList',
        meta: {
          icon: 'ios-options',
          title: '项目列表'
        },
        component: 'view/projectMenu/projectList.vue'
      },
    ]
  },

  {
    path: '/settings',
    name: 'settings',
    meta: {
      access: ['sysadmin'],
      icon: 'ios-settings',
      title: '设置'
    },
    component: 'components/main',
    children: [
      {
        path: 'project',
        name: 'project',
        meta: {
          icon: 'ios-navigate',
          title: '项目管理'
        },
        component: 'view/settings/project.vue'
      },
      {
        path: 'screen',
        name: 'screen',
        meta: {
          icon: 'ios-navigate',
          title: '大屏管理'
        },
        component: 'view/settings/screen.vue'
      },
      // {
      //   path: 'auth',
      //   name: 'auth',
      //   meta: {
      //     icon: 'ios-navigate',
      //     title: '权限管理'
      //   },
      //   component: 'view/settings/project11.vue'
      // },
    ]
  },]

router.get('/getRouters', function(req, res, next){
    res.json({code: '0', msg: '获取路由成功', data: routedata});
})

module.exports = router;