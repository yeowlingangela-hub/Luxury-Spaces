import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';

export default function CameraCaptureModal({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Could not access camera. Please check your browser permissions.");
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Match canvas to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to data url and pass back
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
    
    // Clean up
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        backgroundColor: 'var(--bg-color)', width: '90%', maxWidth: '700px',
        borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)'
      }}>
        
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-espresso-brown)', fontWeight: 500 }}>Take Photo</h3>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: '#000', position: 'relative', display: 'flex', justifyContent: 'center', minHeight: '300px' }}>
          {error ? (
            <div style={{ color: '#e74c3c', textAlign: 'center', alignSelf: 'center', fontFamily: 'var(--font-body)' }}>
              {error}
            </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', backgroundColor: '#000' }}
            />
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', backgroundColor: '#fff' }}>
          <button 
            onClick={handleCapture}
            disabled={!!error || !stream}
            style={{
              padding: '0.8rem 2rem', borderRadius: '30px', border: 'none',
              backgroundColor: error || !stream ? '#ccc' : 'var(--color-espresso-brown)',
              color: '#fff', fontSize: '1rem', fontWeight: 500, fontFamily: 'var(--font-body)',
              cursor: error || !stream ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'background-color 0.2s'
            }}
          >
            <Camera size={18} /> Capture Photo
          </button>
        </div>

      </div>
    </div>
  );
}
