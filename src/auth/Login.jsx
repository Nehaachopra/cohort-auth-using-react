import { useAuthForm } from '../hooks/useAuthForm';
import '../auth.css';

export default function Login({ onNavigate, login }) {

  const form = useAuthForm(
    { username: '', password: '' },
    ['username', 'password']
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.validate()) return;

    form.setStatus('loading');
    console.log(form.values);

    try {
      const res = await fetch('https://api.freeapi.app/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.values),
      });
      const data = await res.json();

      if (!res.ok) {
        form.setStatus('error');
        form.setMessage(data?.message ?? 'Login failed. Check your credentials.');
      } else {
        form.setStatus('success');
        form.setMessage('Logged in successfully! Redirecting…');

        // Pull user details from the response (adjust path to match your API)
        const userData = data?.data?.user ?? {
          username: form.values.username,
          email: data?.data?.user?.email ?? '',
          role: data?.data?.user?.role ?? 'user',
        };
        login(userData);

        // Small delay so user sees the success message
        setTimeout(() => {
          onNavigate('profile');
        }, 900);
      }
    } catch {
      form.setStatus('error');
      form.setMessage('Network error. Check your connection.');
    }
  }

  const isLoading = form.status === 'loading';

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="auth-card__eyebrow">Auth service · v1</p>
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">Log in to your account to continue.</p>
        <hr className="auth-divider" />

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Username */}
          <div className="field-group">
            <label className="field-group__label" htmlFor="login-username">Username</label>
            <input
              id="login-username"
              className={`field-group__input${form.errors.username ? ' field-group__input--error' : ''}`}
              type="text"
              name="username"
              placeholder="angryzebra337"
              autoComplete="username"
              value={form.values.username.toLowerCase()}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              disabled={isLoading}
            />
            {form.errors.username && (
              <span className="field-group__error">{form.errors.username}</span>
            )}
          </div>

          {/* Password */}
          <div className="field-group">
            <label className="field-group__label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className={`field-group__input${form.errors.password ? ' field-group__input--error' : ''}`}
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={form.values.password}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              disabled={isLoading}
            />
            {form.errors.password && (
              <span className="field-group__error">{form.errors.password}</span>
            )}
          </div>

          {/* Alert */}
          {(form.status === 'success' || form.status === 'error') && (
            <div className={`auth-alert auth-alert--${form.status === 'success' ? 'success' : 'error'}`}>
              {form.message}
            </div>
          )}

          {/* Submit */}
          <button className="auth-btn" type="submit" disabled={isLoading}>
            {isLoading ? (
              <><div className="auth-btn__spinner" /> Authenticating…</>
            ) : 'Log in'}
          </button>
        </form>

        <p className="auth-footer">
          No account yet?{' '}
          <button className="auth-footer__link" onClick={() => onNavigate('register')}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
