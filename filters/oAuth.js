const {pool} = require('../db/mySql');

const oAuth = (req, res, next) => {
    res.set('Content-Type', 'application/json; charset=utf-8')
    let token = req.header('X-Access-Token')
}