import { groupBy } from "$lib/utils";
import sql from "../postgres";
import { LISTINGS_TABLE_NAME, PRICE_HISTORY_TABLE_NAME, PRODUCTS_TABLE_NAME, VENDORS_TABLE_NAME } from "./constants";

export default class PostgresPriceHistoryDto implements PriceHistoryDto {
    async init() {
        await sql`CREATE TABLE IF NOT EXISTS ${sql(PRICE_HISTORY_TABLE_NAME)} (
            listing_id INT,
            price REAL NOT NULL,
            query_timestamp TIMESTAMP NOT NULL,
            PRIMARY KEY (listing_id, query_timestamp),
            FOREIGN KEY (listing_id) REFERENCES ${sql(LISTINGS_TABLE_NAME)}(id)
        );`
    }
    async getProductPriceHistory(productId: number) {
        const priceHistoryRaw = await sql`SELECT
            ${sql(LISTINGS_TABLE_NAME)}.url,
            ${sql(PRICE_HISTORY_TABLE_NAME)}.query_timestamp,
            ${sql(PRICE_HISTORY_TABLE_NAME)}.price
        FROM products
            INNER JOIN ${sql(VENDORS_TABLE_NAME)} ON ${sql(PRODUCTS_TABLE_NAME)}.id=${sql(VENDORS_TABLE_NAME)}.product_id
            INNER JOIN ${sql(LISTINGS_TABLE_NAME)} ON ${sql(LISTINGS_TABLE_NAME)}.id=${sql(VENDORS_TABLE_NAME)}.listing_id
            INNER JOIN ${sql(PRICE_HISTORY_TABLE_NAME)} ON ${sql(LISTINGS_TABLE_NAME)}.id=${sql(PRICE_HISTORY_TABLE_NAME)}.listing_id
        WHERE ${sql(PRODUCTS_TABLE_NAME)}.id=${productId};` as { url: string, query_timestamp: Date, price: number }[];

        return [...groupBy(priceHistoryRaw, e => e.url).entries()]
            .map(([url, history]) => ({ url, priceHistory: history.map(({ price, query_timestamp }) => ({ price, timestamp: query_timestamp })) }));
    }
}