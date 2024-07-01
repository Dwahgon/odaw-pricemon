import { UserDto } from ".";
import sql from "../postgres";
import { createHash } from 'crypto';
import { USERS_TABLE_NAME } from "./constants";

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
        return (await sql`SELECT id, name, email FROM ${sql(USERS_TABLE_NAME)} WHERE id=${userId}`)[0] as Omit<User, "password" | "salt">;
    }

    async register(user: Required<Omit<User, "id" | "salt">>) {
        const salt = this.generateSalt();
        const [{ id }] = await sql`INSERT INTO ${sql(USERS_TABLE_NAME)}(name, email, salt, password) VALUES (${user.name}, ${user.email}, ${salt}, ${this.hashPassword(user.password, salt)}) returning id`;

        return id as number;
    }

    async authenticate(email: string, password: string) {
        const credentials = await sql`SELECT id, salt, password as hashed_password FROM ${sql(USERS_TABLE_NAME)} WHERE email=${email}`;
        if (!credentials.length) return -1;
        const [{ id, salt, hashed_password }] = credentials;
        return this.hashPassword(password, salt) == hashed_password ? id : -1;
    }

    private hashPassword(password: string, salt: string) {
        return createHash('sha256').update(password + ":" + salt).digest('hex');
    }

    private generateSalt() {
        return Array(50).fill('a').map(() => Math.round(Math.random() * 15).toString(16)).join('');
    }
}