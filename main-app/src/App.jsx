import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginForm from './components/LoginForm';
import './App.css';

const MusicLibraryApp = lazy(() => import('musicLibrary/MusicLibraryApp'));

function AppContent() {
  const { role, logout } = useAuth();

  if (!role) {
    return <LoginForm />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>Logged in as: <strong>{role}</strong></p>
        <button onClick={logout}>Log out</button>
      </div>
      <Suspense fallback={<p>Loading music library…</p>}>
        <MusicLibraryApp role={role} />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;