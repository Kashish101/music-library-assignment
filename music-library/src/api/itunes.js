export async function fetchSongs(term) {
  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch songs');
  }
  const json = await res.json();

  // Map iTunes' field names to a clean shape our UI wants
  return json.results.map((r) => ({
    id: r.trackId,
    title: r.trackName,
    artist: r.artistName,
    album: r.collectionName,
    year: r.releaseDate ? new Date(r.releaseDate).getFullYear() : null,
    artwork: r.artworkUrl100,
  }));
}