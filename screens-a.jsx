// LifeLoop — screens part 1: Onboarding, Home, Vault

const { Phone, Ring, CatDot, Icon, CATEGORIES, TODAY, fmtDate, fmtLong, cycleDays, daysBetween, addDays } = window;

// ─────────────────────────────────────────────────────────────
// Shared bottom nav
// ─────────────────────────────────────────────────────────────
function BottomNav({ tab, setTab, palette }) {
  const items = [
    { id: 'home',  label: 'Today',   icon: Icon.home },
    { id: 'vault', label: 'Vault',   icon: Icon.vault },
    { id: 'stats', label: 'Stats',   icon: Icon.stats },
    { id: 'me',    label: 'Account', icon: Icon.user },
  ];
  return (
    <div style={{
      display: 'flex', borderTop: `1px solid ${palette.hair}`,
      background: palette.bg, padding: '10px 8px 6px',
      flexShrink: 0,
    }}>
      {items.map(it => (
        <button key={it.id} onClick={() => setTab(it.id)} style={{
          flex: 1, background: 'none', border: 'none', padding: '6px 0',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          color: tab === it.id ? palette.ink : palette.muted,
          fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: 0.3,
          cursor: 'pointer',
        }}>
          {it.icon(18)}
          <span>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Task row — used on Home and in Vault
// ─────────────────────────────────────────────────────────────
function TaskRow({ task, onClick, palette, showCategory = true, dense = false }) {
  const totalCycle = cycleDays(task.cycleMonths);
  const daysInto = totalCycle - task.daysUntil;
  const progress = Math.min(1, Math.max(0, daysInto / totalCycle));
  const due = task.daysUntil;
  const isOverdue = due < 0;
  const isSoon = due >= 0 && due <= 14;

  let dueLabel;
  if (isOverdue) dueLabel = `${Math.abs(due)}d overdue`;
  else if (due === 0) dueLabel = 'Due today';
  else if (due === 1) dueLabel = 'Tomorrow';
  else if (due <= 14) dueLabel = `In ${due} days`;
  else dueLabel = fmtDate(task.nextDue);

  const ringColor = isOverdue ? 'oklch(0.55 0.12 30)' : (isSoon ? CATEGORIES[task.category].dot : palette.inkSoft);

  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: dense ? '10px 20px' : '14px 20px', width: '100%',
      background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer',
      borderBottom: `1px solid ${palette.hairSoft}`,
      fontFamily: 'Inter, sans-serif',
    }}>
      <Ring progress={progress} size={32} stroke={1.5} color={ringColor} track={palette.ink} trackOpacity={0.08}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, color: palette.ink, fontWeight: 400,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          letterSpacing: -0.1,
        }}>{task.name}</div>
        {showCategory && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <CatDot cat={task.category}/>
            <span style={{
              fontSize: 11, color: palette.muted,
              fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.3,
            }}>{CATEGORIES[task.category].label.toUpperCase()}</span>
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontSize: 12, color: isOverdue ? 'oklch(0.55 0.12 30)' : palette.ink,
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: -0.2,
        }}>{dueLabel}</div>
        {task.attachments?.length > 0 && (
          <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end', marginTop: 4, color: palette.muted }}>
            {Icon.paperclip(11)}
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>{task.attachments.length}</span>
          </div>
        )}
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────────────────────
function OnboardingScreen({ palette, onStart }) {
  const [step, setStep] = React.useState(0);
  const steps = [
    {
      eyebrow: '01',
      title: 'Not another\nto-do app.',
      body: 'LifeLoop holds the quiet, cyclical tasks that keep a life running — so they stop living rent-free in your head.',
    },
    {
      eyebrow: '02',
      title: 'Set once.\nForget with confidence.',
      body: 'Tell us when you last changed the filter, rotated the tires, saw the dentist. We track the loop from there.',
    },
    {
      eyebrow: '03',
      title: 'A nudge —\nnever a nag.',
      body: 'A soft pre-nudge two weeks out. One button on the day of. Nothing in between.',
    },
  ];
  const s = steps[step];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '48px 32px 32px', background: palette.bg }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 2,
        color: palette.muted,
      }}>LIFELOOP · {s.eyebrow} / 03</div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ marginBottom: 36, display: 'flex', justifyContent: 'flex-start' }}>
          <Ring progress={(step + 1) / 3} size={56} stroke={1.5} color={palette.accent} track={palette.ink} trackOpacity={0.1}>
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: palette.muted }}>{step + 1}/3</span>
          </Ring>
        </div>
        <h1 style={{
          fontFamily: '"Instrument Serif", serif', fontWeight: 400,
          fontSize: 44, lineHeight: 1.02, color: palette.ink, margin: 0,
          letterSpacing: -1, whiteSpace: 'pre-line',
        }}>{s.title}</h1>
        <p style={{
          marginTop: 20, fontSize: 15, lineHeight: 1.5, color: palette.inkSoft,
          fontFamily: 'Inter, sans-serif', maxWidth: 300,
        }}>{s.body}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 6, height: 6, borderRadius: 3,
              background: i === step ? palette.ink : palette.hair,
              transition: 'all 0.3s',
            }}/>
          ))}
        </div>
        <button
          onClick={() => step < 2 ? setStep(step + 1) : onStart()}
          style={{
            background: palette.ink, color: palette.bg, border: 'none',
            padding: '14px 22px', borderRadius: 100, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500,
            letterSpacing: 0.2, display: 'flex', alignItems: 'center', gap: 8,
          }}>
          {step < 2 ? 'Continue' : 'Begin'} {Icon.chevR(16)}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME / Upcoming
// ─────────────────────────────────────────────────────────────
function HomeScreen({ palette, tasks, onOpenTask, onAdd, peacefulDays, setTab }) {
  const soon = tasks.filter(t => t.daysUntil <= 14).sort((a, b) => a.daysUntil - b.daysUntil);
  const later = tasks.filter(t => t.daysUntil > 14 && t.daysUntil <= 60).sort((a, b) => a.daysUntil - b.daysUntil);
  const resting = tasks.filter(t => t.daysUntil > 60).sort((a, b) => a.daysUntil - b.daysUntil);

  const today = soon.filter(t => t.daysUntil <= 0);
  const thisWeek = soon.filter(t => t.daysUntil > 0);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: palette.bg }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2,
              color: palette.muted, marginBottom: 4,
            }}>{fmtLong(TODAY).toUpperCase()}</div>
            <h1 style={{
              fontFamily: '"Instrument Serif", serif', fontWeight: 400, fontSize: 32,
              margin: 0, color: palette.ink, letterSpacing: -0.5, lineHeight: 1,
            }}>Quiet today.</h1>
          </div>
          <button style={{
            width: 36, height: 36, borderRadius: '50%', border: `1px solid ${palette.hair}`,
            background: 'none', color: palette.ink, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>{Icon.bell(16)}</button>
        </div>

        {/* Peace strip */}
        <div style={{
          marginTop: 20, padding: '14px 16px', borderRadius: 14,
          background: palette.surface,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <Ring progress={0.74} size={40} stroke={2} color={palette.accentSage} track={palette.ink} trackOpacity={0.1}/>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: 13, color: palette.ink, fontWeight: 500,
            }}>{peacefulDays} days of peace</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: palette.muted, marginTop: 2,
            }}>NOTHING OVERDUE · NOTHING URGENT</div>
          </div>
          <button onClick={() => setTab('stats')} style={{
            background: 'none', border: 'none', color: palette.muted, cursor: 'pointer',
          }}>{Icon.chevR(18)}</button>
        </div>
      </div>

      {/* Lists */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Section title="In the pre-nudge window" count={thisWeek.length} palette={palette}>
          {today.length === 0 && thisWeek.length === 0 ? (
            <Empty palette={palette} text="No tasks due soon. Enjoy the quiet."/>
          ) : (
            [...today, ...thisWeek].map(t => (
              <TaskRow key={t.id} task={t} onClick={() => onOpenTask(t.id)} palette={palette}/>
            ))
          )}
        </Section>

        {later.length > 0 && (
          <Section title="On the horizon" count={later.length} palette={palette} muted>
            {later.map(t => (
              <TaskRow key={t.id} task={t} onClick={() => onOpenTask(t.id)} palette={palette}/>
            ))}
          </Section>
        )}

        <Section title="Resting" count={resting.length} palette={palette} muted>
          <div style={{
            padding: '12px 20px 24px', fontSize: 12,
            fontFamily: 'JetBrains Mono, monospace', color: palette.muted, letterSpacing: 0.3, lineHeight: 1.7,
          }}>
            {resting.length} tasks tucked away. Next to surface: <span style={{ color: palette.ink }}>
              {resting[0]?.name}
            </span> on {fmtDate(resting[0]?.nextDue)}.
          </div>
        </Section>
      </div>

      {/* FAB */}
      <button onClick={onAdd} style={{
        position: 'absolute', bottom: 88, right: 20,
        width: 56, height: 56, borderRadius: '50%',
        background: palette.ink, color: palette.bg,
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px -6px rgba(40,30,20,0.35)',
      }}>{Icon.plus(22)}</button>
    </div>
  );
}

function Section({ title, count, children, palette, muted = false }) {
  return (
    <div>
      <div style={{
        padding: '18px 20px 8px', display: 'flex', alignItems: 'baseline', gap: 10,
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2,
          color: muted ? palette.muted : palette.inkSoft,
        }}>{title.toUpperCase()}</div>
        <div style={{ flex: 1, height: 1, background: palette.hairSoft }}/>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          color: palette.muted,
        }}>{count}</div>
      </div>
      {children}
    </div>
  );
}

function Empty({ palette, text }) {
  return (
    <div style={{
      padding: '20px', fontFamily: '"Instrument Serif", serif', fontSize: 18,
      color: palette.inkSoft, fontStyle: 'italic', letterSpacing: 0.2,
    }}>{text}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// VAULT
// ─────────────────────────────────────────────────────────────
function VaultScreen({ palette, tasks, onOpenTask, onAdd }) {
  const [filter, setFilter] = React.useState('all');

  const grouped = React.useMemo(() => {
    const byCat = {};
    if (filter !== 'all') {
      byCat[filter] = [];
      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        if (t.category === filter) byCat[filter].push(t);
      }
      return byCat;
    }

    Object.keys(CATEGORIES).forEach(k => { byCat[k] = []; });
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (t.category in byCat) byCat[t.category].push(t);
    }
    return byCat;
  }, [tasks, filter]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: palette.bg }}>
      <div style={{ padding: '20px 20px 8px' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2,
          color: palette.muted, marginBottom: 4,
        }}>THE VAULT · {tasks.length} TASKS</div>
        <h1 style={{
          fontFamily: '"Instrument Serif", serif', fontWeight: 400, fontSize: 32,
          margin: 0, color: palette.ink, letterSpacing: -0.5,
        }}>Everything in motion.</h1>
      </div>

      {/* Filter chips */}
      <div style={{
        display: 'flex', gap: 6, padding: '12px 20px', overflowX: 'auto',
        borderBottom: `1px solid ${palette.hairSoft}`,
      }}>
        <Chip active={filter === 'all'} onClick={() => setFilter('all')} palette={palette}>
          All <span style={{ opacity: 0.5, marginLeft: 4 }}>{tasks.length}</span>
        </Chip>
        {Object.entries(CATEGORIES).map(([k, c]) => (
          <Chip key={k} active={filter === k} onClick={() => setFilter(k)} palette={palette}>
            <CatDot cat={k}/>
            <span style={{ marginLeft: 6 }}>{c.label}</span>
            <span style={{ opacity: 0.5, marginLeft: 4 }}>{byCat[k].length}</span>
          </Chip>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {Object.entries(grouped).map(([k, list]) => list.length === 0 ? null : (
          <div key={k}>
            <div style={{
              padding: '16px 20px 6px', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <CatDot cat={k}/>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: 13, color: palette.ink, fontWeight: 500,
              }}>{CATEGORIES[k].label}</span>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: palette.muted,
                marginLeft: 'auto',
              }}>{list.length} · AVG {Math.round(list.reduce((a,b) => a + b.cycleMonths, 0) / list.length)}MO</span>
            </div>
            {list.sort((a,b) => a.daysUntil - b.daysUntil).map(t => (
              <TaskRow key={t.id} task={t} onClick={() => onOpenTask(t.id)} palette={palette} showCategory={false}/>
            ))}
          </div>
        ))}

        <div style={{ height: 80 }}/>
      </div>

      <button onClick={onAdd} style={{
        position: 'absolute', bottom: 88, right: 20,
        width: 56, height: 56, borderRadius: '50%',
        background: palette.ink, color: palette.bg,
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px -6px rgba(40,30,20,0.35)',
      }}>{Icon.plus(22)}</button>
    </div>
  );
}

function Chip({ active, onClick, children, palette }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '6px 12px', borderRadius: 100, flexShrink: 0,
      background: active ? palette.ink : 'transparent',
      color: active ? palette.bg : palette.ink,
      border: `1px solid ${active ? palette.ink : palette.hair}`,
      fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
      cursor: 'pointer', letterSpacing: 0.1,
    }}>{children}</button>
  );
}

Object.assign(window, { HomeScreen, VaultScreen, OnboardingScreen, BottomNav, TaskRow });
