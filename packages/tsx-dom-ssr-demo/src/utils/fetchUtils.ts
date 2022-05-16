export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (response.status > 300) throw new Error(`Failed getting ${url}`);

  return response.json();
}

export function fetchRAM<T>(path: string) {
  return fetchJson<T>(`https://rickandmortyapi.com/api${path}`);
}
