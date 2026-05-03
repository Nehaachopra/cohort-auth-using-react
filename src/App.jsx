import { useState } from 'react';
import Register from './auth/Register';
import Login    from './auth/Login';
import Profile  from './auth/Profile';

// Inner component so it can access AuthContext
function Router() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(user ? 'profile' : 'login');

  function login(userData) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
  }

  function navigate(to) {
    setPage(to);
  }

  if (page === 'register') 
    return <Register onNavigate={navigate} />;
  if (page === 'profile')  
    return <Profile  onNavigate={navigate} user={user} logout={logout}/>;
  return <Login    onNavigate={navigate} login={login}/>;
}

export default function App() {
  return (
    <Router />
  );
}
