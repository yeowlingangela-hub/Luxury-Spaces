import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Folder, MoreVertical } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [projects] = useState([
    { id: 1, name: 'The Nassim Residence', client: 'Mr. & Mrs. Lim', rooms: 5, date: 'Oct 12, 2023', image: '/hero-bg.png' },
    { id: 2, name: 'Sentosa Cove Villa', client: 'Chen Family', rooms: 8, date: 'Nov 04, 2023', image: null },
    { id: 3, name: 'Orchard Penthouse', client: 'Sarah W.', rooms: 3, date: 'Jan 15, 2024', image: null },
  ]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Top Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 3rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Luxury Spaces</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', gap: '1.5rem' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }}>Projects</span>
            <span style={{ cursor: 'pointer' }}>Templates</span>
            <span style={{ cursor: 'pointer' }}>Assets</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              style={{
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--color-champagne-beige)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                outline: 'none',
                width: '250px'
              }}
            />
          </div>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-espresso-brown)',
            color: 'var(--color-warm-ivory)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            DS
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '3rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Projects</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your luxury residential designs.</p>
          </div>
          <button className="premium-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> New Project
          </button>
        </div>

        {/* Project Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {projects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => navigate(`/project/${project.id}`)}
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              className="project-card"
            >
              <div style={{
                height: '180px',
                backgroundColor: 'var(--color-champagne-beige)',
                backgroundImage: project.image ? `url("${project.image}")` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-taupe)'
              }}>
                {!project.image && <Folder size={32} opacity={0.5} />}
              </div>
              <div style={{ padding: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-secondary)' }}>
                  <MoreVertical size={18} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', paddingRight: '1rem' }}>{project.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Client: {project.client}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-greige)', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <span>{project.rooms} Rooms</span>
                  <span>Last edited {project.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style>
        {`
          .project-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(42, 42, 42, 0.08);
          }
        `}
      </style>
    </div>
  );
}
