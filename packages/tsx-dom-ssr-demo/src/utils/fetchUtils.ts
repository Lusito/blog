import NodeCache from "node-cache";

const jsonCache = new NodeCache({
    stdTTL: 5 * 60, // 5 Minutes
    checkperiod: 60,
});

async function fetchJsonUncached(url: string) {
    const response = await fetch(url);
    if (response.status > 300) throw new Error(`Failed getting ${url}`);

    return response.json();
}

export function fetchJson<T>(url: string) {
    let promise: Promise<T> | undefined = jsonCache.get(url);
    if (promise === undefined) {
        promise = fetchJsonUncached(url);
        jsonCache.set(url, promise);
    }

    return promise;
}

export function fetchRAM<T>(path: string) {
    return fetchJson<T>(`https://rickandmortyapi.com/api${path}`);
}
