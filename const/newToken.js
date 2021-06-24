var async = require('async');
const request = require('request');
const Map = require('../utils/mapUtil');
var rsaUtil = require('./rsa');

//请求ip + port
const address = "http://192.168.0.31:81";
//许可证id
const appId = "43FD572D-32A0-4620-BB76-8E1FDE878BB2";

var map = new Map();
//生成 RSA 密钥对
var keyPairObj = rsaUtil.getRSAKeyPair();
//公钥string转为base64格式
var publicKey = Buffer.from(keyPairObj.publicKey).toString('base64');
// 客户端RSA公钥
map.put("LOCAL_PUBLIC_KEY", publicKey);

async.waterfall([
    //获取加密私钥
    function getSecret(callback) {
        request({ url: address + '/api/ec/dev/auth/regist', method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8', 'appid': appId, 'cpk': publicKey } },
            function (error, response, body) {
                if (!error && response.statusCode == 200 && JSON.parse(body).code == '0') {
                    //ECOLOGY返回的系统公钥
                    var spk = JSON.parse(body).spk;
                    //ECOLOGY返回的系统密钥
                    var secret = JSON.parse(body).secret;
                    //对秘钥进行加密传输，防止篡改数据
                    var encryptSecret = rsaUtil.publicKeyEncrypt(secret, spk, 'base64', 'utf8');
                    map.put('SERVER_PUBLIC_KEY', spk);
                    map.put('SERVER_SECRET', secret);
                    callback(null, encryptSecret);
                }
            })
    },
    //获取token
    function getToken(encryptSecret, callback) {
        request({ url: address + '/api/ec/dev/auth/applytoken', method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8', 'appid': appId, 'secret': encryptSecret } },
            function (error, response, body) {
                if (!error && response.statusCode == 200 && JSON.parse(body).code == '0') {
                    var token = JSON.parse(body).token;
                    map.put('SERVER_TOKEN', token);
                    callback(null, token)
                }
            })
    }
], function (err, result) {
    var token = result;
    map.put('SERVER_TOKEN', token);
})

module.exports = map;
