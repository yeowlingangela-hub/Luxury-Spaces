import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Package } from 'lucide-react';
import { WALL_PALETTE } from '../data/catalog';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const API_KEY = "AIzaSyApaBE5fy6oTjYtU-vsbF69XHBpbisalXs";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "You are an elite interior design AI for 'Luxury Spaces'. You ONLY answer questions related to interior design, furniture, color palettes, and luxury architecture. If a user asks a general question, politely redirect them back to design. Your tone is elegant, brief (1-2 sentences), and highly professional. If a user command triggers a UI action (like adding furniture or changing paint), you will receive a [Hidden Context] prompt; use this to state that you have applied the change to their canvas."
});

const QUICK_CHIPS = [
  'Add a sofa',
  'Add a floor lamp',
  'Best wall colour?',
  'Make it warmer',
  'Change to charcoal',
];

function detectColorChange(text, setWallColor) {
  const t = text.toLowerCase();
  for (const c of WALL_PALETTE) {
    if (t.includes(c.name.toLowerCase())) {
      setWallColor(c.hex);
      return c;
    }
  }
  const keyMap = {
    'ivory':       '#F5F0E8',
    'beige':       '#E8DFD0',
    'taupe':       '#B8A898',
    'greige':      '#9E9488',
    'stone':       '#C8C0B0',
    'charcoal':    '#3A3A3A',
    'olive':       '#5C5E48',
    'sage':        '#8A9E88',
    'espresso':    '#4A3828',
    'brown':       '#4A3828',
    'dark':        '#3A3A3A',
    'light':       '#F5F0E8',
    'bright':      '#F5F0E8',
    'warm':        '#E8DFD0',
  };
  for (const [kw, hex] of Object.entries(keyMap)) {
    if (t.includes(kw)) {
      setWallColor(hex);
      return { name: kw, hex };
    }
  }
  return null;
}

function detectFurnitureAdd(text, catalog) {
  const t = text.toLowerCase();
  const addVerbs = ['add', 'place', 'put', 'insert', 'bring in', 'drop', 'include'];
  if (!addVerbs.some(v => t.includes(v))) return null;
  return catalog.find(item => t.includes(item.type.toLowerCase()));
}

export default function ChatbotPanel({ addFurniture, setWallColor, furnitureCatalog = [] }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I'm your AI Design Assistant.\n\nI can:\n• Suggest colour palettes ("Change walls to charcoal")\n• Place furniture ("Add a sofa", "Place a floor lamp")\n• Give design advice ("How to make the room feel luxurious?")\n\nWhat would you like to do?`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const [chatSession, setChatSession] = useState(null);

  useEffect(() => {
    // Start Gemini chat session
    setChatSession(model.startChat({
      history: [
        { role: "user", parts: [{ text: "Hello, who are you?" }] },
        { role: "model", parts: [{ text: "Hello! I am your AI Design Assistant." }] }
      ]
    }));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping || !chatSession) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setIsTyping(true);

    let localAction = null;
    let localItem = null;

    // Detect if we need to execute a UI command locally
    const colorMatch = detectColorChange(trimmed, setWallColor);
    if (colorMatch) {
      localAction = 'color';
      localItem = colorMatch.name;
    } else {
      const furnitureMatch = detectFurnitureAdd(trimmed, furnitureCatalog);
      if (furnitureMatch && addFurniture) {
        addFurniture(furnitureMatch);
        localAction = 'furniture';
        localItem = furnitureMatch.type;
      }
    }

    try {
      // Send the prompt to Gemini (with hidden context if a UI action was taken)
      const prompt = localAction 
        ? `[Hidden Context: I just changed the ${localAction === 'color' ? 'wall color to ' + localItem : 'placed a ' + localItem + ' on the canvas'}.] ` + trimmed 
        : trimmed;
        
      const result = await chatSession.sendMessage(prompt);
      const reply = result.response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', text: reply, action: localAction }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I'm having trouble connecting to my AI brain at the moment." }]);
    }
    
    setIsTyping(false);
  };

  const handleSubmit = (e) => { e.preventDefault(); send(input); };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--color-champagne-beige)', display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--color-espresso-brown)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={14} />
        </div>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>Design Assistant</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-taupe)' }}>Powered by Gemini</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '0.85rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '92%',
            backgroundColor: msg.role === 'user' ? 'var(--color-charcoal)' : '#fff',
            color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
            padding: '0.7rem 0.9rem',
            borderRadius: msg.role === 'user' ? '14px 14px 0 14px' : '14px 14px 14px 0',
            fontSize: '0.82rem', lineHeight: 1.55,
            border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
            whiteSpace: 'pre-wrap',
          }}>
            {msg.action && (
              <Package size={12} style={{ marginRight: '5px', verticalAlign: 'middle', color: 'var(--color-brushed-gold)' }} />
            )}
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', padding: '0.6rem 0.85rem', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '14px 14px 14px 0', display: 'flex', gap: '4px', alignItems: 'center' }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--color-taupe)', display: 'inline-block', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick chips */}
      <div style={{ padding: '0.4rem 0.85rem 0', display: 'flex', gap: '0.35rem', flexWrap: 'wrap', flexShrink: 0 }}>
        {QUICK_CHIPS.map((s, i) => (
          <button key={i} onClick={() => send(s)} style={{
            padding: '0.25rem 0.55rem', fontSize: '0.68rem', borderRadius: '10px',
            border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)',
            cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', transition: 'all 0.15s'
          }} className="chip-btn">
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '0.65rem 0.85rem', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.4rem' }}>
          <input
            type="text"
            placeholder='"Add a sofa" or "Change to warm ivory"'
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              flex: 1, padding: '0.65rem 0.9rem', borderRadius: '20px', border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-body)', fontSize: '0.82rem', outline: 'none', backgroundColor: 'var(--bg-color)',
            }}
          />
          <button type="submit" disabled={isTyping} style={{
            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
            backgroundColor: isTyping ? 'var(--color-taupe)' : 'var(--color-espresso-brown)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isTyping ? 'not-allowed' : 'pointer', flexShrink: 0,
          }}>
            <Send size={14} />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        .chip-btn:hover { background-color: var(--color-champagne-beige) !important; border-color: var(--color-taupe) !important; }
      `}</style>
    </div>
  );
}
