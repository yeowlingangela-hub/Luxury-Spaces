import { useState, useRef, useEffect } from 'react';
import { Send, Package, Mic, MessageSquare, PhoneOff } from 'lucide-react';
import { WALL_PALETTE } from '../data/catalog';
import { RetellWebClient } from 'retell-client-js-sdk';

const retellWebClient = new RetellWebClient();

const QUICK_CHIPS = [
  'Add a sofa',
  'Add a floor lamp',
  'Best wall colour?',
  'Make it warmer',
  'Change to charcoal',
  'Make it luxurious',
];

function detectColorChange(text, setWallColor) {
  const t = text.toLowerCase();
  for (const c of WALL_PALETTE) {
    if (t.includes(c.name.toLowerCase())) { setWallColor(c.hex); return c; }
  }
  const keyMap = {
    'ivory': '#F5F0E8', 'beige': '#E8DFD0', 'taupe': '#B8A898',
    'greige': '#9E9488', 'stone': '#C8C0B0', 'charcoal': '#3A3A3A',
    'olive': '#5C5E48', 'sage': '#8A9E88', 'espresso': '#4A3828',
    'brown': '#4A3828', 'dark': '#3A3A3A', 'light': '#F5F0E8',
    'bright': '#F5F0E8', 'warm': '#E8DFD0',
  };
  for (const [kw, hex] of Object.entries(keyMap)) {
    if (t.includes(kw)) { setWallColor(hex); return { name: kw, hex }; }
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
  const [mode, setMode] = useState('text');       // 'text' | 'voice'
  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hi! I'm Bella, your AI Design Assistant.\n\nI can suggest colour palettes, place furniture, or give design advice. How can I help?`,
    },
  ]);
  const [voiceTranscript, setVoiceTranscript] = useState([]);
  const endRef = useRef(null);

  // Synchronous call-state gate — prevents double startCall regardless of React batching
  const callStateRef = useRef('idle'); // 'idle' | 'starting' | 'active'

  // Stable refs so Retell handlers always see the latest props/state
  const addFurnitureRef     = useRef(addFurniture);
  const setWallColorRef     = useRef(setWallColor);
  const furnitureCatalogRef = useRef(furnitureCatalog);
  useEffect(() => { addFurnitureRef.current     = addFurniture; },     [addFurniture]);
  useEffect(() => { setWallColorRef.current     = setWallColor; },     [setWallColor]);
  useEffect(() => { furnitureCatalogRef.current = furnitureCatalog; }, [furnitureCatalog]);

  // ── Retell event listeners — registered ONCE, removed with the EXACT same
  //    function reference so listeners never stack up across tab switches ──
  useEffect(() => {
    const onCallStarted = () => {
      callStateRef.current = 'active';
      setIsCalling(true);
      setVoiceTranscript([]);
    };

    const onCallEnded = () => {
      callStateRef.current = 'idle';
      setIsCalling(false);
      setMode('text');
    };

    const onUpdate = (update) => {
      if (!update.transcript) return;
      setVoiceTranscript(update.transcript.filter(t => t.content?.trim()));

      const last = update.transcript[update.transcript.length - 1];
      if (last?.role === 'user' && last.content) {
        const colorMatch = detectColorChange(last.content, setWallColorRef.current);
        if (!colorMatch) {
          const furnitureMatch = detectFurnitureAdd(last.content, furnitureCatalogRef.current);
          if (furnitureMatch && addFurnitureRef.current) addFurnitureRef.current(furnitureMatch);
        }
      }
    };

    const onError = (err) => {
      console.error('Retell error:', err);
      callStateRef.current = 'idle';
      setIsCalling(false);
      setMode('text');
    };

    retellWebClient.on('call_started', onCallStarted);
    retellWebClient.on('call_ended',   onCallEnded);
    retellWebClient.on('update',       onUpdate);
    retellWebClient.on('error',        onError);

    return () => {
      // Pass the EXACT same references — this is what actually removes the listeners
      retellWebClient.off('call_started', onCallStarted);
      retellWebClient.off('call_ended',   onCallEnded);
      retellWebClient.off('update',       onUpdate);
      retellWebClient.off('error',        onError);
      // Kill any live call when the component unmounts (e.g. user switches tabs)
      retellWebClient.stopCall();
      callStateRef.current = 'idle';
    };
  }, []); // empty — runs once per mount/unmount

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, voiceTranscript]);

  // ── Voice ────────────────────────────────────────────────────────────────

  const startVoice = async () => {
    if (callStateRef.current !== 'idle') return;  // synchronous guard
    callStateRef.current = 'starting';
    setMode('voice');
    try {
      // Ensure no zombie connection before starting a fresh one
      try { retellWebClient.stopCall(); } catch (_) {}

      const res  = await fetch('/api/create-web-call', { method: 'POST' });
      const data = await res.json();
      if (!data.access_token) throw new Error('No access token');
      await retellWebClient.startCall({ accessToken: data.access_token });
      // callStateRef → 'active' set inside onCallStarted
    } catch (err) {
      console.error('Voice call failed:', err);
      callStateRef.current = 'idle';
      setMode('text');
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "I'm sorry, I couldn't start the voice chat. Please try again.",
      }]);
    }
  };

  const stopVoice = () => {
    callStateRef.current = 'idle';
    retellWebClient.stopCall();
    setIsCalling(false);
    setMode('text');
  };

  const handleModeSwitch = (newMode) => {
    if (newMode === 'voice') {
      startVoice();                                   // internally guarded
    } else {
      if (callStateRef.current !== 'idle') stopVoice();
      else setMode('text');
    }
  };

  // ── Text send — blocked entirely while voice is active ───────────────────

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || callStateRef.current !== 'idle') return;
    setInput('');

    let localAction = null;
    let localItem   = null;

    const colorMatch = detectColorChange(trimmed, setWallColor);
    if (colorMatch) {
      localAction = 'color';
      localItem   = colorMatch.name;
    } else {
      const furnitureMatch = detectFurnitureAdd(trimmed, furnitureCatalog);
      if (furnitureMatch && addFurniture) {
        addFurniture(furnitureMatch);
        localAction = 'furniture';
        localItem   = furnitureMatch.type;
      }
    }

    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);

    if (localAction) {
      const actionMsg = localAction === 'color'
        ? `Wall colour updated to ${localItem}.`
        : `${localItem} has been added to your room.`;
      setMessages(prev => [...prev, { role: 'assistant', text: actionMsg, action: localAction }]);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); send(input); };

  const displayMessages = mode === 'voice'
    ? voiceTranscript.map(t => ({ role: t.role === 'agent' ? 'assistant' : 'user', text: t.content }))
    : messages;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        padding: '0.9rem 1rem',
        background: 'linear-gradient(135deg, var(--color-espresso-brown) 0%, #5c3d2e 100%)',
        display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0,
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.18)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', fontWeight: 700, flexShrink: 0,
        }}>B</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>Bella</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              backgroundColor: isCalling ? '#f97316' : '#4ade80',
              animation: isCalling ? 'blink 1s infinite' : 'none',
            }} />
            <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.78)' }}>
              {isCalling ? 'Listening…' : 'AI Design Assistant'}
            </div>
          </div>
        </div>
      </div>

      {/* Chat / Talk Mode Selector */}
      <div style={{
        display: 'flex', gap: '0.6rem', padding: '0.85rem',
        borderBottom: '1px solid var(--border-color)', flexShrink: 0,
        backgroundColor: 'var(--bg-color)',
      }}>
        {[
          { key: 'text',  label: 'Chat', sub: 'Type your question', Icon: MessageSquare },
          { key: 'voice', label: 'Talk', sub: 'Voice conversation',  Icon: Mic },
        ].map(({ key, label, sub, Icon }) => (
          <button
            key={key}
            onClick={() => handleModeSwitch(key)}
            style={{
              flex: 1, padding: '0.75rem 0.5rem', borderRadius: '10px', cursor: 'pointer',
              border: mode === key ? '2px solid var(--color-espresso-brown)' : '1.5px solid var(--border-color)',
              backgroundColor: mode === key ? 'rgba(74,56,40,0.06)' : '#fff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
              transition: 'all 0.2s', fontFamily: 'var(--font-body)',
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              backgroundColor: mode === key ? 'rgba(74,56,40,0.1)' : 'var(--color-champagne-beige)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={16} color={mode === key ? 'var(--color-espresso-brown)' : 'var(--color-taupe)'} />
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: mode === key ? 'var(--color-espresso-brown)' : 'var(--text-secondary)' }}>
              {label}
            </div>
            <div style={{ fontSize: '0.63rem', color: 'var(--color-taupe)' }}>{sub}</div>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '0.85rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>

        {/* Voice idle state */}
        {mode === 'voice' && isCalling && voiceTranscript.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-taupe)' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              backgroundColor: 'var(--color-champagne-beige)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem', animation: 'pulse 2s infinite',
            }}>
              <Mic size={22} color="var(--color-espresso-brown)" />
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.4rem' }}>
              Listening…
            </div>
            <p style={{ fontSize: '0.72rem', lineHeight: 1.5 }}>
              Try saying "Add a sofa" or "Change walls to charcoal".
            </p>
          </div>
        )}

        {mode === 'voice' && !isCalling && voiceTranscript.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-taupe)' }}>
            <Mic size={30} color="var(--border-color)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
            <p style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
              Click <strong>Talk</strong> above to start a voice conversation.
            </p>
          </div>
        )}

        {/* Conversation bubbles */}
        {displayMessages.map((msg, idx) => (
          msg.text ? (
            <div key={idx} style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '92%',
              backgroundColor: msg.role === 'user' ? 'var(--color-charcoal)' : '#fff',
              color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
              padding: '0.65rem 0.9rem',
              borderRadius: msg.role === 'user' ? '14px 14px 0 14px' : '14px 14px 14px 0',
              fontSize: '0.82rem', lineHeight: 1.55,
              border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.action === 'furniture' && (
                <Package size={12} style={{ marginRight: '5px', verticalAlign: 'middle', color: 'var(--color-brushed-gold)' }} />
              )}
              {msg.text}
            </div>
          ) : null
        ))}

        {/* Live transcript indicator */}
        {mode === 'voice' && isCalling && voiceTranscript.length > 0 && (
          <div style={{
            alignSelf: 'center', fontSize: '0.65rem', color: 'var(--color-taupe)',
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '0.2rem 0.6rem',
            backgroundColor: 'rgba(74,56,40,0.05)', borderRadius: '20px',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              backgroundColor: '#f97316', display: 'inline-block',
              animation: 'blink 1s infinite',
            }} />
            Live transcript
          </div>
        )}


        <div ref={endRef} />
      </div>

      {/* Quick Chips — only shown in text mode */}
      {mode === 'text' && (
        <div style={{ padding: '0.5rem 0.85rem 0', flexShrink: 0, borderTop: '1px solid var(--border-color)' }}>
          <div style={{
            fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em',
            color: 'var(--color-greige)', marginBottom: '0.4rem', paddingTop: '0.2rem',
          }}>Quick Questions</div>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', paddingBottom: '0.4rem' }}>
            {QUICK_CHIPS.map((s, i) => (
              <button key={i} onClick={() => send(s)} style={{
                padding: '0.25rem 0.55rem', fontSize: '0.68rem', borderRadius: '10px',
                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)',
                cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)',
                transition: 'all 0.15s',
              }} className="chip-btn">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input (text) / End Call (voice) */}
      <div style={{ padding: '0.65rem 0.85rem', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
        {mode === 'text' ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              type="text"
              placeholder="Type your message…"
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{
                flex: 1, padding: '0.65rem 0.9rem', borderRadius: '20px',
                border: '1px solid var(--border-color)',
                fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                outline: 'none', backgroundColor: 'var(--bg-color)',
              }}
            />
            <button type="submit" style={{
              width: '36px', height: '36px', borderRadius: '50%', border: 'none',
              backgroundColor: 'var(--color-espresso-brown)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}>
              <Send size={14} />
            </button>
          </form>
        ) : (
          <button onClick={stopVoice} style={{
            width: '100%', padding: '0.65rem', borderRadius: '20px',
            backgroundColor: '#ef4444', color: '#fff', border: 'none',
            fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            <PhoneOff size={14} /> End Voice Call
          </button>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(74,56,40,0.35)} 70%{box-shadow:0 0 0 14px rgba(74,56,40,0)} 100%{box-shadow:0 0 0 0 rgba(74,56,40,0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .chip-btn:hover { background-color: var(--color-champagne-beige) !important; border-color: var(--color-taupe) !important; }
      `}</style>
    </div>
  );
}
