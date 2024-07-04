import { getSession, redirectToRootIfSessionSet } from '$lib/server/session';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import db from '$lib/server/db';
import { parseUrlList } from '$lib/utils';

export const load: PageServerLoad = async ({ cookies }) => {
    await redirectToRootIfSessionSet(false)({ cookies });
    const session = getSession(cookies.get('sessionid')!)!;
    const products = await db.productDto.getProductsByUser(session);
    return {
        userProducts: await db.productDto.getProductsByUser(session),
        priceHistory: await Promise.all(products.map(product => db.priceHistoryDto.getProductPriceHistory(product.id)))
            .then(hs => new Map(hs.map((h, i) => [products[i].id, h]))),
    }
};

export const actions = {
    createProduct: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name') as string | null;
        const description = data.get('description') as string | null;
        const userId = data.get('user-id') ? parseInt(data.get('user-id') as string) : null;
        const rawUrls = data.get('urls') as string | null;

        if (!name) return fail(400, { error: 'field-missing', details: 'name' });
        if (!description) return fail(400, { error: 'field-missing', details: 'description' });
        if (!userId) return fail(400, { error: 'field-missing', details: 'userId' });
        if (!rawUrls) return fail(400, { error: 'field-missing', details: 'urls' });

        const urls = parseUrlList(rawUrls);

        try {
            await db.productDto.register({ name, urls, description, userId });
            return { success: true }
        } catch (error) {
            return fail(500, { error: "internal-error", details: JSON.stringify(error) });
        }
    },
    deleteProduct: async ({ request }) => {
        const data = await request.formData();
        const productId = data.get('product-id');

        if (!productId) return fail(400, { error: 'field-missing', details: 'product-id' });

        try {
            await db.productDto.delete(parseInt(productId as string));
            return { success: true }
        } catch (error) {
            return fail(500, { error: 'internal-error', details: JSON.stringify(error) });
        }
    }
} satisfies Actions;