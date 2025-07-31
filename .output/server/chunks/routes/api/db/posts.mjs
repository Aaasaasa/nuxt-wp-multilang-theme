import { d as defineEventHandler, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import mysql from 'mysql2/promise';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const posts = defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const connection = await mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
  });
  const [rows] = await connection.execute('SELECT ID, post_title, post_excerpt FROM wp_posts WHERE post_status = "publish" AND post_type = "post" ORDER BY post_date DESC LIMIT 10');
  await connection.end();
  return rows;
});

export { posts as default };
//# sourceMappingURL=posts.mjs.map
