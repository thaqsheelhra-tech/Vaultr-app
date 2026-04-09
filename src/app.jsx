import { useState, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#0A0A0B", surface: "#111114", card: "#18181C", border: "#2A2A30",
  borderLight: "#333340", accent: "#E8FF47", accentDim: "#B8CC2A",
  accentGlow: "rgba(232,255,71,0.15)", red: "#FF4D4D", redDim: "#CC2222",
  green: "#22C55E", blue: "#3B82F6", amber: "#F59E0B", purple: "#A855F7",
  teal: "#14B8A6", orange: "#F97316", pink: "#EC4899",
  text: "#F0F0F2", muted: "#8888A0", faint: "#444458",
};

const roles = {
  superadmin: { label: "Super Admin", color: C.purple, icon: "⬡" },
  gymadmin:   { label: "Gym Admin",   color: C.accent,  icon: "◈" },
  trainer:    { label: "Trainer",     color: C.amber,   icon: "◎" },
  member:     { label: "Member",      color: C.blue,    icon: "◉" },
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const initialGyms = [
  { id: 1, name: "IronForge Koramangala", location: "Koramangala, Bengaluru", active: true, checkInMethod: "both", members: 142, trainers: 8 },
  { id: 2, name: "PeakFit Indiranagar",   location: "Indiranagar, Bengaluru",  active: true, checkInMethod: "qr",   members: 89,  trainers: 5 },
];

const initialMembers = [
  { id: 1, gymId: 1, name: "Arjun Sharma",  email: "arjun@email.com",  active: true,  joined: "2024-11-01", plan: "Monthly",   points: 420,  buddyOptIn: true  },
  { id: 2, gymId: 1, name: "Priya Mehta",   email: "priya@email.com",  active: true,  joined: "2024-09-15", plan: "Quarterly", points: 870,  buddyOptIn: true  },
  { id: 3, gymId: 1, name: "Rahul Verma",   email: "rahul@email.com",  active: false, joined: "2024-08-01", plan: "Monthly",   points: 120,  buddyOptIn: false },
  { id: 4, gymId: 2, name: "Sneha Iyer",    email: "sneha@email.com",  active: true,  joined: "2025-01-10", plan: "Annual",    points: 1240, buddyOptIn: false },
  { id: 5, gymId: 2, name: "Vikram Das",    email: "vikram@email.com", active: true,  joined: "2025-02-01", plan: "Monthly",   points: 310,  buddyOptIn: true  },
];

const initialTrainers = [
  { id: 1, gymId: 1, name: "Kiran Rao",    email: "kiran@gym.com",  active: true, speciality: "Strength & Conditioning" },
  { id: 2, gymId: 1, name: "Meena Pillai", email: "meena@gym.com",  active: true, speciality: "Yoga & Flexibility" },
  { id: 3, gymId: 2, name: "Suresh Kumar", email: "suresh@gym.com", active: true, speciality: "HIIT & Cardio" },
];

const now = new Date();
const todayStr = now.toISOString().slice(0, 10);

const initialAttendance = [
  { id: 1, userId: 1, userType: "member",  gymId: 1, date: todayStr,     checkIn: "06:32", checkOut: "08:10", method: "biometric" },
  { id: 2, userId: 2, userType: "member",  gymId: 1, date: todayStr,     checkIn: "07:15", checkOut: "08:45", method: "qr" },
  { id: 3, userId: 1, userType: "trainer", gymId: 1, date: todayStr,     checkIn: "06:00", checkOut: "13:00", method: "biometric" },
  { id: 4, userId: 1, userType: "member",  gymId: 1, date: "2025-03-28", checkIn: "07:00", checkOut: "08:30", method: "qr" },
  { id: 5, userId: 2, userType: "member",  gymId: 1, date: "2025-03-28", checkIn: "06:45", checkOut: "08:00", method: "biometric" },
  { id: 6, userId: 4, userType: "member",  gymId: 2, date: todayStr,     checkIn: "05:55", checkOut: "07:20", method: "qr" },
];

const peakData = [
  { hour: "5am", count: 12 }, { hour: "6am", count: 38 }, { hour: "7am", count: 62 },
  { hour: "8am", count: 55 }, { hour: "9am", count: 41 }, { hour: "10am", count: 28 },
  { hour: "11am", count: 19 }, { hour: "12pm", count: 22 }, { hour: "1pm", count: 15 },
  { hour: "2pm", count: 11 }, { hour: "3pm", count: 18 }, { hour: "4pm", count: 32 },
  { hour: "5pm", count: 58 }, { hour: "6pm", count: 71 }, { hour: "7pm", count: 64 },
  { hour: "8pm", count: 45 }, { hour: "9pm", count: 22 }, { hour: "10pm", count: 8 },
];

const content = [
  { id: 1, gymId: 1, type: "video", title: "Full Body HIIT – 30 Min",     category: "Workout",     likes: 142, date: "2025-03-20" },
  { id: 2, gymId: 1, type: "image", title: "High Protein Meal Prep Guide", category: "Nutrition",   likes: 98,  date: "2025-03-18" },
  { id: 3, gymId: 1, type: "text",  title: "Recovery & Sleep Science",     category: "Wellness",    likes: 67,  date: "2025-03-15" },
  { id: 4, gymId: 2, type: "video", title: "Morning Yoga Flow",            category: "Flexibility", likes: 55,  date: "2025-03-22" },
];

const transformations = [
  { id: 1, gymId: 1, member: "Priya M.", before: "82kg", after: "64kg", duration: "6 months", story: "Transformed my life with consistent training and nutrition coaching at IronForge." },
  { id: 2, gymId: 1, member: "Rahul V.", before: "95kg", after: "76kg", duration: "8 months", story: "Lost 19kg through strength training and diet discipline." },
];

const feedbacks = [
  { id: 1, gymId: 1, user: "Anonymous",   message: "Morning batches are too crowded. Please add more slots.", date: "2025-03-30", type: "anonymous" },
  { id: 2, gymId: 1, user: "Priya Mehta", message: "Love the new yoga classes! Meena is an amazing trainer.",  date: "2025-03-29", type: "named" },
];

const events = [
  { id: 1, gymId: 1, title: "Spartan Challenge 5K", date: "2025-04-15", time: "6:00 AM",  slots: 30, registered: 18 },
  { id: 2, gymId: 1, title: "Nutrition Workshop",   date: "2025-04-20", time: "10:00 AM", slots: 20, registered: 12 },
];

const holidays = [
  { id: 1, gymId: 1, date: "2025-04-14", name: "Dr. Ambedkar Jayanti" },
  { id: 2, gymId: 1, date: "2025-04-18", name: "Good Friday" },
];

// ── NEW DATA ──────────────────────────────────────────────────────────────────
const initialClasses = [
  { id: 1, gymId: 1, name: "Morning HIIT",    trainer: "Kiran Rao",    day: "Mon/Wed/Fri", time: "6:00 AM", capacity: 20, booked: 14 },
  { id: 2, gymId: 1, name: "Power Yoga",      trainer: "Meena Pillai", day: "Tue/Thu/Sat", time: "7:00 AM", capacity: 15, booked: 15 },
  { id: 3, gymId: 1, name: "Strength & Core", trainer: "Kiran Rao",    day: "Mon/Wed/Fri", time: "5:30 PM", capacity: 18, booked: 9  },
  { id: 4, gymId: 1, name: "Zumba Dance",     trainer: "Meena Pillai", day: "Sat/Sun",     time: "9:00 AM", capacity: 25, booked: 21 },
  { id: 5, gymId: 2, name: "Cardio Burn",     trainer: "Suresh Kumar", day: "Daily",       time: "6:30 AM", capacity: 20, booked: 11 },
];

const initialMetrics = [
  { id: 1, memberId: 1, date: "2024-11-01", weight: 82, bodyFat: 24, chest: 102, waist: 88, hips: 98 },
  { id: 2, memberId: 1, date: "2025-01-15", weight: 78, bodyFat: 21, chest: 100, waist: 84, hips: 96 },
  { id: 3, memberId: 1, date: "2025-03-30", weight: 74, bodyFat: 18, chest: 98,  waist: 80, hips: 94 },
  { id: 4, memberId: 2, date: "2024-09-15", weight: 68, bodyFat: 28, chest: 90,  waist: 72, hips: 95 },
  { id: 5, memberId: 2, date: "2025-01-01", weight: 63, bodyFat: 23, chest: 88,  waist: 68, hips: 92 },
  { id: 6, memberId: 2, date: "2025-03-28", weight: 59, bodyFat: 19, chest: 86,  waist: 65, hips: 90 },
];

const initialChallenges = [
  { id: 1, gymId: 1, title: "April Check-in King", desc: "Most check-ins this month wins.", metric: "checkins", prize: "1 Month Free", ends: "2025-04-30",
    leaderboard: [
      { memberId: 2, name: "Priya M.",  value: 18, rank: 1 },
      { memberId: 1, name: "Arjun S.", value: 14, rank: 2 },
      { memberId: 3, name: "Rahul V.", value: 6,  rank: 3 },
    ]
  },
  { id: 2, gymId: 1, title: "Summer Shred", desc: "Most kg lost in 30 days.", metric: "weightloss", prize: "Free PT Sessions", ends: "2025-04-30",
    leaderboard: [
      { memberId: 1, name: "Arjun S.", value: 4.2, rank: 1 },
      { memberId: 2, name: "Priya M.",  value: 3.1, rank: 2 },
    ]
  },
];

const initialEquipment = [
  { id: 1, gymId: 1, name: "Treadmill #3",     issue: "Belt slipping at high speed", reportedBy: "Arjun Sharma", date: "2025-04-01", status: "open"        },
  { id: 2, gymId: 1, name: "Cable Machine #1", issue: "Left pulley making noise",    reportedBy: "Anonymous",    date: "2025-03-29", status: "in-progress" },
  { id: 3, gymId: 1, name: "Bench Press #2",   issue: "Padding torn",               reportedBy: "Priya Mehta",  date: "2025-03-25", status: "resolved"    },
];

const partners = [
  { id: 1, name: "MuscleBlaze",    category: "Supplements",   discount: "20% off",          code: "VAULT20",   color: C.orange },
  { id: 2, name: "Decathlon",      category: "Apparel",       discount: "15% off",          code: "VAULT15",   color: C.blue   },
  { id: 3, name: "Thyrocare",      category: "Health Labs",   discount: "₹500 off",         code: "VAULTLAB",  color: C.teal   },
  { id: 4, name: "Healthifyme",    category: "Nutrition App", discount: "3 months free",    code: "VAULTHFY",  color: C.green  },
  { id: 5, name: "Physio Connect", category: "Physiotherapy", discount: "First session free",code: "VAULTPHYS",color: C.purple },
];

const benchmarks = {
  avgRetention:     { yours: 78,   market: 62,   unit: "%",              better: "higher" },
  revenuePerMember: { yours: 1850, market: 1420, unit: "₹/mo",          better: "higher" },
  peakHourFill:     { yours: 71,   market: 58,   unit: "%",              better: "higher" },
  trainerRatio:     { yours: 18,   market: 22,   unit: "members/trainer",better: "lower"  },
  avgCheckins:      { yours: 14,   market: 9,    unit: "visits/month",   better: "higher" },
  contentEngagement:{ yours: 34,   market: 18,   unit: "%",              better: "higher" },
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ children, color = C.muted, bg }) => (
  <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600, letterSpacing:"0.04em", color, background:bg||`${color}22`, border:`1px solid ${color}44` }}>{children}</span>
);

const Btn = ({ children, onClick, variant="primary", small, fullWidth, disabled }) => {
  const isPrimary=variant==="primary", isDanger=variant==="danger", isGhost=variant==="ghost";
  const bg=disabled?C.faint:isPrimary?C.accent:isDanger?C.red:"transparent";
  const tc=disabled?C.muted:isPrimary?"#0A0A0B":isDanger?"#fff":C.muted;
  return <button onClick={disabled?undefined:onClick} style={{ background:bg, color:tc, border:isGhost?`1px solid ${C.border}`:"none", borderRadius:10, padding:small?"6px 14px":"10px 20px", fontSize:small?12:14, fontWeight:600, cursor:disabled?"not-allowed":"pointer", width:fullWidth?"100%":"auto", fontFamily:"inherit", transition:"all 0.15s", opacity:disabled?0.5:1, letterSpacing:"0.02em" }}>{children}</button>;
};

const Card = ({ children, style, onClick, highlight }) => (
  <div onClick={onClick} style={{ background:C.card, border:`1px solid ${highlight?C.accent+"66":C.border}`, borderRadius:14, padding:16, cursor:onClick?"pointer":"default", transition:"border-color 0.2s", ...style }}>{children}</div>
);

const Input = ({ label, value, onChange, placeholder, type="text" }) => (
  <div style={{ marginBottom:14 }}>
    {label && <div style={{ fontSize:12, color:C.muted, marginBottom:6, fontWeight:500 }}>{label}</div>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:14, fontFamily:"inherit", boxSizing:"border-box", outline:"none" }} />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom:14 }}>
    {label && <div style={{ fontSize:12, color:C.muted, marginBottom:6, fontWeight:500 }}>{label}</div>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:14, fontFamily:"inherit", outline:"none" }}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Stat = ({ label, value, color }) => (
  <div style={{ background:C.surface, borderRadius:12, padding:"14px 16px", border:`1px solid ${C.border}` }}>
    <div style={{ fontSize:11, color:C.muted, marginBottom:6, fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase" }}>{label}</div>
    <div style={{ fontSize:26, fontWeight:700, color:color||C.text, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.02em" }}>{value}</div>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
    onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:24, width:"100%", maxWidth:440, maxHeight:"82vh", overflowY:"auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{title}</div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer" }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const Toast = ({ msg }) => (
  <div style={{ position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)", background:C.accent, color:"#0A0A0B", padding:"10px 20px", borderRadius:50, fontWeight:700, fontSize:13, zIndex:2000, whiteSpace:"nowrap", boxShadow:`0 4px 24px ${C.accentGlow}` }}>{msg}</div>
);

const SectionHeader = ({ title, action }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
    <div style={{ fontSize:13, fontWeight:700, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase" }}>{title}</div>
    {action}
  </div>
);

const Avatar = ({ name, size=36, color=C.accent }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:`${color}22`, border:`1px solid ${color}66`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.35, fontWeight:700, color, flexShrink:0 }}>
    {name?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
  </div>
);

const HeatBar = ({ hour, count, max }) => {
  const pct=count/max;
  const col=pct>0.75?C.red:pct>0.5?C.accent:pct>0.25?C.amber:C.blue;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flex:1 }}>
      <div style={{ fontSize:10, color:C.muted, fontWeight:600 }}>{count}</div>
      <div style={{ width:"100%", height:80, background:C.surface, borderRadius:4, display:"flex", alignItems:"flex-end" }}>
        <div style={{ width:"100%", height:`${pct*100}%`, background:col, borderRadius:4 }} />
      </div>
      <div style={{ fontSize:9, color:C.faint, transform:"rotate(-30deg)", transformOrigin:"top center", marginTop:4 }}>{hour}</div>
    </div>
  );
};

const QRDisplay = ({ gymId }) => {
  const cells=12, seed=gymId*7;
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${cells},1fr)`, gap:2, width:140, height:140 }}>
      {Array.from({length:cells*cells}).map((_,i)=>{
        const row=Math.floor(i/cells), col=i%cells;
        const corner=(row<3&&col<3)||(row<3&&col>8)||(row>8&&col<3);
        const fill=corner||((i+seed*3)%3===0&&!corner&&Math.random()>0.4);
        return <div key={i} style={{ background:fill?C.text:"transparent", borderRadius:1 }} />;
      })}
    </div>
  );
};

// ─── NEW FEATURE COMPONENTS ───────────────────────────────────────────────────

// 1 — Smart Class & Slot Booking
const ClassBooking = ({ classes, gymId, showToast, isAdmin, setClasses }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const mine = classes.filter(c=>c.gymId===gymId);

  const addCls = () => {
    if (!form.name) return;
    setClasses(cs=>[...cs,{ id:Date.now(), gymId, name:form.name, trainer:form.trainer||"TBD", day:form.day||"Daily", time:form.time||"7:00 AM", capacity:Number(form.capacity)||15, booked:0 }]);
    showToast("Class added!"); setModal(false); setForm({});
  };

  return (
    <div>
      {isAdmin && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.text }}>Class Schedule</div>
          <Btn small onClick={()=>setModal(true)}>+ Add Class</Btn>
        </div>
      )}
      {mine.map(cls=>{
        const pct=Math.round((cls.booked/cls.capacity)*100);
        const full=cls.booked>=cls.capacity;
        return (
          <Card key={cls.id} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <div style={{ fontWeight:700, color:C.text, fontSize:14, marginBottom:2 }}>{cls.name}</div>
                <div style={{ fontSize:12, color:C.muted }}>{cls.trainer} · {cls.day}</div>
                <div style={{ fontSize:13, color:C.accent, marginTop:2, fontWeight:600 }}>{cls.time}</div>
              </div>
              <Badge color={full?C.red:C.green}>{full?"Full":`${cls.capacity-cls.booked} left`}</Badge>
            </div>
            <div style={{ marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.muted, marginBottom:4 }}>
                <span>{cls.booked}/{cls.capacity} booked</span><span>{pct}%</span>
              </div>
              <div style={{ height:4, background:C.surface, borderRadius:2 }}>
                <div style={{ height:"100%", width:`${pct}%`, background:full?C.red:pct>70?C.amber:C.green, borderRadius:2 }} />
              </div>
            </div>
            {!isAdmin && (
              <Btn small fullWidth disabled={full}
                onClick={()=>{ if(!full){ setClasses(cs=>cs.map(c=>c.id===cls.id?{...c,booked:c.booked+1}:c)); showToast(`Booked ${cls.name}! 🎉`); } }}>
                {full?"Join Waitlist":"Book Slot"}
              </Btn>
            )}
          </Card>
        );
      })}
      {modal && (
        <Modal title="Add New Class" onClose={()=>{setModal(false);setForm({})}}>
          <Input label="Class name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Morning HIIT" />
          <Input label="Trainer" value={form.trainer||""} onChange={v=>setForm(f=>({...f,trainer:v}))} placeholder="Trainer name" />
          <Input label="Days" value={form.day||""} onChange={v=>setForm(f=>({...f,day:v}))} placeholder="e.g. Mon/Wed/Fri" />
          <Input label="Time" value={form.time||""} onChange={v=>setForm(f=>({...f,time:v}))} placeholder="e.g. 6:00 AM" />
          <Input label="Capacity" value={form.capacity||""} onChange={v=>setForm(f=>({...f,capacity:v}))} placeholder="e.g. 20" type="number" />
          <Btn fullWidth onClick={addCls}>Add Class</Btn>
        </Modal>
      )}
    </div>
  );
};

// 2 — Body Metrics Tracker
const BodyMetrics = ({ metrics, setMetrics, memberId, showToast }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const mine = [...metrics.filter(m=>m.memberId===memberId)].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const latest=mine[mine.length-1], first=mine[0];
  const diff=(key)=>{ if(!latest||mine.length<2) return null; const d=latest[key]-first[key]; return d>0?`+${d}`:`${d}`; };

  const logEntry = () => {
    const entry={ id:Date.now(), memberId, date:todayStr, weight:Number(form.weight)||0, bodyFat:Number(form.bodyFat)||0, chest:Number(form.chest)||0, waist:Number(form.waist)||0, hips:Number(form.hips)||0 };
    setMetrics(m=>[...m,entry]);
    showToast("Metrics logged! 📏"); setModal(false); setForm({});
  };

  return (
    <div>
      {latest && (
        <div style={{ background:`${C.teal}0E`, border:`1px solid ${C.teal}44`, borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:11, color:C.teal, fontWeight:700, marginBottom:10, letterSpacing:"0.06em" }}>LATEST — {latest.date}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[{l:"Weight",k:"weight",u:"kg"},{l:"Body Fat",k:"bodyFat",u:"%"},{l:"Waist",k:"waist",u:"cm"}].map(m=>(
              <div key={m.k} style={{ textAlign:"center", background:C.surface, borderRadius:10, padding:"10px 6px" }}>
                <div style={{ fontSize:20, fontWeight:700, color:C.text }}>{latest[m.k]}<span style={{ fontSize:11, color:C.muted }}>{m.u}</span></div>
                <div style={{ fontSize:10, color:C.muted, marginBottom:4 }}>{m.l}</div>
                {diff(m.k)&&mine.length>1&&<div style={{ fontSize:10, fontWeight:700, color:parseFloat(diff(m.k))<0?C.green:C.red }}>{diff(m.k)}{m.u}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      <SectionHeader title="Progress Log" action={<Btn small onClick={()=>setModal(true)}>+ Log Entry</Btn>} />
      {mine.length===0 && <div style={{ color:C.muted, fontSize:13, textAlign:"center", padding:"20px 0" }}>No entries yet. Start tracking your progress.</div>}
      {[...mine].reverse().map((m,i)=>(
        <Card key={m.id} style={{ marginBottom:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div style={{ fontSize:12, color:C.muted }}>{m.date}</div>
            {i===0&&<Badge color={C.accent}>Latest</Badge>}
          </div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {[["Weight",m.weight,"kg"],["Body Fat",m.bodyFat,"%"],["Chest",m.chest,"cm"],["Waist",m.waist,"cm"],["Hips",m.hips,"cm"]].map(([l,v,u])=>(
              <div key={l} style={{ fontSize:12 }}><span style={{ color:C.muted }}>{l}: </span><span style={{ color:C.text, fontWeight:600 }}>{v}{u}</span></div>
            ))}
          </div>
        </Card>
      ))}
      {modal&&(
        <Modal title="Log Body Metrics" onClose={()=>{setModal(false);setForm({})}}>
          <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Logging for: {todayStr}</div>
          <Input label="Weight (kg)" value={form.weight||""} onChange={v=>setForm(f=>({...f,weight:v}))} placeholder="e.g. 75" type="number" />
          <Input label="Body Fat %" value={form.bodyFat||""} onChange={v=>setForm(f=>({...f,bodyFat:v}))} placeholder="e.g. 18" type="number" />
          <Input label="Chest (cm)" value={form.chest||""} onChange={v=>setForm(f=>({...f,chest:v}))} placeholder="e.g. 98" type="number" />
          <Input label="Waist (cm)" value={form.waist||""} onChange={v=>setForm(f=>({...f,waist:v}))} placeholder="e.g. 80" type="number" />
          <Input label="Hips (cm)" value={form.hips||""} onChange={v=>setForm(f=>({...f,hips:v}))} placeholder="e.g. 94" type="number" />
          <Btn fullWidth onClick={logEntry}>Save Entry</Btn>
        </Modal>
      )}
    </div>
  );
};

// 3 — Challenges & Leaderboard
const Challenges = ({ challenges, gymId, memberId, showToast }) => {
  const mine=challenges.filter(c=>c.gymId===gymId);
  const medals=["🥇","🥈","🥉"];
  return (
    <div>
      {mine.map(ch=>(
        <Card key={ch.id} style={{ marginBottom:16, border:`1px solid ${C.amber}55` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
            <div style={{ fontWeight:700, color:C.text, fontSize:15 }}>{ch.title}</div>
            <Badge color={C.amber}>Ends {ch.ends}</Badge>
          </div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>{ch.desc}</div>
          <div style={{ background:`${C.amber}11`, borderRadius:8, padding:"8px 12px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:16 }}>🏆</span>
            <span style={{ fontSize:12, color:C.amber, fontWeight:600 }}>Prize: {ch.prize}</span>
          </div>
          <div style={{ fontSize:11, color:C.muted, fontWeight:700, letterSpacing:"0.07em", marginBottom:8 }}>LEADERBOARD</div>
          {ch.leaderboard.map((e,i)=>{
            const isMe=e.memberId===memberId;
            return (
              <div key={e.memberId} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:8, marginBottom:4, background:isMe?`${C.accent}11`:C.surface, border:isMe?`1px solid ${C.accent}44`:"none" }}>
                <span style={{ fontSize:18, width:24, textAlign:"center" }}>{medals[i]||`#${i+1}`}</span>
                <span style={{ flex:1, fontSize:13, fontWeight:isMe?700:500, color:isMe?C.accent:C.text }}>{e.name}{isMe?" (You)":""}</span>
                <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{e.value} {ch.metric==="checkins"?"visits":"kg"}</span>
              </div>
            );
          })}
          <div style={{ marginTop:12 }}>
            <Btn small fullWidth onClick={()=>showToast("You're in the challenge! 💪")}>Join Challenge</Btn>
          </div>
        </Card>
      ))}
    </div>
  );
};

// 4 — Workout Buddy Matching
const BuddyMatch = ({ members, gymId, memberId, showToast }) => {
  const [optedIn,setOptedIn]=useState(true);
  const suggestions=members.filter(m=>m.gymId===gymId&&m.active&&m.id!==memberId&&m.buddyOptIn);
  return (
    <div>
      <Card style={{ marginBottom:16, background:`${C.pink}0E`, border:`1px solid ${C.pink}44` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontWeight:700, color:C.text, fontSize:14 }}>Buddy matching</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Pair with members who share your schedule & goals</div>
          </div>
          <div onClick={()=>setOptedIn(v=>!v)} style={{ width:44, height:24, borderRadius:12, background:optedIn?C.green:C.faint, cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
            <div style={{ width:18, height:18, borderRadius:"50%", background:"white", position:"absolute", top:3, left:optedIn?23:3, transition:"left 0.2s" }} />
          </div>
        </div>
        {optedIn&&<div style={{ fontSize:11, color:C.green, marginTop:8 }}>✓ You're visible to potential buddies</div>}
      </Card>
      <SectionHeader title={`Suggested Matches (${suggestions.length})`} />
      {suggestions.length===0&&<div style={{ color:C.muted, fontSize:13, textAlign:"center", padding:"20px 0" }}>No matches yet — more members joining daily.</div>}
      {suggestions.map(m=>(
        <Card key={m.id} style={{ marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <Avatar name={m.name} color={C.pink} size={40} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:C.text, fontSize:14 }}>{m.name}</div>
              <div style={{ fontSize:12, color:C.muted }}>{m.plan} plan · since {m.joined.slice(0,7)}</div>
              <div style={{ display:"flex", gap:6, marginTop:6 }}>
                <Badge color={C.teal}>Similar schedule</Badge>
                <Badge color={C.purple}>Same goals</Badge>
              </div>
            </div>
            <Btn small onClick={()=>showToast(`Request sent to ${m.name.split(" ")[0]}! 🤝`)}>Connect</Btn>
          </div>
        </Card>
      ))}
      <div style={{ marginTop:12, padding:"12px 16px", background:`${C.pink}0E`, borderRadius:10, border:`1px solid ${C.pink}22` }}>
        <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>Members with buddies visit <span style={{ color:C.pink, fontWeight:700 }}>25% more often</span> and are less likely to cancel.</div>
      </div>
    </div>
  );
};

// 5 — Equipment Maintenance Tracker
const EquipmentTracker = ({ equipment, setEquipment, gymId, isAdmin, showToast }) => {
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({});
  const mine=equipment.filter(e=>e.gymId===gymId);
  const sc=s=>s==="open"?C.red:s==="in-progress"?C.amber:C.green;
  const sl=s=>s==="open"?"Open":s==="in-progress"?"In Progress":"Resolved";

  const submit=()=>{
    if(!form.name||!form.issue) return;
    setEquipment(eq=>[...eq,{ id:Date.now(), gymId, name:form.name, issue:form.issue, reportedBy:form.anon?"Anonymous":"You", date:todayStr, status:"open" }]);
    showToast("Issue reported! Admin will review shortly."); setModal(false); setForm({});
  };

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[["Open",mine.filter(e=>e.status==="open").length,C.red],["In Progress",mine.filter(e=>e.status==="in-progress").length,C.amber],["Resolved",mine.filter(e=>e.status==="resolved").length,C.green]].map(([l,v,c])=>(
          <div key={l} style={{ flex:1, background:C.surface, borderRadius:10, padding:"10px 8px", textAlign:"center", border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:22, fontWeight:700, color:c, fontFamily:"'Bebas Neue',sans-serif" }}>{v}</div>
            <div style={{ fontSize:10, color:C.muted }}>{l}</div>
          </div>
        ))}
      </div>
      {mine.map(eq=>(
        <Card key={eq.id} style={{ marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:C.text, fontSize:14 }}>{eq.name}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{eq.issue}</div>
              <div style={{ fontSize:11, color:C.faint, marginTop:4 }}>By {eq.reportedBy} · {eq.date}</div>
            </div>
            <Badge color={sc(eq.status)}>{sl(eq.status)}</Badge>
          </div>
          {isAdmin&&eq.status!=="resolved"&&(
            <div style={{ display:"flex", gap:8, marginTop:8 }}>
              {eq.status==="open"&&<Btn small variant="ghost" onClick={()=>{ setEquipment(es=>es.map(e=>e.id===eq.id?{...e,status:"in-progress"}:e)); showToast("Marked in progress"); }}>In Progress</Btn>}
              <Btn small onClick={()=>{ setEquipment(es=>es.map(e=>e.id===eq.id?{...e,status:"resolved"}:e)); showToast("Marked resolved ✓"); }}>Resolve</Btn>
            </div>
          )}
        </Card>
      ))}
      {!isAdmin&&<div style={{ marginTop:8 }}><Btn fullWidth variant="ghost" onClick={()=>setModal(true)}>+ Report Equipment Issue</Btn></div>}
      {modal&&(
        <Modal title="Report Issue" onClose={()=>{setModal(false);setForm({})}}>
          <Input label="Equipment name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Treadmill #4" />
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12, color:C.muted, marginBottom:6, fontWeight:500 }}>Describe the issue</div>
            <textarea value={form.issue||""} onChange={e=>setForm(f=>({...f,issue:e.target.value}))} placeholder="What's wrong with it?" rows={3}
              style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:14, fontFamily:"inherit", resize:"none", boxSizing:"border-box", outline:"none" }} />
          </div>
          <label style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, cursor:"pointer" }}>
            <input type="checkbox" checked={!!form.anon} onChange={e=>setForm(f=>({...f,anon:e.target.checked}))} />
            <span style={{ fontSize:13, color:C.muted }}>Report anonymously</span>
          </label>
          <Btn fullWidth onClick={submit}>Submit Report</Btn>
        </Modal>
      )}
    </div>
  );
};

// 6 — Partner Brand Integrations
const PartnerBrands = ({ showToast }) => (
  <div>
    <div style={{ fontSize:13, color:C.muted, marginBottom:16, lineHeight:1.5 }}>Exclusive discounts for Vaultr members. Show the code at checkout or use online.</div>
    {partners.map(p=>(
      <Card key={p.id} style={{ marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <div style={{ width:44, height:44, borderRadius:10, background:`${p.color}22`, border:`1px solid ${p.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:p.color, flexShrink:0 }}>
            {p.name.slice(0,2).toUpperCase()}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, color:C.text, fontSize:14 }}>{p.name}</div>
            <div style={{ fontSize:11, color:C.muted }}>{p.category}</div>
          </div>
          <div style={{ fontSize:15, fontWeight:700, color:p.color }}>{p.discount}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:C.surface, borderRadius:8, padding:"8px 12px" }}>
          <div>
            <div style={{ fontSize:10, color:C.muted, marginBottom:2 }}>YOUR CODE</div>
            <div style={{ fontFamily:"monospace", fontSize:15, fontWeight:700, color:C.accent, letterSpacing:"0.1em" }}>{p.code}</div>
          </div>
          <Btn small onClick={()=>showToast(`${p.code} copied! 🎉`)}>Copy Code</Btn>
        </div>
      </Card>
    ))}
  </div>
);

// 7 — Gym Valuation & Benchmarking
const Benchmarking = () => {
  const items=[
    {label:"Member retention rate",   key:"avgRetention",      icon:"📈"},
    {label:"Revenue per member",       key:"revenuePerMember",  icon:"💰"},
    {label:"Peak hour fill rate",      key:"peakHourFill",      icon:"🔥"},
    {label:"Members per trainer",      key:"trainerRatio",      icon:"👥"},
    {label:"Avg visits per month",     key:"avgCheckins",       icon:"📅"},
    {label:"Content engagement rate",  key:"contentEngagement", icon:"📱"},
  ];
  return (
    <div>
      <div style={{ background:`${C.accent}0D`, border:`1px solid ${C.accent}33`, borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
        <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>Benchmarked against</div>
        <div style={{ fontSize:14, fontWeight:700, color:C.text }}>62 gyms in Bengaluru on Vaultr</div>
        <div style={{ fontSize:11, color:C.accent, marginTop:4 }}>🏆 Top 18% overall performance</div>
      </div>
      {items.map(item=>{
        const d=benchmarks[item.key];
        const winning=(d.better==="higher"&&d.yours>d.market)||(d.better==="lower"&&d.yours<d.market);
        const pct=Math.abs(Math.round(((d.yours-d.market)/d.market)*100));
        return (
          <Card key={item.key} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", gap:10, marginBottom:10 }}>
              <span style={{ fontSize:18 }}>{item.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:8 }}>{item.label}</div>
                <div style={{ display:"flex", gap:16, alignItems:"flex-end" }}>
                  <div>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:2 }}>YOUR GYM</div>
                    <div style={{ fontSize:22, fontWeight:700, color:winning?C.green:C.amber, fontFamily:"'Bebas Neue',sans-serif" }}>{d.yours}{d.unit}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:2 }}>MARKET AVG</div>
                    <div style={{ fontSize:22, fontWeight:700, color:C.faint, fontFamily:"'Bebas Neue',sans-serif" }}>{d.market}{d.unit}</div>
                  </div>
                  <div style={{ flex:1, display:"flex", justifyContent:"flex-end" }}>
                    <Badge color={winning?C.green:C.amber}>{winning?"▲":"▼"} {pct}% {winning?"above":"below"}</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ height:4, background:C.surface, borderRadius:2 }}>
              <div style={{ height:"100%", width:`${Math.min((d.yours/Math.max(d.yours,d.market))*100,100)}%`, background:winning?C.green:C.amber, borderRadius:2 }} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// ─── SUPER ADMIN ──────────────────────────────────────────────────────────────
const SuperAdminApp = ({ gyms, setGyms, members, trainers, showToast }) => {
  const [tab,setTab]=useState("dashboard");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const tabs=[{id:"dashboard",label:"Dashboard"},{id:"gyms",label:"Gyms"},{id:"users",label:"Users"},{id:"benchmarks",label:"Benchmarks"}];
  const addGym=()=>{
    if(!form.name)return;
    setGyms(g=>[...g,{id:Date.now(),name:form.name,location:form.location||"",active:true,checkInMethod:form.method||"qr",members:0,trainers:0}]);
    showToast("Gym created!"); setModal(null); setForm({});
  };
  const toggleGym=(id)=>{ setGyms(g=>g.map(x=>x.id===id?{...x,active:!x.active}:x)); showToast("Status updated"); };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", maxWidth:420, margin:"0 auto" }}>
      <div style={{ padding:"20px 20px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:11, color:C.purple, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>⬡ Super Admin</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:C.text }}>Platform Control</div>
        </div>
        <Avatar name="SA" color={C.purple} size={36} />
      </div>
      <div style={{ display:"flex", gap:6, padding:"16px 20px 0", overflowX:"auto", scrollbarWidth:"none" }}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{ background:tab===t.id?`${C.purple}22`:"transparent", border:`1px solid ${tab===t.id?C.purple:C.border}`, borderRadius:20, padding:"5px 12px", fontSize:11, fontWeight:600, color:tab===t.id?C.purple:C.muted, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>{t.label}</button>)}
      </div>
      <div style={{ padding:20, paddingBottom:40 }}>
        {tab==="dashboard"&&(
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              <Stat label="Total Gyms" value={gyms.length} color={C.purple} />
              <Stat label="Active" value={gyms.filter(g=>g.active).length} color={C.green} />
              <Stat label="Members" value={members.length} color={C.blue} />
              <Stat label="Trainers" value={trainers.length} color={C.amber} />
            </div>
            <SectionHeader title="All Gyms" />
            {gyms.map(gym=>(
              <Card key={gym.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ fontWeight:700, color:C.text, marginBottom:4 }}>{gym.name}</div>
                    <div style={{ fontSize:12, color:C.muted }}>{gym.location}</div>
                    <div style={{ display:"flex", gap:6, marginTop:8 }}>
                      <Badge color={gym.active?C.green:C.red}>{gym.active?"Active":"Inactive"}</Badge>
                      <Badge color={C.blue}>{gym.checkInMethod.toUpperCase()}</Badge>
                    </div>
                  </div>
                  <Btn small variant={gym.active?"danger":"ghost"} onClick={()=>toggleGym(gym.id)}>{gym.active?"Deactivate":"Activate"}</Btn>
                </div>
                <div style={{ display:"flex", gap:16, marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:12, color:C.muted }}><span style={{ color:C.text, fontWeight:700 }}>{gym.members}</span> members</div>
                  <div style={{ fontSize:12, color:C.muted }}><span style={{ color:C.text, fontWeight:700 }}>{gym.trainers}</span> trainers</div>
                </div>
              </Card>
            ))}
          </>
        )}
        {tab==="gyms"&&(
          <>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text }}>Manage Gyms</div>
              <Btn small onClick={()=>setModal("addGym")}>+ Add Gym</Btn>
            </div>
            {gyms.map(gym=>(
              <Card key={gym.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontWeight:700, color:C.text, marginBottom:2 }}>{gym.name}</div>
                    <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>{gym.location}</div>
                    <div style={{ display:"flex", gap:6 }}>
                      <Badge color={gym.active?C.green:C.red}>{gym.active?"Active":"Inactive"}</Badge>
                      <Badge color={C.purple}>{gym.checkInMethod}</Badge>
                    </div>
                  </div>
                  <Btn small variant={gym.active?"danger":"ghost"} onClick={()=>toggleGym(gym.id)}>{gym.active?"Deactivate":"Reactivate"}</Btn>
                </div>
              </Card>
            ))}
          </>
        )}
        {tab==="users"&&(
          <>
            <SectionHeader title="Members" />
            {members.map(m=>(
              <Card key={m.id} style={{ marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <Avatar name={m.name} color={C.blue} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, color:C.text, fontSize:14 }}>{m.name}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{gyms.find(g=>g.id===m.gymId)?.name}</div>
                  </div>
                  <Badge color={m.active?C.green:C.red}>{m.active?"Active":"Inactive"}</Badge>
                </div>
              </Card>
            ))}
            <SectionHeader title="Trainers" />
            {trainers.map(t=>(
              <Card key={t.id} style={{ marginBottom:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <Avatar name={t.name} color={C.amber} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, color:C.text, fontSize:14 }}>{t.name}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{t.speciality}</div>
                  </div>
                  <Badge color={t.active?C.green:C.red}>{t.active?"Active":"Inactive"}</Badge>
                </div>
              </Card>
            ))}
          </>
        )}
        {tab==="benchmarks"&&<Benchmarking />}
      </div>
      {modal==="addGym"&&(
        <Modal title="Add New Gym" onClose={()=>{setModal(null);setForm({})}}>
          <Input label="Gym Name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="FitZone Whitefield" />
          <Input label="Location" value={form.location||""} onChange={v=>setForm(f=>({...f,location:v}))} placeholder="Whitefield, Bengaluru" />
          <Select label="Check-in Method" value={form.method||"qr"} onChange={v=>setForm(f=>({...f,method:v}))} options={[{value:"qr",label:"QR Code"},{value:"biometric",label:"Biometric"},{value:"both",label:"Both"}]} />
          <Btn fullWidth onClick={addGym}>Create Gym</Btn>
        </Modal>
      )}
    </div>
  );
};

// ─── GYM ADMIN ────────────────────────────────────────────────────────────────
const GymAdminApp = ({ gyms, members, setMembers, trainers, setTrainers, attendance, content:ct, setContent, feedback, events, holidays, setHolidays, classes, setClasses, equipment, setEquipment, showToast }) => {
  const [tab,setTab]=useState("dashboard");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const gym=gyms[0];
  const myMembers=members.filter(m=>m.gymId===gym.id);
  const myTrainers=trainers.filter(t=>t.gymId===gym.id);
  const myAttendance=attendance.filter(a=>a.gymId===gym.id);
  const todayAtt=myAttendance.filter(a=>a.date===todayStr);
  const max=Math.max(...peakData.map(d=>d.count));

  const tabs=[
    {id:"dashboard",label:"Dashboard"},{id:"members",label:"Members"},{id:"trainers",label:"Trainers"},
    {id:"attendance",label:"Attendance"},{id:"classes",label:"Classes"},{id:"content",label:"Content"},
    {id:"equipment",label:"Equipment"},{id:"feedback",label:"Feedback"},{id:"benchmarks",label:"Benchmarks"},{id:"calendar",label:"Calendar"},
  ];

  return (
    <div style={{ background:C.bg, minHeight:"100vh", maxWidth:420, margin:"0 auto" }}>
      <div style={{ padding:"20px 20px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:11, color:C.accent, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>◈ Gym Admin</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:C.text }}>{gym.name}</div>
        </div>
        <Badge color={C.green}>Active</Badge>
      </div>
      <div style={{ display:"flex", gap:6, padding:"14px 20px 0", overflowX:"auto", scrollbarWidth:"none" }}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{ background:tab===t.id?`${C.accent}22`:"transparent", border:`1px solid ${tab===t.id?C.accent:C.border}`, borderRadius:20, padding:"5px 12px", fontSize:11, fontWeight:600, color:tab===t.id?C.accent:C.muted, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>{t.label}</button>)}
      </div>
      <div style={{ padding:20, paddingBottom:40 }}>
        {tab==="dashboard"&&(
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              <Stat label="Total Members" value={myMembers.length} />
              <Stat label="Active" value={myMembers.filter(m=>m.active).length} color={C.green} />
              <Stat label="Today Check-ins" value={todayAtt.length} color={C.accent} />
              <Stat label="Open Issues" value={equipment.filter(e=>e.gymId===gym.id&&e.status==="open").length} color={C.red} />
            </div>
            <SectionHeader title="Peak Hours" />
            <Card style={{ marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:110 }}>
                {peakData.map(d=><HeatBar key={d.hour} {...d} max={max} />)}
              </div>
              <div style={{ display:"flex", gap:12, marginTop:16, flexWrap:"wrap" }}>
                {[[C.red,"Peak"],[C.accent,"High"],[C.amber,"Med"],[C.blue,"Low"]].map(([c,l])=>(
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}><div style={{ width:8, height:8, borderRadius:2, background:c }} /><span style={{ fontSize:10, color:C.muted }}>{l}</span></div>
                ))}
              </div>
            </Card>
            <SectionHeader title="Today's Attendance" />
            {todayAtt.map(a=>{
              const usr=a.userType==="member"?myMembers.find(m=>m.id===a.userId):myTrainers.find(t=>t.id===a.userId);
              return (
                <Card key={a.id} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <Avatar name={usr?.name||"?"} color={a.userType==="trainer"?C.amber:C.blue} size={32} />
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{usr?.name||"Unknown"}</div>
                        <div style={{ fontSize:11, color:C.muted }}>{a.checkIn} – {a.checkOut||"Still in"}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:4, flexDirection:"column", alignItems:"flex-end" }}>
                      <Badge color={a.userType==="trainer"?C.amber:C.blue}>{a.userType}</Badge>
                      <Badge color={a.method==="biometric"?C.purple:C.green}>{a.method}</Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </>
        )}
        {tab==="members"&&(
          <>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text }}>Members ({myMembers.length})</div>
              <Btn small onClick={()=>setModal("addMember")}>+ Add</Btn>
            </div>
            {myMembers.map(m=>(
              <Card key={m.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                  <Avatar name={m.name} color={C.blue} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:C.text }}>{m.name}</div>
                    <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>{m.email}</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      <Badge color={m.active?C.green:C.red}>{m.active?"Active":"Inactive"}</Badge>
                      <Badge color={C.blue}>{m.plan}</Badge>
                      <span style={{ fontSize:11, color:C.faint }}>{m.points} pts</span>
                    </div>
                  </div>
                  <Btn small variant={m.active?"danger":"ghost"} onClick={()=>{ setMembers(ms=>ms.map(x=>x.id===m.id?{...x,active:!x.active}:x)); showToast("Updated"); }}>{m.active?"Deactivate":"Activate"}</Btn>
                </div>
              </Card>
            ))}
          </>
        )}
        {tab==="trainers"&&(
          <>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text }}>Trainers ({myTrainers.length})</div>
              <Btn small onClick={()=>setModal("addTrainer")}>+ Add</Btn>
            </div>
            {myTrainers.map(t=>(
              <Card key={t.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <Avatar name={t.name} color={C.amber} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:C.text }}>{t.name}</div>
                    <div style={{ fontSize:12, color:C.muted }}>{t.speciality}</div>
                    <div style={{ marginTop:6 }}><Badge color={t.active?C.green:C.red}>{t.active?"Active":"Inactive"}</Badge></div>
                  </div>
                  <Btn small variant={t.active?"danger":"ghost"} onClick={()=>{ setTrainers(ts=>ts.map(x=>x.id===t.id?{...x,active:!x.active}:x)); showToast("Updated"); }}>{t.active?"Remove":"Reinstate"}</Btn>
                </div>
              </Card>
            ))}
          </>
        )}
        {tab==="attendance"&&(
          <>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16 }}>Attendance Logs</div>
            {myAttendance.map(a=>{
              const usr=a.userType==="member"?myMembers.find(m=>m.id===a.userId):myTrainers.find(t=>t.id===a.userId);
              return (
                <Card key={a.id} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontWeight:600, color:C.text, fontSize:13 }}>{usr?.name||"Unknown"}</div>
                      <div style={{ fontSize:11, color:C.muted }}>{a.date} · {a.checkIn} → {a.checkOut||"ongoing"}</div>
                    </div>
                    <div style={{ display:"flex", gap:4, flexDirection:"column", alignItems:"flex-end" }}>
                      <Badge color={a.userType==="trainer"?C.amber:C.blue}>{a.userType}</Badge>
                      <Badge color={a.method==="biometric"?C.purple:C.green}>{a.method}</Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </>
        )}
        {tab==="classes"&&<ClassBooking classes={classes} setClasses={setClasses} gymId={gym.id} showToast={showToast} isAdmin={true} />}
        {tab==="content"&&(
          <>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text }}>Content</div>
              <Btn small onClick={()=>setModal("addContent")}>+ Post</Btn>
            </div>
            {ct.filter(c=>c.gymId===gym.id).map(c=>(
              <Card key={c.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                      <Badge color={c.type==="video"?C.red:c.type==="image"?C.blue:C.green}>{c.type}</Badge>
                      <Badge color={C.muted}>{c.category}</Badge>
                    </div>
                    <div style={{ fontWeight:700, color:C.text, marginBottom:4 }}>{c.title}</div>
                    <div style={{ fontSize:11, color:C.faint }}>{c.date} · {c.likes} likes</div>
                  </div>
                  <div style={{ fontSize:20, marginLeft:12 }}>{c.type==="video"?"▶":c.type==="image"?"🖼":"📝"}</div>
                </div>
              </Card>
            ))}
          </>
        )}
        {tab==="equipment"&&<EquipmentTracker equipment={equipment} setEquipment={setEquipment} gymId={gym.id} isAdmin={true} showToast={showToast} />}
        {tab==="feedback"&&(
          <>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16 }}>Member Feedback</div>
            {feedback.filter(f=>f.gymId===gym.id).map(f=>(
              <Card key={f.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", gap:10 }}>
                  <Avatar name={f.type==="anonymous"?"AN":f.user} color={f.type==="anonymous"?C.faint:C.blue} size={32} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:f.type==="anonymous"?C.muted:C.text }}>{f.type==="anonymous"?"Anonymous":f.user}</div>
                      <Badge color={f.type==="anonymous"?C.faint:C.blue}>{f.type}</Badge>
                    </div>
                    <div style={{ fontSize:13, color:C.text, lineHeight:1.5 }}>{f.message}</div>
                    <div style={{ fontSize:11, color:C.faint, marginTop:6 }}>{f.date}</div>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
        {tab==="benchmarks"&&<Benchmarking />}
        {tab==="calendar"&&(
          <>
            <SectionHeader title="Events" />
            {events.filter(e=>e.gymId===gym.id).map(e=>(
              <Card key={e.id} style={{ marginBottom:10, borderColor:`${C.accent}33` }}>
                <div style={{ fontWeight:700, color:C.text, marginBottom:4 }}>{e.title}</div>
                <div style={{ fontSize:12, color:C.muted }}>{e.date} · {e.time}</div>
                <div style={{ marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontSize:12, color:C.muted }}>{e.registered}/{e.slots} registered</div>
                  <div style={{ width:120, height:4, background:C.surface, borderRadius:2 }}><div style={{ width:`${(e.registered/e.slots)*100}%`, height:"100%", background:C.accent, borderRadius:2 }} /></div>
                </div>
              </Card>
            ))}
            <SectionHeader title="Holidays" action={<Btn small onClick={()=>setModal("addHoliday")}>+ Add</Btn>} />
            {holidays.filter(h=>h.gymId===gym.id).map(h=>(
              <Card key={h.id} style={{ marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div style={{ fontWeight:600, color:C.text }}>{h.name}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{h.date}</div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>

      {modal==="addMember"&&(<Modal title="Add Member" onClose={()=>{setModal(null);setForm({})}}>
        <Input label="Full Name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Arjun Sharma" />
        <Input label="Email" value={form.email||""} onChange={v=>setForm(f=>({...f,email:v}))} type="email" placeholder="arjun@email.com" />
        <Select label="Plan" value={form.plan||"Monthly"} onChange={v=>setForm(f=>({...f,plan:v}))} options={[{value:"Monthly",label:"Monthly"},{value:"Quarterly",label:"Quarterly"},{value:"Annual",label:"Annual"}]} />
        <Btn fullWidth onClick={()=>{ if(!form.name||!form.email)return; setMembers(m=>[...m,{id:Date.now(),gymId:gym.id,name:form.name,email:form.email,active:true,joined:todayStr,plan:form.plan||"Monthly",points:0,buddyOptIn:false}]); showToast("Member added!"); setModal(null); setForm({}); }}>Add Member</Btn>
      </Modal>)}
      {modal==="addTrainer"&&(<Modal title="Add Trainer" onClose={()=>{setModal(null);setForm({})}}>
        <Input label="Full Name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Trainer Name" />
        <Input label="Email" value={form.email||""} onChange={v=>setForm(f=>({...f,email:v}))} type="email" />
        <Input label="Speciality" value={form.speciality||""} onChange={v=>setForm(f=>({...f,speciality:v}))} placeholder="Strength & Conditioning" />
        <Btn fullWidth onClick={()=>{ if(!form.name||!form.email)return; setTrainers(t=>[...t,{id:Date.now(),gymId:gym.id,name:form.name,email:form.email,active:true,speciality:form.speciality||"General Fitness"}]); showToast("Trainer added!"); setModal(null); setForm({}); }}>Add Trainer</Btn>
      </Modal>)}
      {modal==="addHoliday"&&(<Modal title="Add Holiday" onClose={()=>{setModal(null);setForm({})}}>
        <Input label="Holiday Name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Republic Day" />
        <Input label="Date" value={form.date||""} onChange={v=>setForm(f=>({...f,date:v}))} type="date" />
        <Btn fullWidth onClick={()=>{ if(!form.date||!form.name)return; setHolidays(h=>[...h,{id:Date.now(),gymId:gym.id,date:form.date,name:form.name}]); showToast("Holiday added!"); setModal(null); setForm({}); }}>Add Holiday</Btn>
      </Modal>)}
      {modal==="addContent"&&(<Modal title="Post Content" onClose={()=>{setModal(null);setForm({})}}>
        <Input label="Title" value={form.title||""} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="Workout or nutrition tip..." />
        <Select label="Type" value={form.type||"text"} onChange={v=>setForm(f=>({...f,type:v}))} options={[{value:"text",label:"Article"},{value:"image",label:"Image"},{value:"video",label:"Video"}]} />
        <Select label="Category" value={form.category||"Workout"} onChange={v=>setForm(f=>({...f,category:v}))} options={[{value:"Workout",label:"Workout"},{value:"Nutrition",label:"Nutrition"},{value:"Wellness",label:"Wellness"},{value:"Flexibility",label:"Flexibility"}]} />
        <Btn fullWidth onClick={()=>{ if(!form.title)return; setContent(c=>[...c,{id:Date.now(),gymId:gym.id,type:form.type||"text",title:form.title,category:form.category||"Workout",likes:0,date:todayStr}]); showToast("Published!"); setModal(null); setForm({}); }}>Publish</Btn>
      </Modal>)}
    </div>
  );
};

// ─── TRAINER ──────────────────────────────────────────────────────────────────
const TrainerApp = ({ gyms, trainers, attendance, setAttendance, members, classes, setClasses, equipment, setEquipment, showToast }) => {
  const [tab,setTab]=useState("home");
  const gym=gyms[0], me=trainers[0];
  const myAtt=attendance.filter(a=>a.userType==="trainer"&&a.userId===me.id);
  const todayRecord=myAtt.find(a=>a.date===todayStr);
  const checkedIn=todayRecord&&!todayRecord.checkOut;
  const myMembers=members.filter(m=>m.gymId===gym.id&&m.active);

  return (
    <div style={{ background:C.bg, minHeight:"100vh", maxWidth:420, margin:"0 auto" }}>
      <div style={{ padding:"20px 20px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:11, color:C.amber, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>◎ Trainer</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:C.text }}>{me.name}</div>
          <div style={{ fontSize:12, color:C.muted }}>{me.speciality}</div>
        </div>
        <Avatar name={me.name} color={C.amber} size={44} />
      </div>
      <div style={{ display:"flex", gap:6, padding:"14px 20px 0", overflowX:"auto", scrollbarWidth:"none" }}>
        {[{id:"home",label:"Home"},{id:"attendance",label:"Attendance"},{id:"members",label:"Members"},{id:"classes",label:"Classes"},{id:"equipment",label:"Equipment"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ background:tab===t.id?`${C.amber}22`:"transparent", border:`1px solid ${tab===t.id?C.amber:C.border}`, borderRadius:20, padding:"5px 12px", fontSize:11, fontWeight:600, color:tab===t.id?C.amber:C.muted, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>{t.label}</button>
        ))}
      </div>
      <div style={{ padding:20, paddingBottom:40 }}>
        {tab==="home"&&(
          <>
            <Card style={{ marginBottom:20, border:`1.5px solid ${checkedIn?C.green+"66":C.amber+"44"}`, textAlign:"center", padding:28 }}>
              {!todayRecord?(
                <><div style={{ fontSize:13, color:C.muted, marginBottom:16 }}>Tap to check in for today</div><Btn onClick={()=>{ const t=new Date().toTimeString().slice(0,5); setAttendance(a=>[...a,{id:Date.now(),userId:me.id,userType:"trainer",gymId:gym.id,date:todayStr,checkIn:t,checkOut:null,method:"qr"}]); showToast("Checked in!"); }}>Check In Now</Btn></>
              ):!todayRecord.checkOut?(
                <><div style={{ fontSize:32, marginBottom:8 }}>✓</div><div style={{ fontSize:15, fontWeight:700, color:C.green, marginBottom:4 }}>Checked In</div><div style={{ fontSize:13, color:C.muted, marginBottom:16 }}>Since {todayRecord.checkIn}</div><Btn variant="danger" onClick={()=>{ const t=new Date().toTimeString().slice(0,5); setAttendance(a=>a.map(x=>x.id===todayRecord.id?{...x,checkOut:t}:x)); showToast("Checked out!"); }}>Check Out</Btn></>
              ):(
                <div style={{ padding:"12px 16px", background:`${C.green}18`, borderRadius:8 }}>
                  <div style={{ fontSize:14, color:C.green, fontWeight:600 }}>Session complete · {todayRecord.checkIn} – {todayRecord.checkOut}</div>
                </div>
              )}
            </Card>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <Stat label="This Week" value={myAtt.length} color={C.amber} />
              <Stat label="Active Members" value={myMembers.length} />
            </div>
          </>
        )}
        {tab==="attendance"&&(
          <>
            <SectionHeader title="My Attendance" />
            {myAtt.map(a=>(
              <Card key={a.id} style={{ marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div><div style={{ fontWeight:600, color:C.text }}>{a.date}</div><div style={{ fontSize:12, color:C.muted }}>{a.checkIn} → {a.checkOut||"ongoing"}</div></div>
                  <Badge color={C.green}>{a.method}</Badge>
                </div>
              </Card>
            ))}
            <SectionHeader title="Members Today" />
            {attendance.filter(a=>a.gymId===gym.id&&a.date===todayStr&&a.userType==="member").map(a=>{
              const m=members.find(x=>x.id===a.userId);
              return (
                <Card key={a.id} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <Avatar name={m?.name||"?"} size={30} color={C.blue} />
                      <div><div style={{ fontSize:13, fontWeight:600, color:C.text }}>{m?.name}</div><div style={{ fontSize:11, color:C.muted }}>{a.checkIn}</div></div>
                    </div>
                    <Badge color={C.green}>Present</Badge>
                  </div>
                </Card>
              );
            })}
          </>
        )}
        {tab==="members"&&(
          <>{myMembers.map(m=>(
            <Card key={m.id} style={{ marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <Avatar name={m.name} color={C.blue} />
                <div><div style={{ fontWeight:600, color:C.text }}>{m.name}</div><div style={{ fontSize:12, color:C.muted }}>{m.plan} plan</div></div>
              </div>
            </Card>
          ))}</>
        )}
        {tab==="classes"&&<ClassBooking classes={classes} setClasses={setClasses} gymId={gym.id} showToast={showToast} isAdmin={false} />}
        {tab==="equipment"&&<EquipmentTracker equipment={equipment} setEquipment={setEquipment} gymId={gym.id} isAdmin={false} showToast={showToast} />}
      </div>
    </div>
  );
};

// ─── MEMBER ───────────────────────────────────────────────────────────────────
const MemberApp = ({ gyms, members, attendance, setAttendance, content:ct, events, transformations, feedback, setFeedback, classes, setClasses, equipment, setEquipment, metrics, setMetrics, challenges, showToast }) => {
  const [tab,setTab]=useState("home");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [scanning,setScanning]=useState(false);
  const gym=gyms[0], me=members[0];
  const myAtt=attendance.filter(a=>a.userId===me.id&&a.userType==="member");
  const todayRecord=myAtt.find(a=>a.date===todayStr);
  const checkedIn=todayRecord&&!todayRecord.checkOut;

  const doCheckIn=()=>{ if(todayRecord)return; setScanning(true); setTimeout(()=>{ const t=new Date().toTimeString().slice(0,5); setAttendance(a=>[...a,{id:Date.now(),userId:me.id,userType:"member",gymId:gym.id,date:todayStr,checkIn:t,checkOut:null,method:"qr"}]); setScanning(false); showToast("Welcome! Checked in ✓"); },1800); };
  const doCheckOut=()=>{ const t=new Date().toTimeString().slice(0,5); setAttendance(a=>a.map(x=>x.id===todayRecord.id?{...x,checkOut:t}:x)); showToast("See you tomorrow! 💪"); };

  const tabs=[{id:"home",label:"Home",icon:"◉"},{id:"checkin",label:"Check In",icon:"⬡"},{id:"feed",label:"Feed",icon:"◈"},{id:"classes",label:"Classes",icon:"📅"},{id:"more",label:"More",icon:"···"}];

  const quickActions=[
    {label:"Feedback",icon:"💬",color:C.blue,action:()=>setModal("feedback")},
    {label:"My Progress",icon:"📏",color:C.teal,action:()=>setModal("metrics")},
    {label:"Challenges",icon:"🏆",color:C.amber,action:()=>setModal("challenges")},
    {label:"Buddy Match",icon:"👫",color:C.pink,action:()=>setModal("buddy")},
    {label:"Equipment",icon:"🔧",color:C.orange,action:()=>setModal("equipment")},
    {label:"Partners",icon:"🤝",color:C.purple,action:()=>setModal("partners")},
  ];

  return (
    <div style={{ background:C.bg, minHeight:"100vh", maxWidth:420, margin:"0 auto", paddingBottom:80 }}>
      <div style={{ padding:"20px 20px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:11, color:C.blue, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>◉ Member</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:C.text }}>Hey, {me.name.split(" ")[0]} 👋</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:20, fontWeight:800, color:C.accent, fontFamily:"'Bebas Neue',sans-serif" }}>{me.points}</div>
          <div style={{ fontSize:10, color:C.muted, fontWeight:600 }}>REWARD PTS</div>
        </div>
      </div>

      <div style={{ padding:"0 20px 14px" }}>
        {tab==="home"&&(
          <>
            <Card style={{ marginBottom:16, background:checkedIn?`${C.green}0A`:C.card, borderColor:checkedIn?`${C.green}44`:C.border }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>Today's status</div>
                  <div style={{ fontSize:15, fontWeight:700, color:checkedIn?C.green:todayRecord?C.text:C.muted }}>
                    {checkedIn?`✓ At gym since ${todayRecord.checkIn}`:todayRecord?"Session complete":"Not checked in yet"}
                  </div>
                </div>
                {!todayRecord&&<Btn small onClick={()=>setTab("checkin")}>Check In →</Btn>}
              </div>
            </Card>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              <Stat label="Total Sessions" value={myAtt.length} />
              <Stat label="Reward Points" value={me.points} color={C.accent} />
            </div>
            <SectionHeader title="Quick Actions" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 }}>
              {quickActions.map(q=>(
                <Card key={q.label} onClick={q.action} style={{ textAlign:"center", padding:"12px 8px", cursor:"pointer", border:`1px solid ${q.color}33` }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>{q.icon}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:q.color }}>{q.label}</div>
                </Card>
              ))}
            </div>
            <SectionHeader title="Transformation Stories" />
            {transformations.filter(t=>t.gymId===gym.id).map(t=>(
              <Card key={t.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", gap:12 }}>
                  <div style={{ textAlign:"center", minWidth:68, background:C.surface, borderRadius:8, padding:8 }}>
                    <div style={{ fontSize:10, color:C.muted }}>Before</div>
                    <div style={{ fontSize:16, fontWeight:800, color:C.red, fontFamily:"'Bebas Neue',sans-serif" }}>{t.before}</div>
                    <div style={{ fontSize:16, color:C.accent }}>→</div>
                    <div style={{ fontSize:10, color:C.muted }}>After</div>
                    <div style={{ fontSize:16, fontWeight:800, color:C.green, fontFamily:"'Bebas Neue',sans-serif" }}>{t.after}</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:C.text, marginBottom:4 }}>{t.member}</div>
                    <div style={{ fontSize:12, color:C.muted, marginBottom:6, lineHeight:1.5 }}>{t.story}</div>
                    <Badge color={C.accent}>{t.duration}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {tab==="checkin"&&(
          <div style={{ textAlign:"center", paddingTop:20 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:C.text, marginBottom:4 }}>{gym.name}</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:28 }}>{gym.location}</div>
            {scanning?(<div style={{ padding:40 }}><div style={{ fontSize:48, marginBottom:16 }}>📷</div><div style={{ fontSize:15, color:C.accent, fontWeight:600 }}>Scanning...</div></div>)
            :!todayRecord?(
              <><div style={{ width:170, height:170, background:C.surface, borderRadius:16, margin:"0 auto 24px", display:"flex", alignItems:"center", justifyContent:"center", border:`1.5px solid ${C.border}` }}><QRDisplay gymId={gym.id} /></div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Point your camera at the gym QR code.</div>
              <Btn onClick={doCheckIn}>📷 Scan & Check In</Btn></>
            ):!todayRecord.checkOut?(
              <><div style={{ width:100, height:100, borderRadius:"50%", background:`${C.green}18`, border:`2px solid ${C.green}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:40 }}>✓</div>
              <div style={{ fontSize:22, fontWeight:800, color:C.green, marginBottom:4, fontFamily:"'Bebas Neue',sans-serif" }}>YOU'RE IN!</div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Since {todayRecord.checkIn}</div>
              <Btn variant="danger" onClick={doCheckOut}>Check Out</Btn></>
            ):(
              <div style={{ padding:24 }}>
                <div style={{ fontSize:40, marginBottom:16 }}>🏋️</div>
                <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:8 }}>Great workout!</div>
                <div style={{ fontSize:13, color:C.muted }}>{todayRecord.checkIn} – {todayRecord.checkOut}</div>
              </div>
            )}
          </div>
        )}

        {tab==="feed"&&(
          <>{ct.filter(c=>c.gymId===gym.id).map(c=>(
            <Card key={c.id} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", gap:12 }}>
                <div style={{ width:52, height:52, borderRadius:10, background:c.type==="video"?`${C.red}22`:c.type==="image"?`${C.blue}22`:`${C.green}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{c.type==="video"?"▶":c.type==="image"?"🖼":"📖"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:6, marginBottom:6 }}><Badge color={c.type==="video"?C.red:c.type==="image"?C.blue:C.green}>{c.type}</Badge><Badge color={C.muted}>{c.category}</Badge></div>
                  <div style={{ fontWeight:700, color:C.text, marginBottom:4 }}>{c.title}</div>
                  <div style={{ fontSize:11, color:C.faint }}>{c.date} · ♥ {c.likes}</div>
                </div>
              </div>
            </Card>
          ))}</>
        )}

        {tab==="classes"&&(
          <><div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16 }}>Book a Class</div>
          <ClassBooking classes={classes} setClasses={setClasses} gymId={gym.id} showToast={showToast} isAdmin={false} /></>
        )}

        {tab==="more"&&(
          <>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16 }}>All Features</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {[
                {label:"Body Metrics",icon:"📏",color:C.teal,action:()=>setModal("metrics")},
                {label:"Challenges",icon:"🏆",color:C.amber,action:()=>setModal("challenges")},
                {label:"Buddy Match",icon:"👫",color:C.pink,action:()=>setModal("buddy")},
                {label:"Equipment",icon:"🔧",color:C.orange,action:()=>setModal("equipment")},
                {label:"Partner Brands",icon:"🤝",color:C.purple,action:()=>setModal("partners")},
                {label:"Events",icon:"📅",color:C.green,action:()=>setModal("events")},
                {label:"Feedback",icon:"💬",color:C.blue,action:()=>setModal("feedback")},
                {label:"Refer a Friend",icon:"👥",color:C.accent,action:()=>showToast("Referral link copied!")},
              ].map(item=>(
                <Card key={item.label} onClick={item.action} style={{ textAlign:"center", padding:"14px 10px", cursor:"pointer", border:`1px solid ${item.color}33` }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{item.icon}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:item.color }}>{item.label}</div>
                </Card>
              ))}
            </div>
            <Card>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <Avatar name={me.name} size={44} color={C.blue} />
                <div>
                  <div style={{ fontWeight:700, color:C.text }}>{me.name}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{me.email}</div>
                  <div style={{ display:"flex", gap:6, marginTop:6 }}><Badge color={C.blue}>{me.plan}</Badge><Badge color={C.green}>Active</Badge></div>
                </div>
              </div>
              <div style={{ background:C.surface, borderRadius:10, padding:"10px 14px" }}>
                <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Referral code</div>
                <div style={{ fontFamily:"monospace", fontSize:16, fontWeight:800, color:C.accent, letterSpacing:"0.1em" }}>IRON-{me.id}XY9</div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:420, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", padding:"8px 0 16px" }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", padding:"6px 0", color:tab===t.id?C.accent:C.faint, fontSize:10, fontWeight:600, fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <span style={{ fontSize:16 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* All Modals */}
      {modal==="feedback"&&(
        <Modal title="Share Feedback" onClose={()=>{setModal(null);setForm({})}}>
          <div style={{ marginBottom:14 }}>
            <textarea value={form.message||""} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Tell us what you think..." rows={4}
              style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:14, fontFamily:"inherit", resize:"none", boxSizing:"border-box", outline:"none" }} />
          </div>
          <label style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, cursor:"pointer" }}>
            <input type="checkbox" checked={!!form.anonymous} onChange={e=>setForm(f=>({...f,anonymous:e.target.checked}))} />
            <span style={{ fontSize:13, color:C.muted }}>Submit anonymously</span>
          </label>
          <Btn fullWidth onClick={()=>{ if(!form.message)return; setFeedback(fb=>[...fb,{id:Date.now(),gymId:gym.id,user:form.anonymous?"Anonymous":me.name,message:form.message,date:todayStr,type:form.anonymous?"anonymous":"named"}]); showToast("Feedback submitted!"); setModal(null); setForm({}); }}>Submit Feedback</Btn>
        </Modal>
      )}
      {modal==="metrics"&&(
        <Modal title="Body Metrics" onClose={()=>setModal(null)}>
          <BodyMetrics metrics={metrics} setMetrics={setMetrics} memberId={me.id} showToast={showToast} />
        </Modal>
      )}
      {modal==="challenges"&&(
        <Modal title="Active Challenges" onClose={()=>setModal(null)}>
          <Challenges challenges={challenges} gymId={gym.id} memberId={me.id} showToast={showToast} />
        </Modal>
      )}
      {modal==="buddy"&&(
        <Modal title="Workout Buddy" onClose={()=>setModal(null)}>
          <BuddyMatch members={members} gymId={gym.id} memberId={me.id} showToast={showToast} />
        </Modal>
      )}
      {modal==="equipment"&&(
        <Modal title="Equipment Issues" onClose={()=>setModal(null)}>
          <EquipmentTracker equipment={equipment} setEquipment={setEquipment} gymId={gym.id} isAdmin={false} showToast={showToast} />
        </Modal>
      )}
      {modal==="partners"&&(
        <Modal title="Partner Brands" onClose={()=>setModal(null)}>
          <PartnerBrands showToast={showToast} />
        </Modal>
      )}
      {modal==="events"&&(
        <Modal title="Events" onClose={()=>setModal(null)}>
          {events.filter(e=>e.gymId===gym.id).map(e=>(
            <Card key={e.id} style={{ marginBottom:12, borderColor:`${C.accent}33` }}>
              <div style={{ fontWeight:700, color:C.text, marginBottom:4 }}>{e.title}</div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:12 }}>{e.date} · {e.time}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>{e.registered}/{e.slots} registered</div>
                  <div style={{ width:140, height:4, background:C.surface, borderRadius:2 }}><div style={{ width:`${(e.registered/e.slots)*100}%`, height:"100%", background:C.accent, borderRadius:2 }} /></div>
                </div>
                <Btn small onClick={()=>showToast("Registered! 🎉")}>Register</Btn>
              </div>
            </Card>
          ))}
        </Modal>
      )}
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [role,setRole]=useState(null);
  const [toast,setToast]=useState(null);
  const [gyms,setGyms]=useState(initialGyms);
  const [members,setMembers]=useState(initialMembers);
  const [trainers,setTrainers]=useState(initialTrainers);
  const [attendance,setAttendance]=useState(initialAttendance);
  const [ct,setCt]=useState(content);
  const [fb,setFb]=useState(feedbacks);
  const [hl,setHl]=useState(holidays);
  const [classes,setClasses]=useState(initialClasses);
  const [equipment,setEquipment]=useState(initialEquipment);
  const [metrics,setMetrics]=useState(initialMetrics);
  const [challenges]=useState(initialChallenges);

  useEffect(()=>{ const l=document.createElement("link"); l.rel="stylesheet"; l.href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"; document.head.appendChild(l); },[]);

  const showToast=(msg)=>{ setToast(msg); setTimeout(()=>setToast(null),2400); };

  if (!role) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif" }}>
      <div style={{ fontSize:11, color:C.muted, letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:600, marginBottom:6 }}>Welcome to</div>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:C.text, letterSpacing:"0.06em", lineHeight:1, marginBottom:4 }}>IRONFORGE</div>
      <div style={{ fontSize:11, color:C.accent, letterSpacing:"0.14em", marginBottom:6, fontWeight:600 }}>GYM MANAGEMENT · POWERED BY VAULTR</div>
      <div style={{ fontSize:11, color:C.faint, marginBottom:36, textAlign:"center", lineHeight:1.6 }}>Now with 7 new features: class booking · body metrics<br/>challenges · buddy match · equipment tracker · partners · benchmarks</div>
      <div style={{ width:"100%", maxWidth:360 }}>
        <div style={{ fontSize:13, color:C.muted, marginBottom:14, textAlign:"center" }}>Select your role to continue</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          {Object.entries(roles).map(([key,r])=>(
            <div key={key} onClick={()=>setRole(key)} style={{ background:C.card, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"18px 12px", cursor:"pointer", textAlign:"center", transition:"all 0.2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=r.color; e.currentTarget.style.background=`${r.color}18`; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.card; }}>
              <div style={{ fontSize:24, marginBottom:8, color:r.color }}>{r.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{r.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const shared={ gyms, setGyms, members, setMembers, trainers, setTrainers, attendance, setAttendance, content:ct, setContent:setCt, feedback:fb, setFeedback:setFb, events, transformations, holidays:hl, setHolidays:setHl, classes, setClasses, equipment, setEquipment, metrics, setMetrics, challenges, showToast };

  return (
    <div style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", background:C.bg, minHeight:"100vh" }}>
      <div style={{ position:"fixed", top:14, right:16, zIndex:500 }}>
        <button onClick={()=>setRole(null)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:"5px 12px", fontSize:11, color:C.muted, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>⟵ Switch Role</button>
      </div>
      {role==="superadmin"&&<SuperAdminApp {...shared} />}
      {role==="gymadmin"  &&<GymAdminApp   {...shared} />}
      {role==="trainer"   &&<TrainerApp     {...shared} />}
      {role==="member"    &&<MemberApp      {...shared} />}
      {toast&&<Toast msg={toast} />}
    </div>
  );
}
