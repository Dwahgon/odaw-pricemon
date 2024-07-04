import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import db from '$lib/server/db';
import { createSession, redirectToRootIfSessionSet } from '$lib/server/session';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = redirectToRootIfSessionSet(true);

export const actions = {
    default: async ({ cookies, request }) => {
        const data = await request.formData();
        const email = data.get('email')?.toString();
        const password = data.get('password')?.toString();

        if (!email) return fail(400, { error: 'field-missing', details: 'email' });
        if (!password) return fail(400, { error: 'field-missing', details: 'password' });

        let userId = -1;
        try {
            userId = await db.userDto.authenticate(email, password);
        } catch (error) {
            return fail(500, { error: "internal-error", details: JSON.stringify(error) });
        }

        if (userId != -1) {
            cookies.set('sessionid', createSession(userId), { path: '/' });
            redirect(303, '/dashboard');
        } else {
            return fail(401, { error: 'access-denied', details: '' })
        }
    },
} satisfies Actions;