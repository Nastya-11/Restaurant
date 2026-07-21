const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '######',
  database: 'restaurant_system',
});

module.exports = pool;