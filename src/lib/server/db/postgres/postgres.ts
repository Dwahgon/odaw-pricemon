import postgres from 'postgres';
import { DB_HOST, DB_PORT, DB_USER, DB_PW, DB_DATABASE } from '$env/static/private';

const sql = postgres({
    host: DB_HOST,
    port: parseInt(DB_PORT),
    user: DB_USER,
    password: DB_PW,
    database: DB_DATABASE
});

export default sql;