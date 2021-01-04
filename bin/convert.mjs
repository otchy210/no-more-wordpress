import config from './config.mjs';
import { newConnection } from './mysql.mjs';

const conn = newConnection(config.mysql);

(async () => {
    conn.connect();
    const {results} = await conn.query('SELECT * FROM wp_posts LIMIT 1');
    console.log(results[0]);
})().catch(err => {
    console.error(err);
}).finally(() => {
    conn.end();
});
