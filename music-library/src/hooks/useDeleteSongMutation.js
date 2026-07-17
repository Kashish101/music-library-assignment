import { useMutation, useQueryClient } from '@tanstack/react-query';

async function deleteSong(id) {
  const res = await fetch(`/songs/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) {
    throw new Error('Failed to delete song');
  }
}

export function useDeleteSongMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['localSongs'] });
    },
  });
}