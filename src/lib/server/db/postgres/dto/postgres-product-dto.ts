import sql from "../postgres";
import { LISTINGS_TABLE_NAME, PRODUCTS_TABLE_NAME, VENDORS_TABLE_NAME } from "./constants";

export default class PostgresProductDto implements ProductDto {
    async init() {
        await sql`CREATE TABLE IF NOT EXISTS ${sql(PRODUCTS_TABLE_NAME)} (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            description VARCHAR(100) NOT NULL,
            user_id INT NOT NULL
        );`

        await sql`CREATE TABLE IF NOT EXISTS ${sql(LISTINGS_TABLE_NAME)} (
            id SERIAL PRIMARY KEY,
            url VARCHAR(2048)
        )`;

        await sql`CREATE TABLE IF NOT EXISTS ${sql(VENDORS_TABLE_NAME)} (
            product_id INT,
            listing_id INT,
            PRIMARY KEY (product_id, listing_id),
            FOREIGN KEY (product_id) REFERENCES ${sql(PRODUCTS_TABLE_NAME)}(id),
            FOREIGN KEY (listing_id) REFERENCES ${sql(LISTINGS_TABLE_NAME)}(id)
        );`;
    }

    async register(product: Required<Omit<Product, "id">>): Promise<number> {
        // Get existing listings
        const existingListings = await sql`SELECT id, url FROM ${sql(LISTINGS_TABLE_NAME)} WHERE url IN ${sql(product.urls)}` as { id: number, url: string }[];

        // Create new listings
        const existingListingUrls = new Set(existingListings.map(l => l.url));
        const newUrls = product.urls.filter(url => !existingListingUrls.has(url)).map(url => ({ url }));
        const newListingIds = newUrls.length ? (await sql`INSERT INTO ${sql(LISTINGS_TABLE_NAME)} ${sql(newUrls, 'url')} RETURNING id`).map(res => res.id as number)
            : [];

        // Create product
        const [{ id: product_id }] = await sql`INSERT INTO ${sql(PRODUCTS_TABLE_NAME)}(name, description, user_id) VALUES (${product.name}, ${product.description}, ${product.userId}) returning id`;

        // Create vendors
        const vendorIds = [...existingListings.map(l => l.id), ...newListingIds];
        const vendors = vendorIds.map(listing_id => ({ listing_id, product_id }));
        await sql`INSERT INTO ${sql(VENDORS_TABLE_NAME)} ${sql(vendors)}`;

        return product_id as number;
    }

    async getProductsByUser(userId: number) {
        const products = await sql`SELECT id, name, description FROM ${sql(PRODUCTS_TABLE_NAME)} WHERE user_id=${userId}` as { id: number, name: string, description: string }[];
        const productUrls = await sql`
            SELECT ${sql(PRODUCTS_TABLE_NAME)}.id, ${sql(LISTINGS_TABLE_NAME)}.url
            FROM products
            INNER JOIN ${sql(VENDORS_TABLE_NAME)}
                on ${sql(PRODUCTS_TABLE_NAME)}.id=${sql(VENDORS_TABLE_NAME)}.product_id
            INNER JOIN ${sql(LISTINGS_TABLE_NAME)}
                on ${sql(LISTINGS_TABLE_NAME)}.id=${sql(VENDORS_TABLE_NAME)}.listing_id
            WHERE user_id=${userId};` as { id: number, url: string }[];
        const completeProducts = products.map(product => ({
            ...product,
            userId,
            urls: productUrls
                .filter(({ id }) => id == product.id)
                .map(({ url }) => url),
        }));

        return completeProducts;
    }

}