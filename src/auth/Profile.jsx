import '../auth.css';

function initials(username = '') {
  return username.slice(0, 2).toUpperCase() || '??';
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function Profile({ onNavigate,  user, logout}) {
  function handleLogout() {
    logout();
    onNavigate('login');
  }

  if (!user) {
    onNavigate('login');
    return null;
  }

  const sessionStart = formatDate(new Date().toISOString());

  const rows = [
    { key: 'Username',  value: user.username },
    { key: 'Email',     value: user.email || '—' },
    { key: 'Role',      value: user.role || 'user' },
    { key: 'User ID',   value: user._id || user.id || '—' },
    { key: 'Session',   value: sessionStart },
  ];

  return (
    <div className="profile-shell">
      <div className="profile-inner">

        {/* Top bar */}
        <div className="profile-topbar">
          <span className="profile-topbar__logo">Auth service · v1</span>
          <button className="btn-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>

        {/* Avatar + name */}
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">
            {initials(user.username)}
          </div>
          <div>
            <div className="profile-name">{user.username}</div>
            <span className="profile-role-badge">{user.role || 'user'}</span>
          </div>
        </div>

        {/* Session indicator */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span className="session-badge">
            <span className="session-badge__dot" />
            Active session
          </span>
        </div>

        {/* Info card */}
        <div className="profile-card">
          {rows.map(({ key, value }) => (
            <div className="profile-card__row" key={key}>
              <span className="profile-card__key">{key}</span>
              <span className="profile-card__value">{value}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
