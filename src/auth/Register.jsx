import { useAuthForm, getPasswordStrength } from '../hooks/useAuthForm';
import '../auth.css';

const ROLES = ['user', 'admin'];

function StrengthBar({ password }) {
  const score = getPasswordStrength(password);
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colorClass = ['', 'weak', 'fair', 'good', 'strong'][score];

  return password ? (
    <div>
      <div className="strength-bar">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`strength-bar__seg${i <= score ? ` strength-bar__seg--${colorClass}` : ''}`}
          />
        ))}
      </div>
    </div>
  ) : null;
}

export default function Register({ onNavigate }) {
  const form = useAuthForm(
    { username: '', email: '', password: '', role: '' },
    ['username', 'email', 'password', 'role']
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.validate()) return;

    form.setStatus('loading');

    try {
      console.log(form.values);
      const res = await fetch('https://api.freeapi.app/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.values),
      });
      const data = await res.json();

      if (!res.ok) {
        form.setStatus('error');
        console.log(data?.message);
        form.setMessage(data?.message ?? 'Registration failed. Please try again.');
      } else {
        form.setStatus('success');
        form.setMessage('Account created! You can now log in.');
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
        <h1 className="auth-card__title">Create account</h1>
        <p className="auth-card__subtitle">Fill in your details to get started.</p>
        <hr className="auth-divider" />

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Username */}
          <div className="field-group">
            <label className="field-group__label" htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              className={`field-group__input${form.errors.username ? ' field-group__input--error' : ''}`}
              type="text"
              name="username"
              placeholder="angryzebra337"
              autoComplete="username"
              value={form.values.username.trim().toLowerCase()}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              disabled={isLoading}
            />
            {form.errors.username && (
              <span className="field-group__error">{form.errors.username}</span>
            )}
          </div>

          {/* Email */}
          <div className="field-group">
            <label className="field-group__label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              className={`field-group__input${form.errors.email ? ' field-group__input--error' : ''}`}
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.values.email}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              disabled={isLoading}
            />
            {form.errors.email && (
              <span className="field-group__error">{form.errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="field-group">
            <label className="field-group__label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className={`field-group__input${form.errors.password ? ' field-group__input--error' : ''}`}
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={form.values.password}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              disabled={isLoading}
            />
            <StrengthBar password={form.values.password} />
            {form.errors.password && (
              <span className="field-group__error">{form.errors.password}</span>
            )}
          </div>

          {/* Role */}
          <div className="field-group">
            <label className="field-group__label" htmlFor="reg-role">Role</label>
            <div className="field-group__select-wrap">
              <select
                id="reg-role"
                className={`field-group__select${form.errors.role ? ' field-group__input--error' : ''}`}
                name="role"
                value={form.values.role}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                disabled={isLoading}
              >
                <option value="" disabled>Select a role…</option>
                {ROLES.map(r => (
                  <option key={r} value={r.toUpperCase()}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
            {form.errors.role && (
              <span className="field-group__error">{form.errors.role}</span>
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
              <><div className="auth-btn__spinner" /> Creating account…</>
            ) : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <button className="auth-footer__link" onClick={() => onNavigate('login')}>
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
