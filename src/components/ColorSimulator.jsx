import React from 'react';
import { WALL_PALETTE } from '../data/catalog';
import { Check } from 'lucide-react';

export default function ColorSimulator({ wallColor, setWallColor }) {
  return (
    <div style={{ padding: '1.25rem', overflowY: 'auto', height: '100%' }}>
      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-greige)', marginBottom: '0.5rem' }}>
        Wall Colour Tint
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
        Click a colour to tint your room walls. The overlay blends with the base photo.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {WALL_PALETTE.map((color) => {
          const isSelected = wallColor === color.hex;
          return (
            <div key={color.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={() => setWallColor(isSelected ? 'transparent' : color.hex)}
                title={color.name}
                style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  backgroundColor: color.hex,
                  border: isSelected ? '3px solid var(--color-charcoal)' : '2px solid rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isSelected ? '0 0 0 3px rgba(42,42,42,0.15)' : '0 2px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {isSelected && (
                  <Check size={18} style={{ color: color.hex === '#3A3A3A' || color.hex === '#4A3828' || color.hex === '#5C5E48' ? '#fff' : '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                )}
              </button>
              <span style={{ fontSize: '0.65rem', textAlign: 'center', color: 'var(--text-secondary)', lineHeight: 1.2, maxWidth: '60px' }}>{color.name}</span>
            </div>
          );
        })}
      </div>

      {/* Reset */}
      {wallColor !== 'transparent' && (
        <button
          onClick={() => setWallColor('transparent')}
          style={{
            width: '100%', padding: '0.6rem', border: '1px dashed var(--border-color)',
            backgroundColor: 'transparent', borderRadius: '6px', fontSize: '0.8rem',
            color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: '1.5rem'
          }}
        >
          Remove colour tint
        </button>
      )}

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-greige)', marginBottom: '0.75rem' }}>
          Materials (Coming Soon)
        </div>
        {['Limewash Plaster', 'Grasscloth Wallcovering', 'Venetian Marble Plaster'].map((t, i) => (
          <button key={i} style={{
            display: 'block', width: '100%', padding: '0.6rem 0.75rem', marginBottom: '0.4rem',
            textAlign: 'left', border: '1px solid var(--border-color)', borderRadius: '4px',
            fontSize: '0.8rem', fontFamily: 'var(--font-body)', backgroundColor: 'transparent',
            color: 'var(--text-secondary)', cursor: 'not-allowed', opacity: 0.6
          }}>{t}</button>
        ))}
      </div>
    </div>
  );
}
