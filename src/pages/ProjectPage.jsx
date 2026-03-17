import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Image as ImageIcon, Settings } from 'lucide-react';

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [rooms] = useState([
    { id: 1, name: 'Living Room', type: 'Living Room', status: 'In Progress', image: '/hero-bg.png' },
    { id: 2, name: 'Master Bedroom', type: 'Master Bedroom', status: 'Draft', image: '/room-bedroom.png' },
    { id: 3, name: 'Study / Home Office', type: 'Study / Home Office', status: 'Draft', image: '/room-study.png' },
    { id: 3, name: 'Outdoor Terrace', type: 'Outdoor Space', status: 'Completed', image: null },
  ]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Top Navbar Contextual */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 3rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/dashboard" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
            <ChevronLeft size={16} /> Back to Projects
          </Link>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 1rem' }}></div>
          <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-espresso-brown)' }}>The Nassim Residence</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="premium-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            <Settings size={16} /> Project Settings
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '3rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Rooms & Spaces</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Select a space to enter the visualizer studio.</p>
          </div>
          <button 
            onClick={() => navigate(`/project/${projectId}/room/setup`)}
            className="premium-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Add New Room
          </button>
        </div>

        {/* Rooms Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '2rem'
        }}>
          {rooms.map((room) => (
            <div 
              key={room.id} 
              onClick={() => navigate(`/project/${projectId}/room/${room.id}/workspace?type=${encodeURIComponent(room.type)}`)}
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                display: 'flex',
                height: '140px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              className="room-card"
            >
              <div style={{
                width: '140px',
                backgroundColor: 'var(--color-champagne-beige)',
                backgroundImage: room.image ? `url("${room.image}")` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-taupe)'
              }}>
                {!room.image && <ImageIcon size={24} opacity={0.5} />}
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{room.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  {room.type}
                </p>
                <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: 'var(--subtle-bg, #F1ECE3)', color: 'var(--color-muted-olive)', fontSize: '0.75rem', borderRadius: '4px', alignSelf: 'flex-start', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {room.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style>
        {`
          .room-card:hover {
            transform: translateX(4px);
            box-shadow: 0 8px 16px rgba(42, 42, 42, 0.05);
            border-color: var(--color-taupe);
          }
        `}
      </style>
    </div>
  );
}
