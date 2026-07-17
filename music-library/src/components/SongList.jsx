import { useState } from 'react';
import AddSongForm from './AddSongForm';
import { useSongsQuery } from '../hooks/useSongsQuery';
import { useLocalSongsQuery } from '../hooks/useLocalSongsQuery';
import { filterSongs, sortSongs, groupSongsBy } from '../utils/songUtils';

function SongList() {
  const { data: itunesSongs, isLoading, isError, error } = useSongsQuery('Coldplay');
  const { data: localSongs } = useLocalSongsQuery();

  const [filterField, setFilterField] = useState('artist');
  const [filterValue, setFilterValue] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [groupField, setGroupField] = useState('none');

  if (isLoading) {
    return <p>Loading songs…</p>;
  }

  if (isError) {
    return <p>Something went wrong: {error.message}</p>;
  }

  // Merge iTunes results with anything we've added via the mock write endpoint
  const songs = [...(itunesSongs ?? []), ...(localSongs ?? [])];

  let processed = filterSongs(songs, filterField, filterValue);
  processed = sortSongs(processed, sortField, sortDirection);

  const grouped = groupField !== 'none' ? groupSongsBy(processed, groupField) : null;

  // ...rest of the component stays exactly the same (the return JSX below)

  return (
    <div>
      <h2>Song Library</h2>
      <AddSongForm />

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Filter controls */}
        <label>
          Filter by:{' '}
          <select value={filterField} onChange={(e) => setFilterField(e.target.value)}>
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
          </select>
        </label>
        <input
          type="text"
          placeholder={`Search ${filterField}...`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />

        {/* Sort controls */}
        <label>
          Sort by:{' '}
          <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
            <option value="year">Year</option>
          </select>
        </label>
        <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        {/* Group-by control */}
        <label>
          Group by:{' '}
          <select value={groupField} onChange={(e) => setGroupField(e.target.value)}>
            <option value="none">None</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      {/* Render grouped or flat list depending on groupField */}
      {grouped ? (
        Object.entries(grouped).map(([groupName, groupSongs]) => (
          <div key={groupName} style={{ marginBottom: '1rem' }}>
            <h3>{groupName}</h3>
            <ul>
              {groupSongs.map((song) => (
                <li key={song.id}>
                  <strong>{song.title}</strong> — {song.artist} ({song.album}, {song.year})
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <ul>
          {processed.map((song) => (
            <li key={song.id}>
              <strong>{song.title}</strong> — {song.artist} ({song.album}, {song.year})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SongList;