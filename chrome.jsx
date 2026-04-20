// LifeLoop — custom Android-sized chrome (bone aesthetic, not M3)

const LLStatusBar = ({ bg, fg }) => (
  <div style={{
    height: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 20px', background: bg, color: fg, fontFamily: 'Inter, sans-serif',
    fontSize: 13, fontWeight: 500, letterSpacing: 0.2, flexShrink: 0,
    position: 'relative',
  }}>
    <span>9:41</span>
    <div style={{
      position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)',
      width: 18, height: 18, borderRadius: 100, background: '#1c1c1c',
    }} />
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {/* signal */}
      <svg width="14" height="10" viewBox="0 0 14 10" fill={fg}>
        <rect x="0" y="7" width="2" height="3" rx="0.5"/>
        <rect x="4" y="5" width="2" height="5" rx="0.5"/>
        <rect x="8" y="3" width="2" height="7" rx="0.5"/>
        <rect x="12" y="0" width="2" height="10" rx="0.5" opacity="0.4"/>
      </svg>
      {/* battery */}
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none" stroke={fg} strokeWidth="1">
        <rect x="0.5" y="0.5" width="16" height="9" rx="1.5"/>
        <rect x="2" y="2" width="11" height="6" rx="0.5" fill={fg}/>
        <rect x="17" y="3" width="1.5" height="4" rx="0.5" fill={fg}/>
      </svg>
    </div>
  </div>
);

const LLNavBar = ({ fg }) => (
  <div style={{ height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <div style={{ width: 120, height: 4, borderRadius: 2, background: fg, opacity: 0.6 }} />
  </div>
);

// Phone frame with optional screen scrolling
function Phone({ children, width = 390, height = 812, palette, label }) {
  const { bg, fg, frame } = palette;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{
        width, height, borderRadius: 44, padding: 6, boxSizing: 'border-box',
        background: frame,
        boxShadow: '0 30px 60px -20px rgba(40,30,20,0.25), 0 8px 20px -10px rgba(40,30,20,0.15), inset 0 0 0 1px rgba(255,255,255,0.15)',
        position: 'relative',
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 38, overflow: 'hidden',
          background: bg, display: 'flex', flexDirection: 'column',
          position: 'relative',
        }}>
          <LLStatusBar bg={bg} fg={fg} />
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {children}
          </div>
          <LLNavBar fg={fg} />
        </div>
      </div>
      {label && (
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
          color: 'oklch(0.45 0.01 70)', letterSpacing: 1.5, textTransform: 'uppercase',
        }}>{label}</div>
      )}
    </div>
  );
}

// Progress ring — the core metaphor
function Ring({ progress = 0, size = 36, stroke = 2, color, track = 'currentColor', trackOpacity = 0.12, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * Math.max(0, Math.min(1, progress));
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeOpacity={trackOpacity} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}/>
      </svg>
      {children && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{children}</div>
      )}
    </div>
  );
}

// Category dot
function CatDot({ cat, size = 6 }) {
  const c = window.CATEGORIES[cat];
  return <span style={{
    display: 'inline-block', width: size, height: size, borderRadius: '50%',
    background: c.dot, flexShrink: 0,
  }}/>;
}

// Icons (hand-tuned, minimal stroke)
const Icon = {
  plus: (s=20) => <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 4v12M4 10h12"/></svg>,
  check: (s=20) => <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.5l4 4 8-9"/></svg>,
  chevL: (s=20) => <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5l-5 5 5 5"/></svg>,
  chevR: (s=20) => <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 5l5 5-5 5"/></svg>,
  dots: (s=20) => <svg width={s} height={s} viewBox="0 0 20 20" fill="currentColor"><circle cx="5" cy="10" r="1.4"/><circle cx="10" cy="10" r="1.4"/><circle cx="15" cy="10" r="1.4"/></svg>,
  close: (s=20) => <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg>,
  bell: (s=20) => <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 14V9a5 5 0 0110 0v5M3.5 14.5h13M8.5 17a1.5 1.5 0 003 0"/></svg>,
  home: (s=20) => <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M3 9l7-5 7 5v7a1 1 0 01-1 1h-4v-5H8v5H4a1 1 0 01-1-1V9z"/></svg>,
  vault: (s=20) => <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="4" width="14" height="12" rx="1.5"/><path d="M3 8h14M7 4v4M13 4v4"/></svg>,
  stats: (s=20) => <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M4 16V8M10 16V4M16 16v-6"/></svg>,
  user: (s=20) => <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="10" cy="7" r="3"/><path d="M3.5 17c.8-3.3 3.4-5 6.5-5s5.7 1.7 6.5 5"/></svg>,
  paperclip: (s=16) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M13 7.5l-5.5 5.5a3 3 0 01-4.5-4L8.5 3.5a2 2 0 013 3L6 12"/></svg>,
  image: (s=16) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2" y="3" width="12" height="10" rx="1"/><circle cx="6" cy="7" r="1"/><path d="M2 11l3.5-3 3 3 2-1.5L14 12"/></svg>,
  doc: (s=16) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"><path d="M4 2h5l3 3v9H4z"/><path d="M9 2v3h3M6 9h4M6 11h4"/></svg>,
  sparkle: (s=16) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"><path d="M8 2l1.2 3.8L13 7l-3.8 1.2L8 12l-1.2-3.8L3 7l3.8-1.2L8 2z"/></svg>,
  lock: (s=14) => <svg width={s} height={s} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="6" width="8" height="6" rx="1"/><path d="M5 6V4a2 2 0 014 0v2"/></svg>,
};

Object.assign(window, { Phone, Ring, CatDot, Icon, LLStatusBar, LLNavBar });
