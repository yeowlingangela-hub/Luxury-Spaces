import React, { useState, useRef } from 'react';
import { X, RotateCw } from 'lucide-react';

function ControlHandle({ children, onClick, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      onPointerDown={e => e.stopPropagation()}
      style={{
        width: '22px', height: '22px', borderRadius: '50%', border: 'none',
        backgroundColor: danger ? '#e74c3c' : 'rgba(255,255,255,0.92)',
        color: danger ? '#fff' : '#333',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', cursor: 'pointer', padding: 0, lineHeight: 1,
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }}
    >
      {children}
    </button>
  );
}

function DraggableItem({ item, canvasRef, onUpdate, onRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const [pos,      setPos]      = useState({ x: item.x, y: item.y });
  const [scale,    setScale]    = useState(item.scale ?? 1);
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const onPointerDown = (e) => {
    if (e.target.closest('.item-ctrls')) return;
    setSelected(true);
    setIsDragging(true);
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const canvas = canvasRef?.current;
    let nx = e.clientX - offset.current.x;
    let ny = e.clientY - offset.current.y;
    if (canvas) {
      const r = canvas.getBoundingClientRect();
      nx = Math.max(-80, Math.min(r.width  - 60, nx));
      ny = Math.max(-80, Math.min(r.height - 60, ny));
    }
    setPos({ x: nx, y: ny });
  };

  const onPointerUp = () => {
    setIsDragging(false);
    onUpdate({ ...item, x: pos.x, y: pos.y, scale });
  };

  const changeScale = (e, delta) => {
    e.stopPropagation();
    const ns = Math.round(Math.max(0.3, Math.min(scale + delta, 3.5)) * 10) / 10;
    setScale(ns);
    onUpdate({ ...item, x: pos.x, y: pos.y, scale: ns });
  };

  const rotate = (e) => { e.stopPropagation(); setRotation(r => (r + 45) % 360); };
  const remove = (e) => { e.stopPropagation(); onRemove(item.id); };

  const BASE_W = 180;
  const BASE_H = 130;

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={() => setSelected(s => !s)}
      style={{
        position: 'absolute', left: 0, top: 0, touchAction: 'none',
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none', zIndex: isDragging ? 50 : (selected ? 20 : 10),
        width: `${BASE_W}px`,
      }}
    >
      {/* Controls bar — shown when selected */}
      {selected && (
        <div className="item-ctrls" style={{
          position: 'absolute', top: '-32px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '4px',
          backgroundColor: 'rgba(20,20,20,0.85)',
          borderRadius: '20px', padding: '4px 8px', zIndex: 60, whiteSpace: 'nowrap',
        }}>
          <ControlHandle onClick={e => changeScale(e,  0.2)} title="Enlarge">+</ControlHandle>
          <ControlHandle onClick={e => changeScale(e, -0.2)} title="Shrink">−</ControlHandle>
          <ControlHandle onClick={rotate} title="Rotate 45°"><RotateCw size={11} /></ControlHandle>
          <ControlHandle onClick={remove} title="Remove" danger><X size={11} /></ControlHandle>
        </div>
      )}

      {/* Furniture image — no white box, just the photo with shadow */}
      <div style={{
        width: `${BASE_W}px`,
        height: `${BASE_H}px`,
        borderRadius: '8px',
        overflow: 'hidden',
        outline: selected ? '2px solid rgba(203,161,83,0.9)' : '2px solid transparent',
        outlineOffset: '2px',
        boxShadow: isDragging
          ? '0 24px 48px rgba(0,0,0,0.45), 0 4px 8px rgba(0,0,0,0.2)'
          : '0 12px 28px rgba(0,0,0,0.35), 0 4px 8px rgba(0,0,0,0.15)',
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'bottom center',
        transition: isDragging ? 'none' : 'box-shadow 0.25s, outline-color 0.2s',
      }}>
        {item.photoUrl ? (
          <img
            src={item.photoUrl}
            alt={item.variantName || item.type}
            draggable={false}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block',
              pointerEvents: 'none',
              // Use multiply to drop the light background from the unslpash stock photography, leaving only the dark furniture!
              mixBlendMode: 'multiply',
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.85)' }}>
            <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
            <span style={{ fontSize: '0.7rem', marginTop: '4px', color: '#666' }}>{item.type}</span>
          </div>
        )}
      </div>

      {/* Variant label beneath (only when selected) */}
      {selected && item.variantName && (
        <div style={{
          textAlign: 'center', marginTop: '5px', fontSize: '0.62rem',
          color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          fontFamily: 'var(--font-body)', pointerEvents: 'none', lineHeight: 1.3,
        }}>
          {item.variantName}
        </div>
      )}
    </div>
  );
}

export default function VisualizerCanvas({ wallColor, furnitureItems, setFurnitureItems, bgImage }) {
  const canvasRef = useRef(null);

  const updateItem = (u)  => setFurnitureItems(items => items.map(it => it.id === u.id ? u : it));
  const removeItem = (id) => setFurnitureItems(items => items.filter(it => it.id !== id));

  return (
    <div
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        overflow: 'hidden',
        backgroundColor: '#cac5be',
      }}
    >
      {/* Background room photo — no filter, pure image */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("${bgImage || '/hero-bg.png'}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.6s ease',
        }}
      />

      {/* 
        Gradient Masked Wall Tint 
        Using mix-blend-mode: "color" maintains the exact lightness/texture of the original walls
        but completely replaces their hue/saturation with the chosen paint color.
        The linear gradient mask restricts this paint job to the upper 55% of the room.
      */}
      <div 
        style={{
          position: 'absolute', inset: 0,
          backgroundColor: wallColor !== 'transparent' ? wallColor : 'transparent',
          mixBlendMode: 'color', // 'color' blend mode is the gold standard for recoloring textures
          opacity: wallColor !== 'transparent' ? 0.9 : 0,
          pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 65%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 65%)',
          transition: 'opacity 0.6s ease, background-color 0.6s ease',
        }}
      />

      {/* Furniture items */}
      {furnitureItems.map(item => (
        <DraggableItem
          key={item.id}
          item={item}
          canvasRef={canvasRef}
          onUpdate={updateItem}
          onRemove={removeItem}
        />
      ))}

      {furnitureItems.length === 0 && (
        <div style={{
          position: 'absolute', bottom: '1.75rem', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255,255,255,0.88)', padding: '0.6rem 1.4rem',
          borderRadius: '30px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          fontSize: '0.82rem', color: 'var(--color-charcoal)', pointerEvents: 'none', whiteSpace: 'nowrap',
          fontFamily: 'var(--font-body)',
        }}>
          👈 Click any furniture type on the left to choose a real photo
        </div>
      )}
    </div>
  );
}
