import React, { useState, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Save, Play, Palette, MessageSquare, Image as ImageIcon, Camera } from 'lucide-react';
import VisualizerCanvas from '../components/VisualizerCanvas';
import ChatbotPanel from '../components/ChatbotPanel';
import ColorSimulator from '../components/ColorSimulator';
import FurniturePicker from '../components/FurniturePicker';
import { FURNITURE_CATALOG } from '../data/catalog';

const ROOM_BACKGROUNDS = {
  'bedroom':    '/room-bedroom.png',
  'study':      '/room-study.png',
  'office':     '/room-study.png',
  'dining':     '/room-dining.png',
};
function getRoomBg(type = '') {
  const t = type.toLowerCase();
  for (const [key, val] of Object.entries(ROOM_BACKGROUNDS)) {
    if (t.includes(key)) return val;
  }
  return '/hero-bg.png';
}

export default function WorkspacePage() {
  const { projectId } = useParams();
  const location = useLocation();
  const roomType = new URLSearchParams(location.search).get('type') || 'Living Room';

  const [activeTab, setActiveTab]         = useState('Color');
  const [wallColor, setWallColor]         = useState('transparent');
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [bgImage, setBgImage]             = useState(getRoomBg(roomType));
  const [pickerCategory, setPickerCategory] = useState(null); // currently open picker

  const bgFileRef        = useRef(null);
  const furnitureFileRef = useRef(null);

  // Place chosen variant on canvas
  const handleVariantSelect = (categoryWithVariant) => {
    const variant = categoryWithVariant.selectedVariant;
    setFurnitureItems(prev => [...prev, {
      id: Date.now(),
      type: categoryWithVariant.type,
      icon: categoryWithVariant.icon,
      photoUrl: variant.url,
      variantName: variant.name,
      x: 100 + Math.random() * 120,
      y: 100 + Math.random() * 80,
      scale: 1,
    }]);
  };

  // Also allow chatbot to add (without photo picker, uses first variant)
  const addFurnitureDirect = (item) => {
    const cat = FURNITURE_CATALOG.find(c => c.type.toLowerCase() === item.type.toLowerCase()) || FURNITURE_CATALOG[0];
    const variant = cat.variants[0];
    setFurnitureItems(prev => [...prev, {
      id: Date.now(),
      type: cat.type,
      icon: cat.icon,
      photoUrl: variant.url,
      variantName: variant.name,
      x: 100 + Math.random() * 120,
      y: 100 + Math.random() * 80,
      scale: 1,
    }]);
  };

  const handleBgFile = (e) => {
    const file = e.target.files[0];
    if (file) setBgImage(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleCustomFurniture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFurnitureItems(prev => [...prev, {
      id: Date.now(),
      type: 'Custom Asset',
      icon: '✨',
      photoUrl: url,
      variantName: 'Uploaded Photo',
      x: 100 + Math.random() * 100,
      y: 100 + Math.random() * 80,
      scale: 1,
    }]);
    e.target.value = '';
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--bg-color)' }}>

      {/* Furniture Picker Modal */}
      {pickerCategory && (
        <FurniturePicker
          category={pickerCategory}
          onSelect={handleVariantSelect}
          onClose={() => setPickerCategory(null)}
        />
      )}

      {/* ── Top Bar ── */}
      <header style={{
        height: '60px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 2rem', borderBottom: '1px solid var(--border-color)', backgroundColor: '#fff', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to={`/project/${projectId}`} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
            <ChevronLeft size={16} /> Back
          </Link>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 0.5rem' }} />
          <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 500, color: 'var(--color-espresso-brown)' }}>
            {roomType} — The Nassim Residence
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Change background photo */}
          <button onClick={() => bgFileRef.current?.click()} style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
            <ImageIcon size={13} /> Change Room Photo
          </button>
          <input ref={bgFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBgFile} />
          <button className="premium-btn" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Save size={13} /> Save
          </button>
          <button className="premium-btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Play size={13} /> Present
          </button>
        </div>
      </header>

      {/* ── Main body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left Sidebar */}
        <aside style={{
          width: '240px', flexShrink: 0, backgroundColor: '#fff',
          borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column',
        }}>
          {/* Room label */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-greige)', marginBottom: '0.4rem' }}>Current Space</div>
            <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--color-champagne-beige)', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 500 }}>
              {roomType}
            </div>
          </div>

          {/* Furniture list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-greige)', marginBottom: '0.4rem' }}>
              Furniture &amp; Assets
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-taupe)', marginBottom: '0.85rem', lineHeight: 1.4 }}>
              Click any item to choose a style, then place it on the canvas.
            </p>
            <button
              onClick={() => furnitureFileRef.current?.click()}
              style={{
                width: '100%', marginBottom: '1rem', padding: '0.65rem',
                backgroundColor: 'var(--color-charcoal)', color: '#fff',
                border: 'none', borderRadius: '6px', fontSize: '0.78rem',
                fontFamily: 'var(--font-body)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <ImageIcon size={14} /> Upload Custom Item
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {FURNITURE_CATALOG.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setPickerCategory(item)}
                  title={`Choose ${item.type} style`}
                  style={{
                    height: '68px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)',
                    borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', padding: 0,
                    fontFamily: 'var(--font-body)', transition: 'all 0.18s ease',
                  }}
                  className="asset-card"
                >
                  <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{item.icon}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-espresso-brown)', marginTop: '0.25rem' }}>{item.type}</span>
                </button>
              ))}
            </div>

            {/* Styling presets */}
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-greige)', margin: '1.25rem 0 0.5rem' }}>
              Style Presets
            </div>
            {['Modern Luxury', 'Quiet Luxury', 'Japandi Luxury', 'Hotel Suite', 'Dark Luxury', 'Tropical Resort'].map((p, i) => (
              <button key={i} style={{
                display: 'block', width: '100%', padding: '0.55rem 0.75rem', marginBottom: '0.35rem',
                textAlign: 'left', border: '1px solid var(--border-color)', borderRadius: '4px',
                fontSize: '0.78rem', fontFamily: 'var(--font-body)', backgroundColor: 'transparent',
                color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.18s',
              }} className="preset-btn">
                {p}
              </button>
            ))}
          </div>
        </aside>

        {/* Center Canvas */}
        <main style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#d0ccc6' }}>
          <VisualizerCanvas
            wallColor={wallColor}
            furnitureItems={furnitureItems}
            setFurnitureItems={setFurnitureItems}
            bgImage={bgImage}
          />
          {/* Hidden file input for custom furniture */}
          <input
            ref={furnitureFileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleCustomFurniture}
          />
        </main>

        {/* Right Panel */}
        <aside style={{
          width: '290px', flexShrink: 0, backgroundColor: '#fff',
          borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
            {[{ key: 'Color', label: 'Walls', icon: <Palette size={13} /> },
              { key: 'Chat',  label: 'AI Chat', icon: <MessageSquare size={13} /> }].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                flex: 1, padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                borderBottom: activeTab === tab.key ? '2px solid var(--color-espresso-brown)' : '2px solid transparent',
                color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.key ? 500 : 400,
                fontFamily: 'var(--font-body)', fontSize: '0.82rem', cursor: 'pointer',
                backgroundColor: 'transparent', transition: 'all 0.2s',
              }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {activeTab === 'Color'
              ? <ColorSimulator wallColor={wallColor} setWallColor={setWallColor} />
              : <ChatbotPanel
                  addFurniture={addFurnitureDirect}
                  setWallColor={setWallColor}
                  furnitureCatalog={FURNITURE_CATALOG}
                />
            }
          </div>
        </aside>
      </div>

      <style>{`
        .asset-card:hover { border-color: var(--color-charcoal) !important; background-color: var(--color-champagne-beige) !important; }
        .preset-btn:hover { background-color: var(--color-champagne-beige) !important; border-color: var(--color-taupe) !important; }
      `}</style>
    </div>
  );
}
