const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
// Serve from root AND public/ — works wherever index.html is placed
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// Try /var/data (Render Persistent Disk), fall back to /tmp, then local ./data
function resolveDataDir() {
  const candidates = ['/var/data', '/tmp', path.join(__dirname, 'data')];
  for (const dir of candidates) {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      // Test write access
      const testFile = path.join(dir, '.write_test');
      fs.writeFileSync(testFile, 'ok');
      fs.unlinkSync(testFile);
      console.log(`✅ Using data directory: ${dir}`);
      return dir;
    } catch (e) {
      console.warn(`⚠️  Cannot use ${dir}: ${e.message}`);
    }
  }
  throw new Error('No writable directory found');
}
const DATA_DIR = resolveDataDir();
const DB_PATH = path.join(DATA_DIR, 'fee_checklist.json');

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
  [48,'25007-CS-049','BHEEMAGIRI KARAN KUMAR'],
  [49,'25007-CS-050','PAPU SRINIVAS'],
  [50,'25007-CS-051','TEJANGI BRIJESH'],
  [51,'25007-CS-052','DHANUSH KUMAR REDDY'],
  [52,'25007-CS-053','SHANKAR RAO SANTHAKUMAR'],
  [53,'25007-CS-054','GUDUR NAVEEN'],
  [54,'25007-CS-055','MADDULURI SANTHOSH'],
  [55,'25007-CS-056','CHINTAKINDI HARIKRISHNA'],
  [56,'25007-CS-057','JAGGU RAHUL'],
  [57,'25007-CS-058','MANPREET KAUR'],
  [58,'25007-CS-059','AMRUTHA VALLI'],
  [59,'25007-CS-060','KAVYA SHREE'],
  [60,'25007-CS-061','HARINI PRIYA'],
  [61,'25007-CS-062','ARAVIND PRASAD'],
  [62,'25007-CS-063','GANESH REDDY'],
  [63,'25007-CS-064','KARTHIK SHARMA'],
  [64,'25007-CS-065','VIKRAM SINGH'],
];

let paymentMap = {};
try {
  if (fs.existsSync(DB_PATH)) paymentMap = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  console.log('✅ Loaded data from', DB_PATH);
} catch (e) {
  console.error('⚠️  Could not read data file, starting fresh:', e.message);
}

function saveDB() {
  try { fs.writeFileSync(DB_PATH, JSON.stringify(paymentMap, null, 2), 'utf8'); }
  catch (e) { console.error('❌ Save failed:', e.message); }
}

function getStudents() {
  return STUDENTS_MASTER.map(([sno, pin, name]) => {
    const p = paymentMap[pin] || {};
    return { sno, pin, name, paid: p.paid || false, amount: p.amount || '', date: p.date || '', time: p.time || '', method: p.method || 'UPI', updated_at: p.updated_at || '' };
  });
}

// GET all students
app.get('/api/students', (req, res) => res.json(getStudents()));

// PATCH one student's payment
app.patch('/api/students/:pin', (req, res) => {
  const { pin } = req.params;
  const master = STUDENTS_MASTER.find(r => r[1] === pin);
  if (!master) return res.status(404).json({ error: 'Student not found' });
  const { paid, amount, date, time, method } = req.body;
  paymentMap[pin] = { paid: !!paid, amount: amount || '', date: date || '', time: time || '', method: method || 'UPI', updated_at: new Date().toISOString() };
  saveDB();
  res.json({ sno: master[0], pin, name: master[2], ...paymentMap[pin] });
});

// GET stats
app.get('/api/stats', (req, res) => {
  const s = getStudents();
  const paid = s.filter(x => x.paid);
  res.json({ total: s.length, paid: paid.length, unpaid: s.length - paid.length, totalAmount: paid.reduce((a, x) => a + (parseFloat(x.amount) || 0), 0) });
});

// Serve frontend
// Serve index.html from root or public/
app.get('*', (req, res) => {
  const root = path.join(__dirname, 'index.html');
  const pub = path.join(__dirname, 'public', 'index.html');
  const file = fs.existsSync(root) ? root : pub;
  res.sendFile(file);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
