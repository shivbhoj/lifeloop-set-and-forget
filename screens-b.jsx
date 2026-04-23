// LifeLoop — screens part 2: Detail, Add, Celebration, Notifications, Stats, Templates, Upgrade

const { Phone, Ring, CatDot, Icon, CATEGORIES, TODAY, fmtDate, fmtLong, cycleDays, daysBetween, addDays } = window;

// ─────────────────────────────────────────────────────────────
// TASK DETAIL
// ─────────────────────────────────────────────────────────────
function TaskLoopViz({ palette, task, progress, ringColor, due, isOverdue }) {
  return (
    <div style={{
      marginTop: 28, padding: '24px 16px', borderRadius: 16,
      background: palette.surface,
      display: 'flex', alignItems: 'center', gap: 20,
    }}>
      <Ring progress={progress} size={88} stroke={3}
        color={ringColor}
        track={palette.ink} trackOpacity={0.1}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: '"Instrument Serif", serif', fontSize: 22, color: palette.ink, lineHeight: 1,
          }}>{Math.abs(due)}</div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: palette.muted, letterSpacing: 1, marginTop: 2,
          }}>{isOverdue ? 'OVER' : 'DAYS'}</div>
        </div>
      </Ring>
      <div style={{ flex: 1, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: 11, color: palette.muted, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>NEXT DUE</div>
        <div style={{ fontSize: 17, color: palette.ink, marginTop: 2, fontWeight: 500 }}>{fmtLong(task.nextDue)}</div>
        <div style={{ height: 12 }}/>
        <div style={{ fontSize: 11, color: palette.muted, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>LAST DONE</div>
        <div style={{ fontSize: 13, color: palette.inkSoft, marginTop: 2 }}>{fmtLong(task.lastDone)}</div>
      </div>
    </div>
  );
}

function TaskAttachments({ palette, attachments }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <>
      <SectionLabel palette={palette}>ATTACHED · {attachments.length}</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {attachments.map((a, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', border: `1px solid ${palette.hair}`, borderRadius: 10,
            background: palette.bg,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: palette.surface, color: palette.inkSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundImage: a.kind === 'img' ? `repeating-linear-gradient(135deg, transparent 0, transparent 6px, ${palette.hair} 6px, ${palette.hair} 7px)` : 'none',
            }}>
              {a.kind === 'img' ? Icon.image(16) : Icon.doc(16)}
            </div>
            <div style={{ flex: 1, fontFamily: 'Inter, sans-serif', fontSize: 13, color: palette.ink }}>
              {a.label}
            </div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: palette.muted,
            }}>{a.kind.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function TaskNote({ palette, note }) {
  if (!note) return null;
  return (
    <>
      <SectionLabel palette={palette}>CONTEXT</SectionLabel>
      <div style={{
        fontFamily: '"Instrument Serif", serif', fontSize: 18, lineHeight: 1.5,
        color: palette.ink, letterSpacing: 0.1,
      }}>{note}</div>
    </>
  );
}

function TaskDetail({ palette, task, onBack, onComplete, launchMode = false }) {
  const totalCycle = cycleDays(task.cycleMonths);
  const daysInto = totalCycle - task.daysUntil;
  const progress = Math.min(1, Math.max(0, daysInto / totalCycle));
  const due = task.daysUntil;
  const isOverdue = due < 0;
  const isLaunchDay = due <= 0;

  let ringColor = palette.accentSage;
  if (isOverdue) {
    ringColor = 'oklch(0.55 0.12 30)';
  } else if (isLaunchDay) {
    ringColor = palette.accent;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: palette.bg }}>
      <div style={{ padding: '16px 12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: palette.ink, cursor: 'pointer',
          padding: 8, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Inter, sans-serif', fontSize: 13,
        }}>{Icon.chevL(18)} Back</button>
        <button style={{ background: 'none', border: 'none', color: palette.ink, cursor: 'pointer', padding: 8 }}>
          {Icon.dots(18)}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <CatDot cat={task.category} size={8}/>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: palette.muted,
            letterSpacing: 2,
          }}>{CATEGORIES[task.category].label.toUpperCase()} · EVERY {task.cycleMonths} {task.cycleMonths === 1 ? 'MONTH' : 'MONTHS'}</span>
        </div>

        <h1 style={{
          fontFamily: '"Instrument Serif", serif', fontWeight: 400, fontSize: 36,
          margin: 0, color: palette.ink, letterSpacing: -0.5, lineHeight: 1.05,
        }}>{task.name}</h1>

        {/* Loop visualization */}
        <TaskLoopViz
          palette={palette}
          task={task}
          progress={progress}
          ringColor={ringColor}
          due={due}
          isOverdue={isOverdue}
        />

        {/* Note */}
        <TaskNote palette={palette} note={task.note} />

        {/* Attachments */}
        <TaskAttachments palette={palette} attachments={task.attachments} />

        {/* Cycle history */}
        <SectionLabel palette={palette}>THE LOOP</SectionLabel>
        <CycleTimeline task={task} palette={palette}/>
      </div>

      {/* Action button */}
      <div style={{
        padding: '12px 20px 16px',
        borderTop: `1px solid ${palette.hairSoft}`,
        background: palette.bg,
      }}>
        <button onClick={onComplete} style={{
          width: '100%', padding: '16px',
          background: isLaunchDay ? palette.ink : 'transparent',
          color: isLaunchDay ? palette.bg : palette.ink,
          border: `1px solid ${palette.ink}`,
          borderRadius: 100, cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 500, letterSpacing: 0.2,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {isLaunchDay ? 'Do this now' : 'Done! Reset the clock'}
          {Icon.check(18)}
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children, palette }) {
  return (
    <div style={{
      marginTop: 28, marginBottom: 12,
      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2,
      color: palette.muted,
    }}>{children}</div>
  );
}

function CycleTimeline({ task, palette }) {
  // Render 4 prior cycles + current
  const cycles = [];
  for (let i = 3; i >= 0; i--) {
    const end = addDays(task.lastDone, -cycleDays(task.cycleMonths) * i);
    const start = addDays(end, -cycleDays(task.cycleMonths));
    cycles.push({ start, end, done: true });
  }
  cycles.push({ start: task.lastDone, end: task.nextDue, done: false });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {cycles.map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: c.done ? palette.inkSoft : 'transparent',
            border: `1.5px solid ${c.done ? palette.inkSoft : palette.ink}`,
          }}/>
          <div style={{ flex: 1, height: 1, background: c.done ? palette.hair : palette.hairSoft }}/>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.done ? palette.inkSoft : palette.ink,
            letterSpacing: 0.5, minWidth: 140, textAlign: 'right',
          }}>
            {fmtDate(c.start)} → {fmtDate(c.end)} {!c.done && '· upcoming'}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADD NEW TASK — multi-field form
// ─────────────────────────────────────────────────────────────

const CYCLES = [
  { m: 1, label: '1 mo' },
  { m: 3, label: '3 mo' },
  { m: 6, label: '6 mo' },
  { m: 12, label: '1 yr' },
  { m: 24, label: '2 yr' },
  { m: 60, label: '5 yr' },
];

const LAST_DONE_OPTIONS = [0, 7, 30, 90, 180, 365];

function formatLastDone(d) {
  if (d === 0) return 'Today';
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.round(d/30)}mo`;
  return `${Math.round(d/365)}yr ago`;
}

function AddScreen({ palette, onCancel, onSave }) {
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('home');
  const [cycle, setCycle] = React.useState(3);
  const [lastDone, setLastDone] = React.useState(30);
  const [note, setNote] = React.useState('');

  const nextDue = addDays(addDays(TODAY, -lastDone), cycleDays(cycle));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: palette.bg }}>
      <div style={{ padding: '16px 12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onCancel} style={{
          background: 'none', border: 'none', color: palette.ink, cursor: 'pointer',
          padding: 8, fontFamily: 'Inter, sans-serif', fontSize: 13,
        }}>Cancel</button>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, color: palette.muted,
        }}>NEW LOOP</div>
        <button onClick={() => onSave({ name, category, cycle, lastDone, note })} disabled={!name} style={{
          background: 'none', border: 'none',
          color: name ? palette.accent : palette.muted,
          cursor: name ? 'pointer' : 'default',
          padding: 8, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500,
        }}>Save</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
        {/* Name */}
        <Field label="The task" palette={palette}>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Change HVAC filter"
            style={{
              width: '100%', border: 'none', outline: 'none',
              fontFamily: '"Instrument Serif", serif', fontSize: 30,
              background: 'transparent', color: palette.ink, padding: '4px 0',
              borderBottom: `1px solid ${palette.hair}`, letterSpacing: -0.5,
            }}/>
        </Field>

        {/* Category */}
        <Field label="Category" palette={palette}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(CATEGORIES).map(([k, c]) => (
              <button key={k} onClick={() => setCategory(k)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 100,
                background: category === k ? palette.ink : 'transparent',
                color: category === k ? palette.bg : palette.ink,
                border: `1px solid ${category === k ? palette.ink : palette.hair}`,
                fontFamily: 'Inter, sans-serif', fontSize: 13, cursor: 'pointer',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', background: c.dot, display: 'inline-block',
                }}/>
                {c.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Cycle */}
        <Field label="Repeats every" palette={palette}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CYCLES.map(c => (
              <button key={c.m} onClick={() => setCycle(c.m)} style={{
                padding: '10px 14px', borderRadius: 10,
                background: cycle === c.m ? palette.ink : 'transparent',
                color: cycle === c.m ? palette.bg : palette.ink,
                border: `1px solid ${cycle === c.m ? palette.ink : palette.hair}`,
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12, cursor: 'pointer',
                letterSpacing: 0.5,
              }}>{c.label}</button>
            ))}
          </div>
        </Field>

        {/* Last done */}
        <Field label="Last done" palette={palette}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {LAST_DONE_OPTIONS.map(d => (
              <button key={d} onClick={() => setLastDone(d)} style={{
                padding: '10px 14px', borderRadius: 10,
                background: lastDone === d ? palette.ink : 'transparent',
                color: lastDone === d ? palette.bg : palette.ink,
                border: `1px solid ${lastDone === d ? palette.ink : palette.hair}`,
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12, cursor: 'pointer',
<<<<<<< HEAD
              }}>{formatLastDone(d)}</button>
=======
              }}>{formatLastDoneDays(d)}</button>
>>>>>>> 5c6fcfd (🧹 Extract last done days formatting to helper)
            ))}
          </div>
        </Field>

        {/* Note */}
        <Field label="Context (optional)" palette={palette}>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="e.g. Filter size 20×25×1. Stored in garage."
            rows={2}
            style={{
              width: '100%', border: `1px solid ${palette.hair}`, borderRadius: 10,
              padding: '10px 12px', fontFamily: 'Inter, sans-serif', fontSize: 14,
              background: palette.surface, color: palette.ink, outline: 'none', resize: 'none',
              boxSizing: 'border-box',
            }}/>
        </Field>

        {/* Attachment */}
        <Field label="Attach" palette={palette}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px', width: '100%', borderRadius: 12,
            border: `1px dashed ${palette.hair}`, background: 'transparent',
            color: palette.inkSoft, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: 13,
          }}>
            {Icon.paperclip(14)}
            <span>Photo, PDF, or note</span>
            <span style={{
              marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10, color: palette.muted, display: 'flex', alignItems: 'center', gap: 4,
            }}>{Icon.lock(11)} 2 / 3 FREE</span>
          </button>
        </Field>

        {/* Preview */}
        <div style={{
          marginTop: 24, padding: '14px 16px', borderRadius: 12,
          background: palette.surface, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 18, color: palette.inkSoft, fontStyle: 'italic' }}>
            Next loop closes
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 22, color: palette.ink, lineHeight: 1 }}>
              {fmtDate(nextDue)}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: palette.muted, marginTop: 2 }}>
              PRE-NUDGE · {fmtDate(addDays(nextDue, -14))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, palette }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2,
        color: palette.muted, marginBottom: 10,
      }}>{label.toUpperCase()}</div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPLETION CELEBRATION
// ─────────────────────────────────────────────────────────────
function Celebration({ palette, task, style = 'ring', onContinue }) {
  const [phase, setPhase] = React.useState(0);
  React.useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const nextDue = addDays(TODAY, cycleDays(task.cycleMonths));

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: palette.bg, padding: '48px 32px 32px',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    }}>
      {/* Visual */}
      <div style={{ position: 'relative', width: 160, height: 160, marginBottom: 36 }}>
        {style === 'confetti' && phase >= 1 && <ConfettiBits palette={palette}/>}
        <Ring
          progress={phase >= 1 ? 1 : 0} size={160} stroke={1.5}
          color={palette.accentSage} track={palette.ink} trackOpacity={0.08}>
          <div style={{
            opacity: phase >= 1 ? 1 : 0, transition: 'all 0.6s 0.3s',
            transform: phase >= 1 ? 'scale(1)' : 'scale(0.7)',
          }}>
            <div style={{ color: palette.accentSage }}>{Icon.check(44)}</div>
          </div>
        </Ring>
      </div>

      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 2,
        color: palette.muted, marginBottom: 14,
        opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.5s 0.4s',
      }}>CLOCK RESET · {task.name.toUpperCase()}</div>

      <h1 style={{
        fontFamily: '"Instrument Serif", serif', fontWeight: 400, fontSize: 40,
        margin: 0, color: palette.ink, letterSpacing: -0.8, lineHeight: 1.05,
        opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.6s 0.5s',
      }}>
        {style === 'confetti' ? 'One less thing.' :
         style === 'quiet' ? 'Done.' :
         'The loop closes.'}
      </h1>

      <p style={{
        marginTop: 16, fontSize: 15, lineHeight: 1.6, color: palette.inkSoft,
        fontFamily: 'Inter, sans-serif', maxWidth: 280,
        opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.6s 0.8s',
      }}>
        Next time you're free: <span style={{
          color: palette.ink, fontFamily: '"Instrument Serif", serif', fontSize: 18,
        }}>{fmtLong(nextDue)}</span>. We'll nudge you two weeks before.
      </p>

      <div style={{
        marginTop: 40,
        opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.6s',
      }}>
        <button onClick={onContinue} style={{
          background: palette.ink, color: palette.bg, border: 'none',
          padding: '14px 28px', borderRadius: 100, cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500,
        }}>Back to quiet</button>
      </div>
    </div>
  );
}

function ConfettiBits({ palette }) {
  const bits = Array.from({ length: 14 }, (_, i) => {
    const ang = (i / 14) * Math.PI * 2;
    const dist = 70 + (i % 3) * 20;
    const x = Math.cos(ang) * dist;
    const y = Math.sin(ang) * dist;
    const colors = [palette.accent, palette.accentSage, palette.ink];
    return { x, y, c: colors[i % 3], d: i * 30 };
  });
  return (
    <>
      {bits.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 4, height: 4, borderRadius: 1,
          background: b.c,
          transform: `translate(${b.x}px, ${b.y}px)`,
          opacity: 0, animation: `confetti 1.2s ${b.d}ms ease-out forwards`,
        }}/>
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translate(0,0) scale(0); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translate(var(--x,0), var(--y,0)) scale(1); opacity: 0; }
        }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// NOTIFICATION STATES
// ─────────────────────────────────────────────────────────────
function NotificationOverlay({ palette, task, variant, onDismiss, onOpen }) {
  // variant: 'prenudge' or 'launch'
  const isLaunch = variant === 'launch';
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(25, 20, 15, 0.55)',
      backdropFilter: 'blur(3px)',
      display: 'flex', flexDirection: 'column',
      padding: '48px 12px 12px',
    }}>
      <div style={{
        background: palette.bg, borderRadius: 20, padding: '16px 18px',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
        animation: 'slideIn 0.4s ease-out',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: palette.ink, color: palette.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 10, height: 10, border: `1.5px solid ${palette.bg}`, borderRadius: '50%', borderRightColor: 'transparent' }}/>
          </div>
          <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: 12, color: palette.inkSoft, fontWeight: 500,
          }}>LifeLoop</span>
          <span style={{
            marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10, color: palette.muted,
          }}>now</span>
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500,
          color: palette.ink, marginBottom: 4,
        }}>
          {isLaunch ? `Launch day: ${task.name}` : `Heads up — ${task.name}`}
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 13, color: palette.inkSoft, lineHeight: 1.4,
        }}>
          {isLaunch
            ? `Today's the day. One button. Takes a few minutes.`
            : `Due ${fmtDate(task.nextDue)} — two weeks from today. Prepare for launch.`}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={onDismiss} style={{
            flex: 1, padding: '8px', borderRadius: 100,
            background: 'transparent', border: `1px solid ${palette.hair}`,
            color: palette.ink, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: 12,
          }}>Later</button>
          <button onClick={onOpen} style={{
            flex: 1, padding: '8px', borderRadius: 100,
            background: palette.ink, border: 'none',
            color: palette.bg, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
          }}>{isLaunch ? 'Do this now' : 'Open'}</button>
        </div>
      </div>

      {/* Lock screen backdrop w/ time */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 20 }}>
        <div style={{
          fontFamily: '"Instrument Serif", serif', fontSize: 72, color: 'rgba(255,255,255,0.9)',
          letterSpacing: -2, lineHeight: 1,
        }}>9:41</div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.75)',
          marginTop: 4, letterSpacing: 0.3,
        }}>{fmtLong(TODAY)}</div>
      </div>

      <style>{`@keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────
function StatsScreen({ palette, tasks, completedCount, peacefulDays }) {
  // distribution for viz
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const completedByMonth = [2, 3, 1, 2, 4, 2, 3, 5, 3, 4, 2, 3];

  const catCount = {};
  Object.keys(CATEGORIES).forEach(k => { catCount[k] = 0; });
  tasks.forEach(t => {
    if (t.category in catCount) catCount[t.category]++;
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: palette.bg, overflowY: 'auto' }}>
      <div style={{ padding: '20px 20px 8px' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2,
          color: palette.muted, marginBottom: 4,
        }}>YOUR LOOPS · 2026</div>
        <h1 style={{
          fontFamily: '"Instrument Serif", serif', fontWeight: 400, fontSize: 32,
          margin: 0, color: palette.ink, letterSpacing: -0.5,
        }}>A quieter year.</h1>
      </div>

      {/* Two big numbers */}
      <div style={{ padding: '20px', display: 'flex', gap: 10 }}>
        <BigStat palette={palette} value={completedCount} label="Tasks completed" sub="+4 vs. last year" accent={palette.accentSage}/>
        <BigStat palette={palette} value={peacefulDays} label="Days of peace" sub="Longest streak yet" accent={palette.accent}/>
      </div>

      {/* Completion chart */}
      <div style={{ padding: '12px 20px' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2,
          color: palette.muted, marginBottom: 14,
        }}>COMPLETIONS BY MONTH</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
          {completedByMonth.map((v, i) => {
            const max = Math.max(...completedByMonth);
            const h = (v / max) * 100;
            const isCurrent = i === 3; // April
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', height: `${h}%`,
                  background: isCurrent ? palette.ink : palette.inkSoft,
                  opacity: isCurrent ? 1 : 0.35,
                  borderRadius: 2,
                }}/>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
                  color: isCurrent ? palette.ink : palette.muted,
                  letterSpacing: 0.5,
                }}>{months[i][0]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category breakdown */}
      <div style={{ padding: '20px' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2,
          color: palette.muted, marginBottom: 14,
        }}>LOAD BY CATEGORY</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(CATEGORIES).map(([k, c]) => {
            const total = tasks.length;
            const pct = (catCount[k] / total) * 100;
            return (
              <div key={k}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <CatDot cat={k}/>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: palette.ink }}>{c.label}</span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: palette.muted }}>
                    {catCount[k]} · {Math.round(pct)}%
                  </span>
                </div>
                <div style={{ height: 4, background: palette.hairSoft, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: c.dot }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pull quote */}
      <div style={{ padding: '0 20px 100px' }}>
        <div style={{
          padding: '24px 20px', borderRadius: 16,
          background: palette.surface, textAlign: 'center',
        }}>
          <div style={{
            fontFamily: '"Instrument Serif", serif', fontSize: 22, color: palette.ink,
            lineHeight: 1.3, letterSpacing: -0.2, fontStyle: 'italic',
          }}>"Maintenance, compounded,<br/>is peace."</div>
          <div style={{
            marginTop: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            color: palette.muted, letterSpacing: 1,
          }}>— THE LIFELOOP PROMISE</div>
        </div>
      </div>
    </div>
  );
}

function BigStat({ palette, value, label, sub, accent }) {
  return (
    <div style={{
      flex: 1, padding: '18px 16px', borderRadius: 14,
      border: `1px solid ${palette.hair}`,
    }}>
      <div style={{
        fontFamily: '"Instrument Serif", serif', fontSize: 56, lineHeight: 1,
        color: palette.ink, letterSpacing: -2,
      }}>{value}</div>
      <div style={{
        marginTop: 8, fontFamily: 'Inter, sans-serif', fontSize: 12,
        color: palette.ink, fontWeight: 500,
      }}>{label}</div>
      <div style={{
        marginTop: 2, fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        color: accent, letterSpacing: 0.5,
      }}>{sub.toUpperCase()}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TEMPLATES (Premium)
// ─────────────────────────────────────────────────────────────
function TemplatesScreen({ palette, onBack, onUpgrade, TEMPLATES }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: palette.bg }}>
      <div style={{ padding: '16px 12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: palette.ink, cursor: 'pointer',
          padding: 8, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Inter, sans-serif', fontSize: 13,
        }}>{Icon.chevL(18)} Back</button>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2, color: palette.muted,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>{Icon.lock(11)} PREMIUM</div>
        <div style={{ width: 60 }}/>
      </div>

      <div style={{ padding: '4px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: palette.accent }}>
          {Icon.sparkle(14)}
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2 }}>TEMPLATE LIBRARY</span>
        </div>
        <h1 style={{
          fontFamily: '"Instrument Serif", serif', fontWeight: 400, fontSize: 30,
          margin: 0, color: palette.ink, letterSpacing: -0.5, lineHeight: 1.05,
        }}>Start with<br/>a thoughtful pack.</h1>
        <p style={{
          marginTop: 12, fontSize: 13, color: palette.inkSoft, lineHeight: 1.5,
          fontFamily: 'Inter, sans-serif',
        }}>Curated bundles of cycles, each with sensible defaults. Add the whole pack or pick what fits.</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        {TEMPLATES.map((t, i) => (
          <div key={t.id} style={{
            padding: '18px', borderRadius: 14,
            border: `1px solid ${palette.hair}`, marginBottom: 10,
            background: i === 0 ? palette.surface : palette.bg,
            position: 'relative',
          }}>
            {i > 1 && (
              <div style={{
                position: 'absolute', top: 14, right: 14,
                color: palette.muted, display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: 0.5,
              }}>{Icon.lock(10)} LOCKED</div>
            )}
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              color: palette.muted, letterSpacing: 1.5, marginBottom: 6,
            }}>{t.count} CYCLES</div>
            <div style={{
              fontFamily: '"Instrument Serif", serif', fontSize: 22,
              color: palette.ink, letterSpacing: -0.3, lineHeight: 1.1,
            }}>{t.name}</div>
            <div style={{
              marginTop: 8, fontSize: 13, color: palette.inkSoft, lineHeight: 1.4,
              fontFamily: 'Inter, sans-serif',
            }}>{t.blurb}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {t.items.slice(0, 4).map((it, j) => (
                <span key={j} style={{
                  padding: '3px 8px', borderRadius: 100,
                  background: palette.bg, border: `1px solid ${palette.hairSoft}`,
                  fontFamily: 'Inter, sans-serif', fontSize: 11, color: palette.inkSoft,
                }}>{it}</span>
              ))}
              {t.items.length > 4 && (
                <span style={{
                  padding: '3px 8px', fontSize: 11, color: palette.muted,
                  fontFamily: 'JetBrains Mono, monospace',
                }}>+{t.items.length - 4}</span>
              )}
            </div>
            {i <= 1 && (
              <button onClick={onUpgrade} style={{
                marginTop: 14, width: '100%', padding: '10px',
                background: i === 0 ? palette.ink : 'transparent',
                color: i === 0 ? palette.bg : palette.ink,
                border: `1px solid ${palette.ink}`, borderRadius: 100, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
              }}>Preview pack</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// UPGRADE SCREEN
// ─────────────────────────────────────────────────────────────
function UpgradeScreen({ palette, onClose }) {
  const [plan, setPlan] = React.useState('year');
  const features = [
    { title: 'Unlimited attachments', sub: 'Warranty PDFs, filter photos, insurance cards — all at hand.' },
    { title: 'The template library', sub: '6 curated packs. Homeowner, car, health, finance, renter, parent.' },
    { title: 'Collaborator access', sub: 'Share a vault with one partner or family member.' },
    { title: 'Custom nudge tones', sub: 'Calm, cheerful, or firm. Match the voice you need.' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: palette.bg }}>
      <div style={{ padding: '16px 12px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: 40 }}/>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2,
          color: palette.muted, paddingTop: 6,
        }}>UPGRADE</div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: palette.ink, cursor: 'pointer', padding: 8,
        }}>{Icon.close(18)}</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 28px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: palette.accent, marginBottom: 10 }}>
          {Icon.sparkle(14)}
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2 }}>LIFELOOP PREMIUM</span>
        </div>
        <h1 style={{
          fontFamily: '"Instrument Serif", serif', fontWeight: 400, fontSize: 40,
          margin: 0, color: palette.ink, letterSpacing: -1, lineHeight: 1.02,
        }}>Less in the<br/>back of your mind.</h1>
        <p style={{
          marginTop: 14, fontSize: 14, color: palette.inkSoft, lineHeight: 1.5,
          fontFamily: 'Inter, sans-serif',
        }}>Lock the admin chaos behind one calm subscription. Cancel anytime.</p>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: `1px solid ${palette.ink}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: palette.ink, flexShrink: 0, marginTop: 2,
              }}>{Icon.check(12)}</div>
              <div>
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 14, color: palette.ink, fontWeight: 500,
                }}>{f.title}</div>
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 13, color: palette.inkSoft, lineHeight: 1.4, marginTop: 2,
                }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PlanCard selected={plan === 'year'} onClick={() => setPlan('year')} palette={palette}
            title="Yearly" price="$39.99" sub="$3.33/mo · save 16%" badge="BEST VALUE"/>
          <PlanCard selected={plan === 'month'} onClick={() => setPlan('month')} palette={palette}
            title="Monthly" price="$3.99" sub="billed monthly"/>
        </div>
      </div>

      <div style={{
        padding: '12px 20px 16px', borderTop: `1px solid ${palette.hairSoft}`,
      }}>
        <button style={{
          width: '100%', padding: '16px',
          background: palette.ink, color: palette.bg,
          border: 'none', borderRadius: 100, cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 500,
        }}>Start 14-day trial</button>
        <div style={{
          marginTop: 10, textAlign: 'center',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 0.5,
          color: palette.muted,
        }}>NO CHARGE UNTIL MAY 3 · CANCEL ANY TIME</div>
      </div>
    </div>
  );
}

function PlanCard({ selected, onClick, palette, title, price, sub, badge }) {
  return (
    <button onClick={onClick} style={{
      padding: '16px 18px', borderRadius: 14,
      background: selected ? palette.surface : palette.bg,
      border: `1.5px solid ${selected ? palette.ink : palette.hair}`,
      display: 'flex', alignItems: 'center', gap: 14, width: '100%',
      cursor: 'pointer', textAlign: 'left',
      position: 'relative',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        border: `1.5px solid ${selected ? palette.ink : palette.hair}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: palette.ink }}/>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, color: palette.ink }}>{title}</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: palette.muted, marginTop: 2 }}>{sub.toUpperCase()}</div>
      </div>
      <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 22, color: palette.ink, letterSpacing: -0.3 }}>{price}</div>
      {badge && (
        <div style={{
          position: 'absolute', top: -8, right: 16,
          padding: '2px 8px', background: palette.accent, color: palette.bg,
          borderRadius: 100, fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: 1,
        }}>{badge}</div>
      )}
    </button>
  );
}

Object.assign(window, { TaskDetail, AddScreen, Celebration, NotificationOverlay, StatsScreen, TemplatesScreen, UpgradeScreen });
