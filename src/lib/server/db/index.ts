import { DB } from '$env/static/private';
import { UserDto as PostgresUserDto } from './postgres/dto';

const DTOS = {
    postgres: {
        user: new PostgresUserDto()
    }
};

const selectedDb = DB as keyof (typeof DTOS);

(async function () {
    await DTOS[selectedDb].user.init();
})()

export default {
    userDto: DTOS[selectedDb].user as UserDto,
}