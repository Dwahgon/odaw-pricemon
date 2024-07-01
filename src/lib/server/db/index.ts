import { DB } from '$env/static/private';
import { UserDto as PostgresUserDto, ProductDto as PostgresProductDto, PriceHistoryDto as PostgresPriceHistoryDto } from './postgres/dto';

const DTOS = {
    postgres: {
        user: new PostgresUserDto(),
        product: new PostgresProductDto(),
        priceHistory: new PostgresPriceHistoryDto(),
    }
};

const selectedDb = DB as keyof (typeof DTOS);

(async function () {
    await DTOS[selectedDb].user.init();
    await DTOS[selectedDb].product.init();
    await DTOS[selectedDb].priceHistory.init();
})()

export default {
    userDto: DTOS[selectedDb].user as UserDto,
    productDto: DTOS[selectedDb].product as ProductDto,
    priceHistoryDto: DTOS[selectedDb].priceHistory as PriceHistoryDto
}