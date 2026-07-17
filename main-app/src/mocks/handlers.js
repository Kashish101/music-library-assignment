import { http, HttpResponse } from 'msw';

let addedSongs = [];
let nextId = 900000;

export const handlers = [
  http.post('/songs', async ({ request }) => {
    const body = await request.json();
    const newSong = { id: nextId++, ...body };
    addedSongs.push(newSong);
    return HttpResponse.json(newSong, { status: 201 });
  }),

  http.delete('/songs/:id', ({ params }) => {
    addedSongs = addedSongs.filter((song) => String(song.id) !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/songs/local', () => {
    return HttpResponse.json(addedSongs);
  }),
];