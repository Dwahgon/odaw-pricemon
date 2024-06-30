import { redirect, type Actions } from "@sveltejs/kit";

export const actions = {
    logout: async ({ cookies }) => {
        cookies.delete('sessionid', { path: '/' });
        redirect(303, '/');
    },
} satisfies Actions;