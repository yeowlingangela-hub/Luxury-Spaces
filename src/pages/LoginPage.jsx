import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--color-warm-ivory)'
    }}>
      {/* Left side: Image */}
      <div style={{
        flex: 1,
        backgroundImage: 'linear-gradient(rgba(62, 49, 41, 0.2), rgba(62, 49, 41, 0.4)), url("/hero-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'none',
      }} className="login-bg hide-on-mobile">
      </div>

      {/* Right side: Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{ marginBottom: '4rem' }}>
          <Link to="/" style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: 'var(--color-espresso-brown)' }}>
            Luxury Spaces
          </Link>
        </div>

        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          Sign in to your studio to continue designing.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-greige)' }}>
              Email Address
            </label>
            <input 
              type="email" 
              defaultValue="designer@studio.com"
              style={{
                padding: '1rem',
                border: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                borderRadius: '4px',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-greige)' }}>
              Password
            </label>
            <input 
              type="password" 
              defaultValue="password"
              style={{
                padding: '1rem',
                border: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                borderRadius: '4px',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" className="premium-btn" style={{ marginTop: '1rem', padding: '1rem' }}>
            Sign In
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Don't have an account? <span style={{ color: 'var(--color-charcoal)', cursor: 'pointer' }}>Request access</span>
        </p>
      </div>

      <style>
        {`
          @media (min-width: 900px) {
            .hide-on-mobile {
              display: block !important;
            }
          }
          input:focus {
            border-color: var(--color-charcoal) !important;
          }
        `}
      </style>
    </div>
  );
}
