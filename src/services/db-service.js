const mod_mysql = require("mysql2");
const util = require("util");

function DBService(mysql_config) {
  const conn = mod_mysql.createPool(mysql_config);
  const query = util.promisify(conn.query).bind(conn);
  this.mysql = query;
  this.pool = conn;
  DBService.instance = this;
}

module.exports = DBService;
