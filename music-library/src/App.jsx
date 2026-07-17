import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginForm from './components/LoginForm';
import SongList from './components/SongList';
import './App.css';

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
      <SongList role={role} />
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