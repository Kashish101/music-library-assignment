import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function addSong(newSong) {
  const res = await fetch('/songs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSong),
  });
  if (!res.ok) {
    throw new Error('Failed to add song');
  }
  return res.json();
}

function AddSongForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addSong,
    onSuccess: () => {
      // Cache invalidation: tell React Query the local songs list is stale,
      // so it refetches automatically and the new song appears without a page reload.
      queryClient.invalidateQueries({ queryKey: ['localSongs'] });
      reset();
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ ...data, year: Number(data.year) });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: '1.5rem' }}>
      <h3>Add a Song</h3>

      <div>
        <input
          placeholder="Title"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && <span style={{ color: 'red' }}> {errors.title.message}</span>}
      </div>

      <div>
        <input
          placeholder="Artist"
          {...register('artist', { required: 'Artist is required' })}
        />
        {errors.artist && <span style={{ color: 'red' }}> {errors.artist.message}</span>}
      </div>

      <div>
        <input
          placeholder="Album"
          {...register('album', { required: 'Album is required' })}
        />
        {errors.album && <span style={{ color: 'red' }}> {errors.album.message}</span>}
      </div>

      <div>
        <input
          type="number"
          placeholder="Year"
          {...register('year', { required: 'Year is required', valueAsNumber: true })}
        />
        {errors.year && <span style={{ color: 'red' }}> {errors.year.message}</span>}
      </div>

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Adding…' : 'Add Song'}
      </button>

      {mutation.isError && (
        <p style={{ color: 'red' }}>Error: {mutation.error.message}</p>
      )}
    </form>
  );
}

export default AddSongForm;