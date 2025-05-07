import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { auth, sendPasswordResetEmail, confirmPasswordReset } from './firebase';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('request'); // 'request' or 'reset'
  const [passwordValid, setPasswordValid] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Check for password reset mode
  useEffect(() => {
    const oobCode = searchParams.get('oobCode');
    if (oobCode) {
      setMode('reset');
    }
  }, [searchParams]);

  // Password validation
  useEffect(() => {
    if (mode === 'reset') {
      const isValid = validatePassword(newPassword) && newPassword === confirmNewPassword;
      setPasswordValid(isValid);
    }
  }, [newPassword, confirmNewPassword, mode]);

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasSpecialChar;
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(`Password reset email sent to ${email}. Check your inbox.`);
      setEmail('');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("Password must be at least 6 characters with at least one uppercase letter and one special character");
      setLoading(false);
      return;
    }

    try {
      const oobCode = searchParams.get('oobCode');
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Password reset successfully! You can now login with your new password.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const getPasswordValidation = () => {
    if (!newPassword) return null;
    
    const requirements = {
      length: newPassword.length >= 6,
      upperCase: /[A-Z]/.test(newPassword),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    };

    return (
      <div className="password-validation">
        <h4>Password Requirements:</h4>
        <ul>
          <li className={requirements.length ? 'valid' : 'invalid'}>
            At least 6 characters
          </li>
          <li className={requirements.upperCase ? 'valid' : 'invalid'}>
            At least one uppercase letter
          </li>
          <li className={requirements.specialChar ? 'valid' : 'invalid'}>
            At least one special character
          </li>
        </ul>
        {confirmNewPassword && (
          <p className={newPassword === confirmNewPassword ? 'password-match' : 'password-mismatch'}>
            {newPassword === confirmNewPassword ? 'Passwords match!' : 'Passwords do not match'}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{mode === 'request' ? 'Forgot Password' : 'Create New Password'}</h2>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        {mode === 'request' ? (
          <form onSubmit={handleRequestReset}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="Enter your email"
              />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                placeholder="Create new password"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                value={confirmNewPassword} 
                onChange={(e) => setConfirmNewPassword(e.target.value)} 
                required 
                placeholder="Confirm new password"
              />
            </div>
            {getPasswordValidation()}
            <button 
              type="submit" 
              className="auth-button" 
              disabled={loading || !passwordValid}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="auth-switch">
          {mode === 'request' ? (
            <>
              Remember your password? <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              Back to <Link to="/login">Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;