import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Palette, Move } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: 'linear-gradient(rgba(42, 42, 42, 0.4), rgba(42, 42, 42, 0.6)), url("/hero-bg.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'var(--color-warm-ivory)'
    }}>
      <nav style={{
        padding: '2rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(253, 251, 247, 0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '0.1em', color: 'var(--color-warm-ivory)' }}>
          Luxury Spaces
        </h1>
        <Link to="/login" style={{
          padding: '0.5rem 1.5rem',
          border: '1px solid var(--color-warm-ivory)',
          borderRadius: '4px',
          fontSize: '0.85rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          transition: 'all 0.3s ease'
        }} className="nav-login-btn">
          Sign In
        </Link>
      </nav>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '4rem',
          fontWeight: 400,
          marginBottom: '1.5rem',
          color: 'var(--color-warm-ivory)',
          textShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          Design with Elegance.
        </h2>
        <p style={{
          fontSize: '1.25rem',
          maxWidth: '600px',
          lineHeight: 1.8,
          marginBottom: '3rem',
          color: 'rgba(253, 251, 247, 0.9)'
        }}>
          A premium visualization platform for interior designers. Curate, color, and present luxury homes with effortless calm.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '5rem' }}>
          <Link to="/login" style={{
            backgroundColor: 'var(--color-warm-ivory)',
            color: 'var(--color-charcoal)',
            padding: '1rem 3rem',
            borderRadius: '4px',
            fontSize: '1rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}>
            Enter Studio
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3rem',
          maxWidth: '1000px',
          width: '100%'
        }}>
          {[
            { icon: <Move size={24} />, title: 'Spatial Freedom', desc: 'Drag and drop luxury furniture with real-time scaling and rotation.' },
            { icon: <Palette size={24} />, title: 'Curated Palettes', desc: 'Experiment with tones ranging from warm ivory to espresso brown.' },
            { icon: <Sparkles size={24} />, title: 'AI Assistant', desc: 'Get design suggestions to elevate the luxury feel.' }
          ].map((feature, idx) => (
            <div key={idx} style={{
              padding: '2rem',
              background: 'rgba(253, 251, 247, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(253, 251, 247, 0.1)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '1rem', color: 'var(--color-brushed-gold)' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-warm-ivory)', marginBottom: '0.5rem' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(253, 251, 247, 0.7)' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <style>
        {`
          .nav-login-btn:hover {
            background-color: var(--color-warm-ivory);
            color: var(--color-charcoal) !important;
          }
        `}
      </style>
    </div>
  );
}
