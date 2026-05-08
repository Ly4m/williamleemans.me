export async function fetchBookCover(
  title: string,
  author: string,
): Promise<string | null> {
  try {
    const q = encodeURIComponent(`${title}`);
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${q}&limit=1&fields=cover_i`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const coverId = data.docs?.[0]?.cover_i;
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  } catch {
    return null;
  }
}

export async function fetchGameCover(
  title: string,
  apiKey: string,
): Promise<string | null> {
  if (!apiKey) return null;
  try {
    const q = encodeURIComponent(title);
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&search=${q}&page_size=1`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0]?.background_image ?? null;
  } catch {
    return null;
  }
}
