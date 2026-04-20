// LifeLoop sample data + helpers

const CATEGORIES = {
  home:    { label: 'Home',    dot: 'oklch(0.68 0.06 55)'  }, // clay
  health:  { label: 'Health',  dot: 'oklch(0.70 0.05 155)' }, // sage
  admin:   { label: 'Admin',   dot: 'oklch(0.55 0.04 260)' }, // slate
  finance: { label: 'Finance', dot: 'oklch(0.62 0.05 85)'  }, // ochre
};

// Today = April 19, 2026 (per system)
const TODAY = new Date(2026, 3, 19);

const daysBetween = (a, b) => Math.round((b - a) / 86400000);
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const fmtDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmtLong = (d) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

// cycle months -> days
const cycleDays = (months) => Math.round(months * 30.44);

const formatLastDoneDays = (d) => {
  if (d === 0) return 'Today';
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.round(d / 30)}mo`;
  return `${Math.round(d / 365)}yr ago`;
};


const mkTask = (id, name, category, cycleMonths, lastDoneOffset, opts = {}) => {
  const lastDone = addDays(TODAY, -lastDoneOffset);
  const nextDue = addDays(lastDone, cycleDays(cycleMonths));
  return {
    id, name, category, cycleMonths,
    lastDone, nextDue,
    daysUntil: daysBetween(TODAY, nextDue),
    note: opts.note || '',
    attachments: opts.attachments || [],
    hint: opts.hint || '',
  };
};

const SEED_TASKS = [
  mkTask('t1',  'Change HVAC filter',              'home',    3,  82, {
    note: 'Filter size: 20×25×1. Stored on top shelf of garage cabinet.',
    attachments: [{ kind: 'img', label: 'Filter label photo' }],
    hint: 'Set for Apr 28',
  }),
  mkTask('t2',  'Rotate car tires',                'home',    6,  168, {
    note: 'Local mechanic on 4th & Pine — walk-in Saturdays.',
    attachments: [{ kind: 'doc', label: 'Service record.pdf' }],
  }),
  mkTask('t3',  'Renew passport',                  'admin',   120, 3300, {
    note: 'Expires Feb 2027. Start 9 months out.',
    attachments: [
      { kind: 'img', label: 'Current photo.jpg' },
      { kind: 'doc', label: 'Photo requirements.pdf' },
    ],
    hint: 'Pre-nudge active',
  }),
  mkTask('t4',  'Dentist cleaning',                'health',  6,  172),
  mkTask('t5',  'Review health insurance',         'admin',   12, 350),
  mkTask('t6',  'Deep clean fridge',               'home',    4,  118),
  mkTask('t7',  'Professional carpet cleaning',    'home',    12, 340),
  mkTask('t8',  'Check credit report',             'finance', 4,  105),
  mkTask('t9',  'Retirement contribution review',  'finance', 6,  160),
  mkTask('t10', 'Eye exam',                        'health',  24, 690),
  mkTask('t11', 'Smoke detector batteries',        'home',    12, 300),
  mkTask('t12', 'Rebalance portfolio',             'finance', 3,  70),
];

const TEMPLATES = [
  {
    id: 'home',
    name: 'New Homeowner Pack',
    count: 14,
    blurb: 'Everything a first-time homeowner forgets — until it leaks.',
    items: ['HVAC filter', 'Gutter cleaning', 'Smoke detector test', 'Water heater flush', 'Dryer vent', 'Garbage disposal'],
  },
  {
    id: 'car',
    name: 'Car Maintenance Pack',
    count: 9,
    blurb: 'Oil, tires, tags, inspections — timed to your last service.',
    items: ['Oil change', 'Tire rotation', 'Registration', 'Inspection', 'Wiper blades'],
  },
  {
    id: 'health',
    name: 'Annual Health Checklist',
    count: 11,
    blurb: 'The appointments you mean to book and keep forgetting.',
    items: ['Physical', 'Dentist', 'Eye exam', 'Skin check', 'Bloodwork'],
  },
  {
    id: 'finance',
    name: 'Financial Hygiene',
    count: 8,
    blurb: 'Quiet tasks that compound — credit, taxes, beneficiaries.',
    items: ['Credit report', 'Tax docs', 'Beneficiary review', 'Subscription audit'],
  },
  {
    id: 'renter',
    name: 'Renter Essentials',
    count: 7,
    blurb: 'For apartments and rentals — renter-specific cycles.',
    items: ['Lease renewal review', 'Renters insurance', 'Air filter', 'Deep clean'],
  },
  {
    id: 'parent',
    name: 'New Parent Pack',
    count: 12,
    blurb: 'Pediatric visits, car seat checks, school deadlines.',
    items: ['Pediatrician', 'Car seat check', 'School forms', 'Immunizations'],
  },
];

if (typeof window !== 'undefined') {
  Object.assign(window, {
    CATEGORIES, TODAY, SEED_TASKS, TEMPLATES,
    daysBetween, addDays, fmtDate, fmtLong, cycleDays, formatLastDoneDays,
  });
}

if (typeof module !== 'undefined') {
  module.exports = {
    CATEGORIES, TODAY, SEED_TASKS, TEMPLATES,
    daysBetween, addDays, fmtDate, fmtLong, cycleDays, formatLastDoneDays,
  };
}
