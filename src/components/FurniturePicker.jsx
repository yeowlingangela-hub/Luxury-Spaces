import React from 'react';
import { X, ChevronLeft } from 'lucide-react';

export default function FurniturePicker({ category, onSelect, onClose }) {
  if (!category) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(42,42,42,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#fff', borderRadius: '12px',
          width: 'min(700px, 92vw)', maxHeight: '80vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--color-champagne-beige)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.6rem' }}>{category.icon}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-espresso-brown)' }}>
                Choose {category.type}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Select a style to place on the canvas
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Variants Grid */}
        <div style={{ overflowY: 'auto', padding: '1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
            gap: '1rem',
          }}>
            {category.variants.map((v, idx) => (
              <div
                key={idx}
                onClick={() => { onSelect({ ...category, selectedVariant: v }); onClose(); }}
                style={{
                  border: '1px solid var(--border-color)', borderRadius: '8px',
                  overflow: 'hidden', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="variant-card"
              >
                <div style={{ height: '140px', overflow: 'hidden', backgroundColor: 'var(--color-champagne-beige)' }}>
                  <img
                    src={v.url}
                    alt={v.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 500, color: 'var(--color-espresso-brown)' }}>
                    {v.name}
                  </p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {category.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .variant-card:hover {
          border-color: var(--color-charcoal) !important;
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
        }
        .variant-card:hover img { transform: scale(1.05); }
      `}</style>
    </div>
  );
}
