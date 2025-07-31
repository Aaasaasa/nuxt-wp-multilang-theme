import { u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import mysql from 'mysql2/promise';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

async function authorizeUser(credentials) {
  const config = useRuntimeConfig();
  const connection = await mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
  });
  const [rows] = await connection.execute(
    `SELECT ID, user_login, user_email FROM ${config.db.prefix || "wp_"}users WHERE user_login = ? AND user_pass = MD5(?)`,
    [credentials.username, credentials.password]
  );
  if (rows.length > 0) {
    return {
      id: rows[0].ID,
      name: rows[0].user_login,
      email: rows[0].user_email,
      role: "admin"
    };
  }
  return null;
}

export { authorizeUser as default };
//# sourceMappingURL=authorize.mjs.map
