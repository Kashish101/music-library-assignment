import { useQuery } from '@tanstack/react-query';

async function fetchLocalSongs() {
  const res = await fetch('/songs/local');
  if (!res.ok) {
    throw new Error('Failed to fetch local songs');
  }
  return res.json();
}

export function useLocalSongsQuery() {
  return useQuery({
    queryKey: ['localSongs'],
    queryFn: fetchLocalSongs,
  });
}