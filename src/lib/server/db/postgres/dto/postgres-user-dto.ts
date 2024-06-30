import { UserDto } from ".";
import sql from "../postgres";
import { createHash } from 'crypto';

const USERS_TABLE_NAME = 'users';

export default class PostgresUserDto implements UserDto {
    async init() {
        await sql`CREATE TABLE IF NOT EXISTS ${sql(USERS_TABLE_NAME)} (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL UNIQUE,
            salt CHAR(50),
            password CHAR(64)
        );`;
    }

    async getUser(userId: number): Promise<Omit<User, "password" | "salt">> {
        return (await sql`SELECT id, name, email FROM ${sql(USERS_TABLE_NAME)} WHERE id=${userId}`)[0] as Promise<Omit<User, "password" | "salt">>;
    }

    private hashPassword(password: string, salt: string) {
        return createHash('sha256').update(password + ":" + salt).digest('hex');
    }

    private generateSalt() {
        return Array(50).fill('a').map(() => Math.round(Math.random() * 15).toString(16)).join('');
    }

    async register(user: Required<Omit<User, "id" | "salt">>) {
        const salt = this.generateSalt();
        const req = await sql`INSERT INTO ${sql(USERS_TABLE_NAME)}(name, email, salt, password) VALUES (${user.name}, ${user.email}, ${salt}, ${this.hashPassword(user.password, salt)}) returning id`;

        return req[0].id as number;
    }

    async authenticate(email: string, password: string) {
        const [{ id, salt, hashed_password }] = await sql`SELECT id, salt, password as hashed_password FROM ${sql(USERS_TABLE_NAME)} WHERE email=${email}`;
        return this.hashPassword(password, salt) == hashed_password ? id : -1;
    }
}