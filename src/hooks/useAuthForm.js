import { useState } from 'react';

// ---- Validators ---------------------------------------------------------- //

export const validators = {
  username(value) {
    if (!value.trim()) return 'Username is required';
    if (value.length < 3) return 'At least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Letters, numbers, underscores only';
    return null;
  },
  email(value) {
    if (!value.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
    return null;
  },
  password(value) {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'At least 8 characters';
    return null;
  },
  role(value) {
    if (!value) return 'Select a role';
    return null;
  },
};

export function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score; // 0–4
}

// ---- Hook ---------------------------------------------------------------- //

export function useAuthForm(fields, validatorKeys) {
  const [values, setValues]   = useState(fields);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus]   = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    // Validate live once field has been touched
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validators[name]?.(value) ?? null }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validators[name]?.(value) ?? null }));
  }

  function validate() {
    const nextErrors = {};
    let valid = true;
    for (const key of validatorKeys) {
      const err = validators[key]?.(values[key]);
      if (err) { nextErrors[key] = err; valid = false; }
    }
    setErrors(nextErrors);
    setTouched(Object.fromEntries(validatorKeys.map(k => [k, true])));
    return valid;
  }

  function resetForm() {
    setValues(fields);
    setErrors({});
    setTouched({});
    setStatus('idle');
    setMessage('');
  }

  return {
    values, errors, touched, status, message,
    handleChange, handleBlur, validate,
    setStatus, setMessage, resetForm,
  };
}
