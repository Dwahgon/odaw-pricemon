import { redirect, type Cookies } from "@sveltejs/kit";
import type { PageServerLoad } from "../../routes/$types";
import db from "./db";

const sessions = new Map<string, number>();

const createSessionId = () => Math.round(new Date().getTime() / 1000).toString(16) + Array(16).fill('x').map(() => Math.round(Math.random() * 15).toString(16))

export function createSession(userId: number) {
    const sessionId = createSessionId();
    sessions.set(sessionId, userId);
    return sessionId;
}

export function getSession(sessionId: string) {
    return sessions.get(sessionId);
}

export async function getUserFromSession(sessionId: string) {
    const userId = sessions.get(sessionId);
    return userId ? await db.userDto.getUser(userId) : undefined;
}

export const redirectToRootIfSessionSet: (redirectIfSet: boolean) => (obj: { cookies: Cookies }) => Promise<void> = (redirectIfSet: boolean) => async ({ cookies }) => {
    const sessionId = cookies.get('sessionid');
    if (redirectIfSet == (sessionId != undefined && getSession(sessionId) != undefined)) {
        redirect(303, '/');
    }
};