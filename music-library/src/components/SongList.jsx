import { useSongsQuery } from '../hooks/useSongsQuery';

function SongList() {
  const { data: songs, isLoading, isError, error } = useSongsQuery('Coldplay');

  if (isLoading) {
    return <p>Loading songs…</p>;
  }

  if (isError) {
    return <p>Something went wrong: {error.message}</p>;
  }

  return (
    <div>
      <h2>Song Library</h2>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <strong>{song.title}</strong> — {song.artist} ({song.album}, {song.year})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SongList;