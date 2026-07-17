export function filterSongs(songs, field, value) {
  if (!value) return songs;
  return songs.filter((song) =>
    String(song[field]).toLowerCase().includes(value.toLowerCase())
  );
}

export function sortSongs(songs, field, direction = 'asc') {
  return [...songs].sort((a, b) => {
    if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
    if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function groupSongsBy(songs, field) {
  return songs.reduce((groups, song) => {
    const key = song[field] ?? 'Unknown';
    if (!groups[key]) groups[key] = [];
    groups[key].push(song);
    return groups;
  }, {});
}