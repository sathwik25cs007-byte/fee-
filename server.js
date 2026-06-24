const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// ── Data directory ────────────────────────────────────────────────────────────
function resolveDataDir() {
  const candidates = ['/var/data', '/tmp', path.join(__dirname, 'data')];
  for (const dir of candidates) {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const t = path.join(dir, '.write_test');
      fs.writeFileSync(t, 'ok'); fs.unlinkSync(t);
      console.log(`✅ Using data directory: ${dir}`);
      return dir;
    } catch (e) { console.warn(`⚠️  Cannot use ${dir}: ${e.message}`); }
  }
  throw new Error('No writable directory found');
}
const DATA_DIR = resolveDataDir();
const DB_PATH  = path.join(DATA_DIR, 'fee_checklist.json');

// ── Master student list (65 students, official PDF) ───────────────────────────
const STUDENTS_MASTER = [
  [1,'25007-CS-001','MANDLA SAIKRISHNA'],
  [2,'25007-CS-002','KARNE KEERTHANA'],
  [3,'25007-CS-003','GOSULA SUJATHA'],
  [4,'25007-CS-004','SABAVATH MEERABAI'],
  [5,'25007-CS-005','PIKILI SRAVANI'],
  [6,'25007-CS-006','UPPARI SRINATH'],
  [7,'25007-CS-007','YELUKA SATHWIK KUMAR'],
  [8,'25007-CS-008','B VAISHALI'],
  [9,'25007-CS-009','PASHIGANTI JASHWANTH'],
  [10,'25007-CS-010','KOMARI BRUHATHI'],
  [11,'25007-CS-011','AMGADDA SUHANI'],
  [12,'25007-CS-012','MANDADI DEEKSHITHA'],
  [13,'25007-CS-014','MADIHA FIRDOSE'],
  [14,'25007-CS-015','GATTU VARSHINI'],
  [15,'25007-CS-016','THASLEEM BEGUM'],
  [16,'25007-CS-017','MUNTHA BHUVANESHWARI'],
  [17,'25007-CS-018','MIDDE SURYA'],
  [18,'25007-CS-019','TALARY DEENANAATH'],
  [19,'25007-CS-020','NARAYANADAS LOUKYA'],
  [20,'25007-CS-021','MANDA MANI KUMARI'],
  [21,'25007-CS-022','PATHARLA ANJANEYULU'],
  [22,'25007-CS-023','KONDURU NEHA'],
  [23,'25007-CS-024','ARRA SAHASRA'],
  [24,'25007-CS-025','LAVANYA'],
  [25,'25007-CS-026','DHYASANI VINAY REDDY'],
  [26,'25007-CS-027','KOTLA RAKESH'],
  [27,'25007-CS-028','SUGURU SANDEEP'],
  [28,'25007-CS-029','MUDDANI BHANU PRASAD'],
  [29,'25007-CS-030','ABDUL AZIZ'],
  [30,'25007-CS-031','THUMMOJU BHANUPRASAD'],
  [31,'25007-CS-032','CHINTHAKUNTA VISHWA TEJA'],
  [32,'25007-CS-033','KETHAVATH RAHUL'],
  [33,'25007-CS-034','LELLA VENKATA SRAVAN KUMAR'],
  [34,'25007-CS-035','THARNIKANTI GOWTHAM'],
  [35,'25007-CS-036','DURGAM VIGNESH'],
  [36,'25007-CS-037','MUZAMMIL AHMED KHAN'],
  [37,'25007-CS-038','V SHIVA CHARAN'],
  [38,'25007-CS-039','MOHAMMAD AFROZ'],
  [39,'25007-CS-040','PERI PRANAVI'],
  [40,'25007-CS-041','MUTHYALA CHIRAN KUMAR'],
  [41,'25007-CS-042','JAMPULA PRANAVI'],
  [42,'25007-CS-043','VANAPARTHY SAIKUMAR'],
  [43,'25007-CS-044','ERITAM SAI CHARAN'],
  [44,'25007-CS-045','VANKUDOTHU AKHIL'],
  [45,'25007-CS-046','GOLLA VARSHITHA'],
  [46,'25007-CS-047','GUL AFSHA'],
  [47,'25007-CS-048','KOMMU MARTIN'],
  [48,'25007-CS-049','B BHANU PRASAD'],
  [49,'25007-CS-050','TOKALI MAHESH'],
  [50,'25007-CS-051','S KARTHIK'],
  [51,'25007-CS-052','MALLOJU LAXMINARAYANA'],
  [52,'25007-CS-053','NAREDLA RAMCHARAN'],
  [53,'25007-CS-054','UPPARI VAMSHI'],
  [54,'25007-CS-055','GURLE VIGNESH'],
  [55,'25007-CS-056','PENDRAM JAGADISH'],
  [56,'25007-CS-057','CHINNAPOGULA SUNNY'],
  [57,'25007-CS-058','K AKHIL'],
  [58,'25007-CS-059','J KUMAR'],
  [59,'25007-CS-060','MEKALA SAI KUMAR'],
  [60,'25007-CS-061','G ROHITH KUMAR'],
  [61,'25007-CS-062','L SRIKANTH REDDY'],
  [62,'25007-CS-063','ERRAM RAM CHARAN'],
  [63,'25007-CS-064','NARAYANADAS SRICHARAN'],
  [64,'25007-CS-065','L AJAY'],
  [65,'25007-CS-066','NALLAVALA AJAY'],
];

// ── Default payments — 54 paid (fee_checklist__2___1_.pdf, 24/6/2026) ─────────
const DEFAULT_PAYMENTS = {
  '25007-CS-001': { paid: true,  amount:'300', date:'2026-06-23', time:'09:06', method:'Cash' },
  '25007-CS-002': { paid: true,  amount:'300', date:'2026-06-23', time:'10:42', method:'UPI'  },
  '25007-CS-003': { paid: true,  amount:'300', date:'2026-06-24', time:'07:17', method:'UPI'  },
  '25007-CS-004': { paid: true,  amount:'300', date:'2026-06-23', time:'06:12', method:'UPI'  },
  '25007-CS-005': { paid: true,  amount:'300', date:'2026-06-22', time:'18:02', method:'UPI'  },
  '25007-CS-006': { paid: true,  amount:'300', date:'2026-06-21', time:'19:17', method:'UPI'  },
  '25007-CS-007': { paid: true,  amount:'300', date:'2026-06-24', time:'07:26', method:'UPI'  },
  '25007-CS-008': { paid: true,  amount:'300', date:'2026-06-23', time:'14:29', method:'UPI'  },
  '25007-CS-009': { paid: true,  amount:'300', date:'2026-06-24', time:'11:18', method:'UPI'  },
  '25007-CS-010': { paid: true,  amount:'300', date:'2026-06-23', time:'18:50', method:'UPI'  },
  '25007-CS-011': { paid: true,  amount:'300', date:'2026-06-23', time:'14:32', method:'UPI'  },
  '25007-CS-012': { paid: true,  amount:'300', date:'2026-06-23', time:'03:26', method:'UPI'  },
  '25007-CS-014': { paid: true,  amount:'300', date:'2026-06-24', time:'06:37', method:'UPI'  },
  '25007-CS-015': { paid: true,  amount:'300', date:'2026-06-23', time:'18:50', method:'UPI'  },
  '25007-CS-016': { paid: true,  amount:'300', date:'2026-06-22', time:'16:36', method:'UPI'  },
  '25007-CS-017': { paid: true,  amount:'300', date:'2026-06-23', time:'04:59', method:'UPI'  },
  '25007-CS-018': { paid: false, amount:'',    date:'',           time:'',      method:'UPI'  },
  '25007-CS-019': { paid: true,  amount:'300', date:'2026-06-24', time:'11:17', method:'UPI'  },
  '25007-CS-020': { paid: true,  amount:'300', date:'2026-06-23', time:'15:21', method:'UPI'  },
  '25007-CS-021': { paid: true,  amount:'300', date:'2026-06-23', time:'05:37', method:'UPI'  },
  '25007-CS-022': { paid: true,  amount:'300', date:'2026-06-24', time:'11:17', method:'UPI'  },
  '25007-CS-023': { paid: true,  amount:'300', date:'2026-06-23', time:'16:19', method:'UPI'  },
  '25007-CS-024': { paid: true,  amount:'300', date:'2026-06-23', time:'20:07', method:'UPI'  },
  '25007-CS-025': { paid: true,  amount:'300', date:'2026-06-22', time:'18:02', method:'UPI'  },
  '25007-CS-026': { paid: true,  amount:'300', date:'2026-06-20', time:'05:36', method:'UPI'  },
  '25007-CS-027': { paid: true,  amount:'300', date:'2026-06-24', time:'11:18', method:'UPI'  },
  '25007-CS-028': { paid: true,  amount:'300', date:'2026-06-21', time:'01:30', method:'Cash' },
  '25007-CS-029': { paid: true,  amount:'300', date:'2026-06-23', time:'10:58', method:'UPI'  },
  '25007-CS-030': { paid: true,  amount:'300', date:'2026-06-24', time:'11:25', method:'UPI'  },
  '25007-CS-031': { paid: false, amount:'',    date:'',           time:'',      method:'UPI'  },
  '25007-CS-032': { paid: true,  amount:'300', date:'2026-06-23', time:'15:48', method:'UPI'  },
  '25007-CS-033': { paid: true,  amount:'300', date:'2026-06-24', time:'11:18', method:'UPI'  },
  '25007-CS-034': { paid: true,  amount:'300', date:'2026-06-24', time:'11:18', method:'UPI'  },
  '25007-CS-035': { paid: true,  amount:'300', date:'2026-06-24', time:'11:18', method:'UPI'  },
  '25007-CS-036': { paid: true,  amount:'300', date:'2026-06-24', time:'11:23', method:'UPI'  },
  '25007-CS-037': { paid: true,  amount:'300', date:'2026-06-24', time:'08:02', method:'UPI'  },
  '25007-CS-038': { paid: true,  amount:'300', date:'2026-06-24', time:'08:01', method:'UPI'  },
  '25007-CS-039': { paid: true,  amount:'300', date:'2026-06-21', time:'11:03', method:'UPI'  },
  '25007-CS-040': { paid: true,  amount:'300', date:'2026-06-23', time:'07:29', method:'UPI'  },
  '25007-CS-041': { paid: true,  amount:'300', date:'2026-06-24', time:'07:35', method:'UPI'  },
  '25007-CS-042': { paid: true,  amount:'300', date:'2026-06-23', time:'07:26', method:'UPI'  },
  '25007-CS-043': { paid: true,  amount:'300', date:'2026-06-24', time:'07:53', method:'UPI'  },
  '25007-CS-044': { paid: true,  amount:'300', date:'2026-06-24', time:'11:19', method:'UPI'  },
  '25007-CS-045': { paid: false, amount:'',    date:'',           time:'',      method:'UPI'  },
  '25007-CS-046': { paid: true,  amount:'300', date:'2026-06-23', time:'18:20', method:'UPI'  },
  '25007-CS-047': { paid: true,  amount:'300', date:'2026-06-23', time:'22:03', method:'UPI'  },
  '25007-CS-048': { paid: false, amount:'',    date:'',           time:'',      method:'UPI'  },
  '25007-CS-049': { paid: true,  amount:'300', date:'2026-06-23', time:'16:42', method:'UPI'  },
  '25007-CS-050': { paid: false, amount:'',    date:'',           time:'',      method:'UPI'  },
  '25007-CS-051': { paid: true,  amount:'300', date:'2026-06-23', time:'20:01', method:'UPI'  },
  '25007-CS-052': { paid: true,  amount:'300', date:'2026-06-23', time:'03:28', method:'UPI'  },
  '25007-CS-053': { paid: true,  amount:'300', date:'2026-06-24', time:'11:22', method:'UPI'  },
  '25007-CS-054': { paid: false, amount:'',    date:'',           time:'',      method:'UPI'  },
  '25007-CS-055': { paid: true,  amount:'300', date:'2026-06-24', time:'11:19', method:'UPI'  },
  '25007-CS-056': { paid: true,  amount:'300', date:'2026-06-24', time:'11:20', method:'UPI'  },
  '25007-CS-057': { paid: false, amount:'',    date:'',           time:'',      method:'UPI'  },
  '25007-CS-058': { paid: true,  amount:'300', date:'2026-06-23', time:'21:35', method:'UPI'  },
  '25007-CS-059': { paid: true,  amount:'300', date:'2026-06-23', time:'18:24', method:'UPI'  },
  '25007-CS-060': { paid: false, amount:'',    date:'',           time:'',      method:'UPI'  },
  '25007-CS-061': { paid: true,  amount:'300', date:'2026-06-24', time:'11:21', method:'UPI'  },
  '25007-CS-062': { paid: true,  amount:'300', date:'2026-06-24', time:'11:21', method:'UPI'  },
  '25007-CS-063': { paid: false, amount:'',    date:'',           time:'',      method:'UPI'  },
  '25007-CS-064': { paid: true,  amount:'300', date:'2026-06-23', time:'21:58', method:'UPI'  },
  '25007-CS-065': { paid: true,  amount:'300', date:'2026-06-24', time:'12:00', method:'UPI'  },
  '25007-CS-066': { paid: false, amount:'',    date:'',           time:'',      method:'UPI'  },
};

// ── Load / merge saved data ───────────────────────────────────────────────────
let paymentMap = {};
try {
  if (fs.existsSync(DB_PATH)) {
    const saved = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    paymentMap = { ...DEFAULT_PAYMENTS };
    for (const pin of Object.keys(saved)) {
      if (saved[pin].updated_at) paymentMap[pin] = saved[pin];
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(paymentMap, null, 2));
    console.log('✅ Loaded & merged from', DB_PATH);
  } else {
    paymentMap = { ...DEFAULT_PAYMENTS };
    fs.writeFileSync(DB_PATH, JSON.stringify(paymentMap, null, 2));
    console.log('✅ Seeded default data to', DB_PATH);
  }
} catch (e) {
  console.error('⚠️  Data error, using defaults:', e.message);
  paymentMap = { ...DEFAULT_PAYMENTS };
}

function saveDB() {
  try { fs.writeFileSync(DB_PATH, JSON.stringify(paymentMap, null, 2)); }
  catch (e) { console.error('❌ Save failed:', e.message); }
}

function getStudents() {
  return STUDENTS_MASTER.map(([sno, pin, name]) => {
    const p = paymentMap[pin] || {};
    return { sno, pin, name, paid: p.paid||false, amount: p.amount||'', date: p.date||'', time: p.time||'', method: p.method||'UPI', updated_at: p.updated_at||'' };
  });
}

// ── Password (set ADMIN_PASSWORD env var on Render to change) ────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gp2025';

function requireAuth(req, res, next) {
  const token = req.headers['x-auth-token'];
  if (token === ADMIN_PASSWORD) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// ── API ───────────────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) return res.json({ ok: true, token: ADMIN_PASSWORD });
  res.status(401).json({ error: 'Wrong password' });
});

app.get('/api/students', (req, res) => res.json(getStudents()));

app.patch('/api/students/:pin', requireAuth, (req, res) => {
  const { pin } = req.params;
  const master = STUDENTS_MASTER.find(r => r[1] === pin);
  if (!master) return res.status(404).json({ error: 'Student not found' });
  const { paid, amount, date, time, method } = req.body;
  paymentMap[pin] = { paid: !!paid, amount: amount||'', date: date||'', time: time||'', method: method||'UPI', updated_at: new Date().toISOString() };
  saveDB();
  res.json({ sno: master[0], pin, name: master[2], ...paymentMap[pin] });
});

app.get('/api/stats', (req, res) => {
  const s = getStudents();
  const paid = s.filter(x => x.paid);
  res.json({ total: s.length, paid: paid.length, unpaid: s.length - paid.length, totalAmount: paid.reduce((a,x) => a + (parseFloat(x.amount)||0), 0) });
});

app.get('*', (req, res) => {
  const root = path.join(__dirname, 'index.html');
  const pub  = path.join(__dirname, 'public', 'index.html');
  res.sendFile(fs.existsSync(root) ? root : pub);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
