Music Library App

A micro-frontend music library built with React, Vite, Module Federation, React Query, react-hook-form, and mock JWT-based role auth.

Live Demo Links


Main App: https://music-library-assignment-8ogo.vercel.app/
Music Library (Micro Frontend): https://music-library-assignment.vercel.app/


Open the Main App link - it loads the Music Library live from its own separate deployment.

Demo Credentials

RoleUsernamePasswordAccessAdminadminadmin123View, filter, sort, group, add songs, delete songsUseruseruser123View, filter, sort, group only

How to Run Locally

This project has two separate apps that must both be running for the full experience to work.

1. Clone and install:

bashgit clone https://github.com/Kashish101/music-library-assignment.git
cd music-library-assignment

cd music-library
npm install

cd ../main-app
npm install

2. Start the Music Library remote (must run in preview mode, not dev mode, for Module Federation to expose remoteEntry.js correctly):

bashcd music-library
npm run build
npm run preview

This runs on http://localhost:5001. Keep this terminal running.

3. In a second terminal, start the Main App:

bashcd main-app
npm run dev

This runs on http://localhost:5173.

4. Open http://localhost:5173 in your browser, log in with either credential set above, and use the app.


Note: if you only need to work on Music Library UI in isolation, npm run dev inside music-library also works standalone — just won't be loaded via federation in that mode.



Deployment

Both apps are deployed as static builds on Vercel, using the same GitHub repo with a different Root Directory set per Vercel project (music-library and main-app respectively). Since the mock write API (MSW) runs entirely in the browser via a Service Worker, no separate backend hosting was needed — both apps deploy as plain static files.

Deployment steps:


Deployed music-library first as its own Vercel project (Root Directory: music-library, Build Command: npm run build, Output Directory: dist).
Updated main-app/vite.config.js's remotes.musicLibrary value to point at the deployed music-library URL's /assets/remoteEntry.js (instead of the local localhost:5001 URL used in development).
Deployed main-app as a second Vercel project (Root Directory: main-app, same build settings).
Verified the deployed Main App successfully fetches remoteEntry.js from the deployed Music Library's URL at runtime (confirmed via the Network tab).


How Module Federation Works Here

music-library is built with Vite and the @originjs/vite-plugin-federation plugin, configured to expose a single component, MusicLibraryApp, via a generated file called remoteEntry.js. main-app is configured with the same plugin, but declares music-library's URL as a remote instead. In main-app's code, React.lazy(() => import('musicLibrary/MusicLibraryApp')) looks like a normal dynamic import, but that specifier isn't a real file in the project — Vite's federation plugin resolves it at runtime by fetching remoteEntry.js from the configured URL and pulling the exposed component out of it. This means music-library is built and deployed completely independently from main-app, and the two are only connected in the browser, at runtime, over HTTP. React, react-dom, and @tanstack/react-query are marked as shared dependencies in both configs so the two apps use one shared copy of each instead of bundling duplicate instances, which would otherwise break things like Context and hooks across the boundary.

How Role-Based Auth Works

Authentication lives entirely in main-app (the host), since it owns the session — music-library, the remote, has no auth logic of its own and simply receives a role prop from main-app when it's rendered. On login, main-app checks the entered username/password against a hardcoded set of demo users and, if valid, builds a JWT-shaped string (header.base64Payload.signature) containing a role claim, using btoa/atob rather than real cryptographic signing — this demonstrates the token-based auth pattern without standing up a real auth backend. That token is stored in localStorage (so a refresh keeps you logged in) and decoded on load to determine the current role, which is passed down through Context and as a prop into MusicLibraryApp. Inside music-library, the Add Song form and Delete buttons are wrapped in {role === 'admin' && ...} checks, so a user-role session never renders those controls at all — not just disables them.

Tradeoffs & What I'd Improve With More Time

I chose cache-invalidation (queryClient.invalidateQueries) over an optimistic update for the add/delete mutations, since it's simpler to reason about and avoids handling rollback states, at the small cost of a brief refetch after each write. The mock JWT is not cryptographically signed — it's a demonstration of the token/role-claim pattern rather than real security, and a production version would need actual backend-issued, verified tokens. Delete only works on locally-added songs, since the iTunes Search API is read-only and has no real delete endpoint — this is a deliberate, explained limitation rather than an oversight. With more time, I'd add debounced search instead of a hardcoded search term, pagination/infinite scroll for the song list, persistent storage for added songs (currently they're lost on a full page reload since MSW's store is in-memory), and a proper backend instead of a mocked write layer.