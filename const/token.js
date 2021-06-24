var md5 = require('md5-node');

var md5pwd = md5('dp:dp_001')
const token = Buffer.from(md5pwd).toString('base64');

module.exports = token
