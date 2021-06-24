const mysql = require('mysql');
let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    //远程
    // password: 'root123',
    // database: 'szdp',
    //本地
    password:'123456',
    database:'szdp_branch',
    //行里服务器
    // password: 'root@1298',
    // database: 'szdp',
    port: '3306',
    waitForConnections:true,    //当无连接池可用时，等待还是抛错
    connectionLimit:100,    //连接限制
    queueLimit:0, //最大连接等待数
    multipleStatements:true
});

module.exports = {pool}