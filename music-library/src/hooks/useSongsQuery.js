import { useQuery } from '@tanstack/react-query';
import { fetchSongs } from '../api/itunes';

export function useSongsQuery(term = 'Coldplay') {
  return useQuery({
    queryKey: ['songs', term],
    queryFn: () => fetchSongs(term),
    staleTime: 1000 * 60, // cache for 1 minute before considering data stale
  });
}