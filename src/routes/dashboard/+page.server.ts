import { redirectToRootIfSessionSet } from '$lib/server/session';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = redirectToRootIfSessionSet(false);