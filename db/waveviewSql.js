const mysql = require('mysql');
let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    // password: 'root@1298',
    // database: 'waveview',

    password: '123456',
    database: 'szdp',

    // password: 'root123',
    // database: 'waveview',
    port: '3306',
    waitForConnections:true,    //当无连接池可用时，等待还是抛错
    connectionLimit:100,    //连接限制
    queueLimit:0, //最大连接等待数
    multipleStatements:true
});

var  query = function(sql,callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err, null, null)
        }else{
            conn.query(sql,function(qerr, vals,fields){
                conn.release();
                callback(qerr,vals,fields);
            })
        }
    })
}

module.exports = query;