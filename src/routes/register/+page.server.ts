import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { createSession, redirectToRootIfSessionSet } from '$lib/server/session';

export const load: PageServerLoad = redirectToRootIfSessionSet(true);

export const actions = {
    default: async ({ cookies, request, url }) => {
        const data = await request.formData();
        const name = data.get('username')?.toString();
        const email = data.get('email')?.toString();
        const password = data.get('password')?.toString();
        const confirmPassword = data.get('confirm-password')?.toString();

        if (!name) return fail(400, { error: 'field-missing', details: 'username' });
        if (!email) return fail(400, { error: 'field-missing', details: 'email' });
        if (!password) return fail(400, { error: 'field-missing', details: 'password' });
        if (!confirmPassword) return fail(400, { error: 'field-missing', details: 'confirm-password' });
        if (password != confirmPassword) return fail(400, { error: 'password-confirm-doesnt-match', details: '' });

        let userId = undefined;
        try {
            userId = await db.userDto.register({ email, name, password });
        } catch (error) {
            return fail(500, { error, details: '' })
        }

        cookies.set('sessionid', createSession(userId), { path: '/' });
        redirect(303, '/dashboard');
    },
} satisfies Actions;