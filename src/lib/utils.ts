export const groupBy = <T, U>(es: T[], getKey: (e: T) => U) => es.reduce((m, e) => (m.get(getKey(e))?.push(e) ?? m.set(getKey(e), [e]), m), new Map<U, T[]>())

export const parseUrlList = (us: string) => [...us.matchAll(/<([A-Za-z0-9:/.$_#?=&+-]*)>/gi)].map(r => r[1]);