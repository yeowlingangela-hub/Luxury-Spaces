import { Calendar, Clock, Trash2 } from 'lucide-react';

export default function AppointmentCalendar({ appointments, onRemove }) {
  // Group by date
  const grouped = appointments.reduce((acc, appt) => {
    if (!acc[appt.date]) acc[appt.date] = [];
    acc[appt.date].push(appt);
    return acc;
  }, {});

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Sub-header */}
      <div style={{
        padding: '1rem', borderBottom: '1px solid var(--border-color)', flexShrink: 0,
        backgroundColor: 'var(--color-champagne-beige)',
      }}>
        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-greige)', marginBottom: '0.2rem' }}>
          Upcoming
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} scheduled
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {appointments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-taupe)' }}>
            <Calendar size={32} color="var(--border-color)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
            <div style={{ fontSize: '0.82rem', marginBottom: '0.4rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              No appointments yet
            </div>
            <p style={{ fontSize: '0.72rem', lineHeight: 1.6, maxWidth: '180px', margin: '0 auto' }}>
              Ask Alex to "book a consultation" or "schedule a meeting" to add appointments here.
            </p>
          </div>
        )}

        {Object.entries(grouped).map(([date, appts]) => (
          <div key={date}>
            <div style={{
              fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'var(--color-greige)', marginBottom: '0.5rem',
              paddingBottom: '0.3rem', borderBottom: '1px solid var(--border-color)',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
              <Calendar size={11} /> {date}
            </div>

            {appts.map((appt) => (
              <div key={appt.id} style={{
                backgroundColor: '#fff', borderRadius: '8px', padding: '0.75rem',
                marginBottom: '0.5rem', border: '1px solid var(--border-color)',
                borderLeft: '3px solid var(--color-espresso-brown)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.3rem' }}>
                    {appt.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--color-taupe)' }}>
                    <Clock size={11} /> {appt.time}
                  </div>
                </div>
                <button
                  onClick={() => onRemove && onRemove(appt.id)}
                  title="Remove appointment"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '2px', color: 'var(--color-taupe)',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
