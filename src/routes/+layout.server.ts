import { getUserFromSession } from '$lib/server/session';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get('sessionid');
	return {
		user: (sessionId ? await getUserFromSession(sessionId) : undefined)
	};
};