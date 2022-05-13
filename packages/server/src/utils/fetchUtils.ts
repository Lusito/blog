export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (response.status > 300) throw new Error(`Failed getting ${url}`);

  return response.json();
}
