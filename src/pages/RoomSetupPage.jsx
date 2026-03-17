import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Upload, Check } from 'lucide-react';

export default function RoomSetupPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Living Room',
    length: '',
    width: '',
    height: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/project/${projectId}/room/1/workspace?type=${encodeURIComponent(formData.type)}`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          <Link to={`/project/${projectId}`} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
            <ChevronLeft size={16} /> Back to Project
          </Link>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 1rem' }}></div>
          <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-espresso-brown)' }}>New Room Setup</h2>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Define Space</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          Enter the dimensions and upload a base photo of the room to start designing.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          {/* Left Column: Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Room Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="e.g. Master Suite" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Room Type</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <optgroup label="Indoor Spaces">
                  <option>Living Room</option>
                  <option>Dining Room</option>
                  <option>Dry Kitchen</option>
                  <option>Master Bedroom</option>
                  <option>Bathroom</option>
                  <option>Study / Home Office</option>
                </optgroup>
                <optgroup label="Outdoor Spaces">
                  <option>Balcony</option>
                  <option>Terrace</option>
                  <option>Pool Deck</option>
                </optgroup>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label>Length (m)</label>
                <input type="number" name="length" placeholder="0.0" step="0.1" value={formData.length} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Width (m)</label>
                <input type="number" name="width" placeholder="0.0" step="0.1" value={formData.width} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Height (m)</label>
                <input type="number" name="height" placeholder="0.0" step="0.1" value={formData.height} onChange={handleChange} />
              </div>
            </div>

            <div className="input-group">
              <label>Room Notes</label>
              <textarea 
                name="notes" 
                placeholder="Details about windows, doors, existing flooring..." 
                rows="4"
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <button type="submit" className="premium-btn" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={18} /> Create & Enter Workspace
            </button>
          </div>

          {/* Right Column: Upload */}
          <div>
            <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-greige)', marginBottom: '0.5rem', display: 'block' }}>
              Base Room Photo
            </label>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '8px',
              height: '350px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }} className="upload-zone">
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-champagne-beige)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--color-taupe)'
              }}>
                <Upload size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Upload Photo</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '0 2rem' }}>
                Drag and drop your high-resolution room photo here, or click to browse.
              </p>
            </div>
          </div>
        </form>
      </main>

      <style>
        {`
          .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .input-group label {
            font-size: 0.85rem;
            text-transform: uppercase;
            letterSpacing: 0.05em;
            color: var(--color-greige);
          }
          .input-group input, .input-group select, .input-group textarea {
            padding: 0.8rem 1rem;
            border: 1px solid var(--border-color);
            backgroundColor: #fff;
            border-radius: 4px;
            font-family: var(--font-body);
            font-size: 1rem;
            color: var(--text-primary);
            outline: none;
            transition: border-color 0.3s ease;
          }
          .input-group input:focus, .input-group select:focus, .input-group textarea:focus {
            border-color: var(--color-charcoal);
          }
          .upload-zone:hover {
            border-color: var(--color-taupe);
            background-color: var(--color-warm-ivory);
          }
        `}
      </style>
    </div>
  );
}
