import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://YOUR_PROJECT.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || "YOUR_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:"#0A0A0B",surface:"#111114",card:"#18181C",border:"#2A2A30",
  borderLight:"#333340",accent:"#E8FF47",accentDim:"#B8CC2A",
  accentGlow:"rgba(232,255,71,0.15)",red:"#FF4D4D",redDim:"#CC2222",
  green:"#22C55E",blue:"#3B82F6",amber:"#F59E0B",purple:"#A855F7",
  teal:"#14B8A6",orange:"#F97316",pink:"#EC4899",
  text:"#F0F0F2",muted:"#8888A0",faint:"#444458",
};

const TIER_CONFIG = {
  platinum: { color:"#E5E4E2", label:"Platinum", bg:"#E5E4E222" },
  gold:     { color:"#F59E0B", label:"Gold",     bg:"#F59E0B22" },
  silver:   { color:"#94A3B8", label:"Silver",   bg:"#94A3B822" },
};

const todayStr = new Date().toISOString().slice(0,10);

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ children, color=C.muted, bg }) => (
  <span style={{ display:"inline-block",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:"0.04em",color,background:bg||`${color}22`,border:`1px solid ${color}44` }}>{children}</span>
);

const TierBadge = ({ tier }) => {
  const t = TIER_CONFIG[tier] || TIER_CONFIG.silver;
  return <Badge color={t.color} bg={t.bg}>{t.label}</Badge>;
};

const Btn = ({ children, onClick, variant="primary", small, fullWidth, disabled, loading }) => {
  const isPrimary=variant==="primary",isDanger=variant==="danger",isGhost=variant==="ghost";
  const bg=disabled||loading?C.faint:isPrimary?C.accent:isDanger?C.red:"transparent";
  const tc=disabled||loading?C.muted:isPrimary?"#0A0A0B":isDanger?"#fff":C.muted;
  return (
    <button onClick={disabled||loading?undefined:onClick} style={{ background:bg,color:tc,border:isGhost?`1px solid ${C.border}`:"none",borderRadius:10,padding:small?"6px 14px":"10px 20px",fontSize:small?12:14,fontWeight:600,cursor:disabled||loading?"not-allowed":"pointer",width:fullWidth?"100%":"auto",fontFamily:"inherit",transition:"all 0.15s",opacity:disabled||loading?0.6:1,letterSpacing:"0.02em" }}>
      {loading ? "Saving…" : children}
    </button>
  );
};

const Card = ({ children, style, onClick, highlight }) => (
  <div onClick={onClick} style={{ background:C.card,border:`1px solid ${highlight?C.accent+"66":C.border}`,borderRadius:14,padding:16,cursor:onClick?"pointer":"default",transition:"border-color 0.2s",...style }}>{children}</div>
);

const Input = ({ label, value, onChange, placeholder, type="text", required }) => (
  <div style={{ marginBottom:14 }}>
    {label && <div style={{ fontSize:12,color:C.muted,marginBottom:6,fontWeight:500 }}>{label}{required&&<span style={{ color:C.red }}> *</span>}</div>}
    <input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",outline:"none" }} />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows=3 }) => (
  <div style={{ marginBottom:14 }}>
    {label && <div style={{ fontSize:12,color:C.muted,marginBottom:6,fontWeight:500 }}>{label}</div>}
    <textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",outline:"none" }} />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom:14 }}>
    {label && <div style={{ fontSize:12,color:C.muted,marginBottom:6,fontWeight:500 }}>{label}</div>}
    <select value={value||""} onChange={e=>onChange(e.target.value)}
      style={{ width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,fontFamily:"inherit",outline:"none" }}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Stat = ({ label, value, color }) => (
  <div style={{ background:C.surface,borderRadius:12,padding:"14px 16px",border:`1px solid ${C.border}` }}>
    <div style={{ fontSize:11,color:C.muted,marginBottom:6,fontWeight:500,letterSpacing:"0.05em",textTransform:"uppercase" }}>{label}</div>
    <div style={{ fontSize:26,fontWeight:700,color:color||C.text,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:"0.02em" }}>{value}</div>
  </div>
);

const Modal = ({ title, children, onClose, wide }) => (
  <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,overflowY:"auto" }}
    onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:24,width:"100%",maxWidth:wide?600:440,maxHeight:"88vh",overflowY:"auto" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
        <div style={{ fontSize:16,fontWeight:700,color:C.text }}>{title}</div>
        <button onClick={onClose} style={{ background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer" }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const Toast = ({ msg, type="success" }) => (
  <div style={{ position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:type==="error"?C.red:C.accent,color:type==="error"?"#fff":"#0A0A0B",padding:"10px 20px",borderRadius:50,fontWeight:700,fontSize:13,zIndex:2000,whiteSpace:"nowrap",boxShadow:`0 4px 24px ${C.accentGlow}` }}>{msg}</div>
);

const SectionHeader = ({ title, action }) => (
  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
    <div style={{ fontSize:13,fontWeight:700,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase" }}>{title}</div>
    {action}
  </div>
);

const Avatar = ({ name, size=36, color=C.accent, photoUrl }) => (
  photoUrl
    ? <img src={photoUrl} alt={name} style={{ width:size,height:size,borderRadius:"50%",objectFit:"cover",border:`1px solid ${color}66`,flexShrink:0 }} />
    : <div style={{ width:size,height:size,borderRadius:"50%",background:`${color}22`,border:`1px solid ${color}66`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.35,fontWeight:700,color,flexShrink:0 }}>
        {name?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
      </div>
);

const HeatBar = ({ hour, count, max }) => {
  const pct=count/max;
  const col=pct>0.75?C.red:pct>0.5?C.accent:pct>0.25?C.amber:C.blue;
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1 }}>
      <div style={{ fontSize:10,color:C.muted,fontWeight:600 }}>{count}</div>
      <div style={{ width:"100%",height:80,background:C.surface,borderRadius:4,display:"flex",alignItems:"flex-end" }}>
        <div style={{ width:"100%",height:`${pct*100}%`,background:col,borderRadius:4 }} />
      </div>
      <div style={{ fontSize:9,color:C.faint,transform:"rotate(-30deg)",transformOrigin:"top center",marginTop:4 }}>{hour}</div>
    </div>
  );
};

const LoadingBar = ({ show }) => show
  ? <div style={{ height:2,background:C.accent,margin:"8px 20px 0",borderRadius:2,opacity:0.8 }} />
  : null;

const InfoRow = ({ label, value }) => value ? (
  <div style={{ display:"flex",gap:8,marginBottom:8,fontSize:13 }}>
    <span style={{ color:C.muted,minWidth:110,flexShrink:0 }}>{label}</span>
    <span style={{ color:C.text }}>{value}</span>
  </div>
) : null;

const peakData = [
  {hour:"5am",count:12},{hour:"6am",count:38},{hour:"7am",count:62},
  {hour:"8am",count:55},{hour:"9am",count:41},{hour:"10am",count:28},
  {hour:"11am",count:19},{hour:"12pm",count:22},{hour:"1pm",count:15},
  {hour:"2pm",count:11},{hour:"3pm",count:18},{hour:"4pm",count:32},
  {hour:"5pm",count:58},{hour:"6pm",count:71},{hour:"7pm",count:64},
  {hour:"8pm",count:45},{hour:"9pm",count:22},{hour:"10pm",count:8},
];

const benchmarks = {
  avgRetention:{yours:78,market:62,unit:"%",better:"higher"},
  revenuePerMember:{yours:1850,market:1420,unit:"₹/mo",better:"higher"},
  peakHourFill:{yours:71,market:58,unit:"%",better:"higher"},
  trainerRatio:{yours:18,market:22,unit:"members/trainer",better:"lower"},
  avgCheckins:{yours:14,market:9,unit:"visits/month",better:"higher"},
  contentEngagement:{yours:34,market:18,unit:"%",better:"higher"},
};

// ─── DB HELPERS ───────────────────────────────────────────────────────────────
const db = {
  // Generic load
  load: async (table, filters={}) => {
    let q = supabase.from(table).select("*");
    Object.entries(filters).forEach(([k,v]) => { q = q.eq(k,v); });
    const { data, error } = await q.order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  // Insert and return row
  insert: async (table, row) => {
    const { data, error } = await supabase.from(table).insert([row]).select().single();
    if (error) throw error;
    return data;
  },
  // Update
  update: async (table, id, updates) => {
    const { data, error } = await supabase.from(table).update({...updates, updated_at: new Date().toISOString()}).eq("id",id).select().single();
    if (error) throw error;
    return data;
  },
  // Delete
  delete: async (table, id) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
  },
};

// Map Supabase snake_case → app camelCase
const mapGym     = g => g ? ({ ...g, gymId: g.id }) : null;
const mapMember  = m => m ? ({ ...m, gymId: m.gym_id, buddyOptIn: m.buddy_opt_in, photoUrl: m.profile_photo_url, dob: m.date_of_birth, heightCm: m.height_cm, weightKg: m.weight_kg, healthIssues: m.health_issues, emergencyName: m.emergency_contact_name, emergencyPhone: m.emergency_contact_phone, emergencyRelation: m.emergency_contact_relation, profileVisibility: m.profile_visibility }) : null;
const mapTrainer = t => t ? ({ ...t, gymId: t.gym_id, photoUrl: t.profile_photo_url, expYears: t.experience_years, transformationCount: t.transformation_count }) : null;
const mapAtt     = a => a ? ({ ...a, gymId: a.gym_id, userId: a.user_id, userType: a.user_type, checkIn: a.check_in, checkOut: a.check_out }) : null;

// ─── SCREENS ──────────────────────────────────────────────────────────────────

// GYM PROFILE
const GymProfile = ({ gym, onSave, showToast }) => {
  const [form, setForm] = useState({ ...gym });
  const [saving, setSaving] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const save = async () => {
    setSaving(true);
    try {
      await db.update("gyms", gym.id, {
        name: form.name, address: form.address, phone: form.phone,
        email: form.email, website: form.website, gst_number: form.gst_number,
        timings: form.timings, packages: form.packages,
        amenities: form.amenities, facilities: form.facilities,
        latitude: form.latitude, longitude: form.longitude,
        map_embed_url: form.map_embed_url, logo_url: form.logo_url,
      });
      onSave({ ...form });
      showToast("Gym profile saved!");
    } catch(e) { showToast("Error: "+e.message,"error"); }
    setSaving(false);
  };

  return (
    <div>
      {form.logo_url && <img src={form.logo_url} alt="logo" style={{ width:80,height:80,borderRadius:12,objectFit:"cover",marginBottom:12,border:`1px solid ${C.border}` }} />}
      <Input label="Gym Name" value={form.name} onChange={v=>f("name",v)} required />
      <Input label="Address" value={form.address} onChange={v=>f("address",v)} placeholder="123 Main St, Koramangala" />
      <Input label="Phone" value={form.phone} onChange={v=>f("phone",v)} placeholder="+91 98765 43210" type="tel" />
      <Input label="Email" value={form.email} onChange={v=>f("email",v)} placeholder="gym@email.com" type="email" />
      <Input label="Website" value={form.website} onChange={v=>f("website",v)} placeholder="https://ironforge.in" />
      <Input label="GST Number" value={form.gst_number} onChange={v=>f("gst_number",v)} placeholder="29ABCDE1234F1Z5" />
      <Input label="Logo URL" value={form.logo_url} onChange={v=>f("logo_url",v)} placeholder="https://..." />
      <Input label="Timings (e.g. 5 AM – 11 PM)" value={typeof form.timings === "string" ? form.timings : form.timings?.default || ""} onChange={v=>f("timings",{default:v})} placeholder="5 AM – 11 PM, all days" />
      <Textarea label="Packages (one per line, e.g. Monthly – ₹1500)" value={Array.isArray(form.packages)?form.packages.map(p=>`${p.name} – ${p.price}`).join("\n"):""} onChange={v=>f("packages",v.split("\n").filter(Boolean).map(l=>{ const [name,...rest]=l.split("–"); return {name:name?.trim(),price:rest.join("–")?.trim()}; }))} />
      <Textarea label="Amenities (comma separated)" value={Array.isArray(form.amenities)?form.amenities.join(", "):(form.amenities||"")} onChange={v=>f("amenities",v.split(",").map(s=>s.trim()).filter(Boolean))} placeholder="AC, Parking, Locker Room, WiFi" />
      <Textarea label="Facilities (comma separated)" value={Array.isArray(form.facilities)?form.facilities.join(", "):(form.facilities||"")} onChange={v=>f("facilities",v.split(",").map(s=>s.trim()).filter(Boolean))} placeholder="Swimming Pool, Sauna, Cardio Zone" />
      <Input label="Google Maps Embed URL" value={form.map_embed_url} onChange={v=>f("map_embed_url",v)} placeholder="https://maps.google.com/..." />
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
        <Input label="Latitude" value={form.latitude} onChange={v=>f("latitude",v)} placeholder="12.9352" />
        <Input label="Longitude" value={form.longitude} onChange={v=>f("longitude",v)} placeholder="77.6245" />
      </div>
      <Btn fullWidth loading={saving} onClick={save}>Save Gym Profile</Btn>
    </div>
  );
};

// GYM REVIEWS
const GymReviews = ({ gymId, showToast }) => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating:5, review:"" });
  const [modal, setModal] = useState(false);
  const avg = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : "—";

  useEffect(()=>{
    db.load("gym_reviews",{gym_id:gymId}).then(data=>setReviews(data)).catch(()=>{});
  },[gymId]);

  const submit = async () => {
    try {
      const row = await db.insert("gym_reviews",{ gym_id:gymId, member_name:form.name||"Guest", rating:form.rating, review:form.review });
      setReviews(r=>[row,...r]);
      showToast("Review submitted!");
      setModal(false); setForm({rating:5,review:""});
    } catch(e){ showToast("Error: "+e.message,"error"); }
  };

  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:16 }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:36,fontWeight:700,color:C.accent,fontFamily:"'Bebas Neue',sans-serif" }}>{avg}</div>
          <div style={{ fontSize:11,color:C.muted }}>{reviews.length} reviews</div>
        </div>
        <Btn small onClick={()=>setModal(true)}>+ Write Review</Btn>
      </div>
      {reviews.map(r=>(
        <Card key={r.id} style={{ marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ fontWeight:600,color:C.text }}>{r.member_name||"Member"}</div>
            <div style={{ color:C.amber }}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
          </div>
          <div style={{ fontSize:13,color:C.muted,lineHeight:1.5 }}>{r.review}</div>
          <div style={{ fontSize:11,color:C.faint,marginTop:6 }}>{r.created_at?.slice(0,10)}</div>
        </Card>
      ))}
      {modal&&(
        <Modal title="Write a Review" onClose={()=>setModal(false)}>
          <Input label="Your Name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Arjun Sharma" />
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12,color:C.muted,marginBottom:8,fontWeight:500 }}>Rating</div>
            <div style={{ display:"flex",gap:8 }}>
              {[1,2,3,4,5].map(n=>(
                <div key={n} onClick={()=>setForm(f=>({...f,rating:n}))} style={{ fontSize:28,cursor:"pointer",color:n<=form.rating?C.amber:C.faint }}>★</div>
              ))}
            </div>
          </div>
          <Textarea label="Your review" value={form.review} onChange={v=>setForm(f=>({...f,review:v}))} placeholder="Tell others about your experience..." rows={4} />
          <Btn fullWidth onClick={submit}>Submit Review</Btn>
        </Modal>
      )}
    </div>
  );
};

// MEMBER FORM (Add / Edit)
const MemberForm = ({ initial={}, gymId, onSave, showToast, loading }) => {
  const [form, setForm] = useState({
    name:"",email:"",phone:"",address:"",plan:"Monthly",
    date_of_birth:"",height_cm:"",weight_kg:"",health_issues:"",
    emergency_contact_name:"",emergency_contact_phone:"",emergency_contact_relation:"",
    profile_photo_url:"",profile_visibility:"private",buddy_opt_in:false,
    ...initial
  });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <div>
      {form.profile_photo_url&&<img src={form.profile_photo_url} alt="photo" style={{ width:70,height:70,borderRadius:"50%",objectFit:"cover",marginBottom:12,border:`1px solid ${C.border}` }}/>}
      <div style={{ fontSize:12,color:C.accent,fontWeight:700,marginBottom:10,letterSpacing:"0.06em" }}>BASIC INFO</div>
      <Input label="Full Name" value={form.name} onChange={v=>f("name",v)} placeholder="Arjun Sharma" required />
      <Input label="Email" value={form.email} onChange={v=>f("email",v)} type="email" placeholder="arjun@email.com" />
      <Input label="Phone" value={form.phone} onChange={v=>f("phone",v)} type="tel" placeholder="+91 98765 43210" />
      <Input label="Address" value={form.address} onChange={v=>f("address",v)} placeholder="Flat 4B, Brigade Road" />
      <Input label="Date of Birth" value={form.date_of_birth} onChange={v=>f("date_of_birth",v)} type="date" />
      <Input label="Profile Photo URL" value={form.profile_photo_url} onChange={v=>f("profile_photo_url",v)} placeholder="https://..." />
      <Select label="Membership Plan" value={form.plan} onChange={v=>f("plan",v)} options={[{value:"Monthly",label:"Monthly"},{value:"Quarterly",label:"Quarterly"},{value:"Annual",label:"Annual"},{value:"Day Pass",label:"Day Pass"}]} />
      <Select label="Profile Visibility" value={form.profile_visibility} onChange={v=>f("profile_visibility",v)} options={[{value:"private",label:"Private"},{value:"buddies",label:"Buddies only"},{value:"public",label:"Public"}]} />
      <label style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14,cursor:"pointer" }}>
        <input type="checkbox" checked={!!form.buddy_opt_in} onChange={e=>f("buddy_opt_in",e.target.checked)} />
        <span style={{ fontSize:13,color:C.muted }}>Opt in to workout buddy matching</span>
      </label>

      <div style={{ fontSize:12,color:C.accent,fontWeight:700,marginBottom:10,marginTop:4,letterSpacing:"0.06em" }}>HEALTH & BODY</div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
        <Input label="Height (cm)" value={form.height_cm} onChange={v=>f("height_cm",v)} type="number" placeholder="175" />
        <Input label="Weight (kg)" value={form.weight_kg} onChange={v=>f("weight_kg",v)} type="number" placeholder="70" />
      </div>
      <Textarea label="Health Issues / Medical Notes" value={form.health_issues} onChange={v=>f("health_issues",v)} placeholder="Diabetes, knee injury, hypertension..." rows={2} />

      <div style={{ fontSize:12,color:C.accent,fontWeight:700,marginBottom:10,marginTop:4,letterSpacing:"0.06em" }}>EMERGENCY CONTACT</div>
      <Input label="Contact Name" value={form.emergency_contact_name} onChange={v=>f("emergency_contact_name",v)} placeholder="Priya Sharma (Mother)" />
      <Input label="Contact Phone" value={form.emergency_contact_phone} onChange={v=>f("emergency_contact_phone",v)} type="tel" placeholder="+91 98765 43210" />
      <Input label="Relationship" value={form.emergency_contact_relation} onChange={v=>f("emergency_contact_relation",v)} placeholder="Mother / Spouse / Friend" />

      <Btn fullWidth loading={loading} onClick={()=>onSave(form)}>
        {initial.id ? "Save Changes" : "Add Member"}
      </Btn>
    </div>
  );
};

// TRAINER FORM (Add / Edit)
const TrainerForm = ({ initial={}, gymId, onSave, showToast, loading }) => {
  const [form, setForm] = useState({
    name:"",email:"",phone:"",speciality:"",about:"",
    experience_years:0,tier:"silver",transformation_count:0,
    profile_photo_url:"",certifications:[],
    ...initial
  });
  const [certInput, setCertInput] = useState("");
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const addCert = () => {
    if (!certInput.trim()) return;
    f("certifications",[...(form.certifications||[]),{ name:certInput.trim(), year:new Date().getFullYear() }]);
    setCertInput("");
  };
  const removeCert = (i) => f("certifications",(form.certifications||[]).filter((_,idx)=>idx!==i));

  return (
    <div>
      {form.profile_photo_url&&<img src={form.profile_photo_url} alt="photo" style={{ width:70,height:70,borderRadius:"50%",objectFit:"cover",marginBottom:12,border:`1px solid ${C.border}` }}/>}
      <div style={{ fontSize:12,color:C.amber,fontWeight:700,marginBottom:10,letterSpacing:"0.06em" }}>BASIC INFO</div>
      <Input label="Full Name" value={form.name} onChange={v=>f("name",v)} placeholder="Kiran Rao" required />
      <Input label="Email" value={form.email} onChange={v=>f("email",v)} type="email" />
      <Input label="Phone" value={form.phone} onChange={v=>f("phone",v)} type="tel" placeholder="+91 98765 43210" />
      <Input label="Profile Photo URL" value={form.profile_photo_url} onChange={v=>f("profile_photo_url",v)} placeholder="https://..." />
      <Input label="Speciality" value={form.speciality} onChange={v=>f("speciality",v)} placeholder="Strength & Conditioning" />
      <Textarea label="About" value={form.about} onChange={v=>f("about",v)} placeholder="Brief bio and coaching philosophy..." rows={3} />

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
        <Input label="Experience (years)" value={form.experience_years} onChange={v=>f("experience_years",v)} type="number" placeholder="5" />
        <Input label="Transformations" value={form.transformation_count} onChange={v=>f("transformation_count",v)} type="number" placeholder="42" />
      </div>

      <Select label="Tier" value={form.tier} onChange={v=>f("tier",v)} options={[{value:"platinum",label:"Platinum"},{value:"gold",label:"Gold"},{value:"silver",label:"Silver"}]} />

      <div style={{ fontSize:12,color:C.amber,fontWeight:700,marginBottom:10,marginTop:4,letterSpacing:"0.06em" }}>CERTIFICATIONS</div>
      <div style={{ display:"flex",gap:8,marginBottom:10 }}>
        <input value={certInput} onChange={e=>setCertInput(e.target.value)} placeholder="e.g. ACE Personal Trainer"
          style={{ flex:1,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.text,fontSize:13,fontFamily:"inherit",outline:"none" }} />
        <Btn small onClick={addCert}>Add</Btn>
      </div>
      {(form.certifications||[]).map((c,i)=>(
        <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",background:C.surface,borderRadius:8,padding:"8px 12px",marginBottom:6 }}>
          <div style={{ fontSize:13,color:C.text }}>{c.name} <span style={{ color:C.muted }}>({c.year})</span></div>
          <button onClick={()=>removeCert(i)} style={{ background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:16 }}>×</button>
        </div>
      ))}

      <Btn fullWidth loading={loading} onClick={()=>onSave(form)}>
        {initial.id ? "Save Changes" : "Add Trainer"}
      </Btn>
    </div>
  );
};

// CLASS BOOKING
const ClassBooking = ({ classes, setClasses, gymId, showToast, isAdmin }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const mine = classes.filter(c=>c.gymId===gymId);

  const addCls = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      const row = await db.insert("classes",{ gym_id:gymId,name:form.name,trainer:form.trainer||"TBD",day:form.day||"Daily",time:form.time||"7:00 AM",capacity:Number(form.capacity)||15,booked:0 });
      setClasses(cs=>[...cs,{...row,gymId:row.gym_id}]);
      showToast("Class added!"); setModal(false); setForm({});
    } catch(e){ showToast("Error: "+e.message,"error"); }
    setSaving(false);
  };

  return (
    <div>
      {isAdmin&&<div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}><div style={{ fontSize:15,fontWeight:700,color:C.text }}>Class Schedule</div><Btn small onClick={()=>setModal(true)}>+ Add Class</Btn></div>}
      {mine.map(cls=>{
        const pct=Math.round((cls.booked/cls.capacity)*100);
        const full=cls.booked>=cls.capacity;
        return (
          <Card key={cls.id} style={{ marginBottom:10 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
              <div>
                <div style={{ fontWeight:700,color:C.text,fontSize:14,marginBottom:2 }}>{cls.name}</div>
                <div style={{ fontSize:12,color:C.muted }}>{cls.trainer} · {cls.day}</div>
                <div style={{ fontSize:13,color:C.accent,marginTop:2,fontWeight:600 }}>{cls.time}</div>
              </div>
              <Badge color={full?C.red:C.green}>{full?"Full":`${cls.capacity-cls.booked} left`}</Badge>
            </div>
            <div style={{ marginBottom:8 }}>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted,marginBottom:4 }}><span>{cls.booked}/{cls.capacity}</span><span>{pct}%</span></div>
              <div style={{ height:4,background:C.surface,borderRadius:2 }}><div style={{ height:"100%",width:`${pct}%`,background:full?C.red:pct>70?C.amber:C.green,borderRadius:2 }} /></div>
            </div>
            {!isAdmin&&<Btn small fullWidth disabled={full} onClick={async ()=>{ try{ await db.update("classes",cls.id,{booked:cls.booked+1}); setClasses(cs=>cs.map(c=>c.id===cls.id?{...c,booked:c.booked+1}:c)); showToast(`Booked ${cls.name}!`); }catch(e){showToast("Error","error");} }}>
              {full?"Join Waitlist":"Book Slot"}
            </Btn>}
          </Card>
        );
      })}
      {modal&&<Modal title="Add New Class" onClose={()=>{setModal(false);setForm({})}}>
        <Input label="Class name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Morning HIIT" />
        <Input label="Trainer" value={form.trainer||""} onChange={v=>setForm(f=>({...f,trainer:v}))} placeholder="Kiran Rao" />
        <Input label="Days" value={form.day||""} onChange={v=>setForm(f=>({...f,day:v}))} placeholder="Mon/Wed/Fri" />
        <Input label="Time" value={form.time||""} onChange={v=>setForm(f=>({...f,time:v}))} placeholder="6:00 AM" />
        <Input label="Capacity" value={form.capacity||""} onChange={v=>setForm(f=>({...f,capacity:v}))} type="number" placeholder="20" />
        <Btn fullWidth loading={saving} onClick={addCls}>Add Class</Btn>
      </Modal>}
    </div>
  );
};

// BODY METRICS
const BodyMetrics = ({ metrics, setMetrics, memberId, showToast }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const mine = [...metrics.filter(m=>m.member_id===memberId||m.memberId===memberId)].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const latest=mine[mine.length-1];
  const first=mine[0];
  const diff=(key)=>{ if(!latest||mine.length<2)return null; const d=latest[key]-first[key]; return d>0?`+${d}`:`${d}`; };

  const logEntry = async () => {
    if (!form.weight_kg) return;
    setSaving(true);
    try {
      const row = await db.insert("body_metrics",{ member_id:memberId, date:todayStr, weight_kg:Number(form.weight_kg), body_fat_pct:Number(form.body_fat_pct)||null, chest_cm:Number(form.chest_cm)||null, waist_cm:Number(form.waist_cm)||null, hips_cm:Number(form.hips_cm)||null, notes:form.notes||null });
      setMetrics(m=>[...m,row]);
      showToast("Metrics logged!"); setModal(false); setForm({});
    } catch(e){ showToast("Error: "+e.message,"error"); }
    setSaving(false);
  };

  return (
    <div>
      {latest&&(
        <div style={{ background:`${C.teal}0E`,border:`1px solid ${C.teal}44`,borderRadius:12,padding:16,marginBottom:16 }}>
          <div style={{ fontSize:11,color:C.teal,fontWeight:700,marginBottom:10,letterSpacing:"0.06em" }}>LATEST — {latest.date}</div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
            {[{l:"Weight",k:"weight_kg",u:"kg"},{l:"Body Fat",k:"body_fat_pct",u:"%"},{l:"Waist",k:"waist_cm",u:"cm"}].map(m=>(
              <div key={m.k} style={{ textAlign:"center",background:C.surface,borderRadius:10,padding:"10px 6px" }}>
                <div style={{ fontSize:20,fontWeight:700,color:C.text }}>{latest[m.k]||"—"}<span style={{ fontSize:11,color:C.muted }}>{m.u}</span></div>
                <div style={{ fontSize:10,color:C.muted,marginBottom:4 }}>{m.l}</div>
                {diff(m.k)&&mine.length>1&&<div style={{ fontSize:10,fontWeight:700,color:parseFloat(diff(m.k))<0?C.green:C.red }}>{diff(m.k)}{m.u}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      <SectionHeader title="Progress Log" action={<Btn small onClick={()=>setModal(true)}>+ Log Entry</Btn>} />
      {mine.length===0&&<div style={{ color:C.muted,fontSize:13,textAlign:"center",padding:"20px 0" }}>No entries yet. Start tracking your progress.</div>}
      {[...mine].reverse().map((m,i)=>(
        <Card key={m.id} style={{ marginBottom:8 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
            <div style={{ fontSize:12,color:C.muted }}>{m.date}</div>
            {i===0&&<Badge color={C.accent}>Latest</Badge>}
          </div>
          <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
            {[["Weight",m.weight_kg,"kg"],["Body Fat",m.body_fat_pct,"%"],["Chest",m.chest_cm,"cm"],["Waist",m.waist_cm,"cm"],["Hips",m.hips_cm,"cm"]].filter(([,v])=>v).map(([l,v,u])=>(
              <div key={l} style={{ fontSize:12 }}><span style={{ color:C.muted }}>{l}: </span><span style={{ color:C.text,fontWeight:600 }}>{v}{u}</span></div>
            ))}
          </div>
          {m.notes&&<div style={{ fontSize:12,color:C.muted,marginTop:6 }}>{m.notes}</div>}
        </Card>
      ))}
      {modal&&<Modal title="Log Body Metrics" onClose={()=>{setModal(false);setForm({})}}>
        <div style={{ fontSize:12,color:C.muted,marginBottom:12 }}>Logging for: {todayStr}</div>
        <Input label="Weight (kg)" value={form.weight_kg||""} onChange={v=>setForm(f=>({...f,weight_kg:v}))} type="number" placeholder="75" required />
        <Input label="Body Fat %" value={form.body_fat_pct||""} onChange={v=>setForm(f=>({...f,body_fat_pct:v}))} type="number" placeholder="18" />
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
          <Input label="Chest (cm)" value={form.chest_cm||""} onChange={v=>setForm(f=>({...f,chest_cm:v}))} type="number" placeholder="98" />
          <Input label="Waist (cm)" value={form.waist_cm||""} onChange={v=>setForm(f=>({...f,waist_cm:v}))} type="number" placeholder="80" />
          <Input label="Hips (cm)" value={form.hips_cm||""} onChange={v=>setForm(f=>({...f,hips_cm:v}))} type="number" placeholder="94" />
        </div>
        <Textarea label="Notes (optional)" value={form.notes||""} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="How are you feeling today?" rows={2} />
        <Btn fullWidth loading={saving} onClick={logEntry}>Save Entry</Btn>
      </Modal>}
    </div>
  );
};

// CHALLENGES
const Challenges = ({ challenges, gymId, memberId, showToast }) => {
  const mine = challenges.filter(c=>c.gymId===gymId||c.gym_id===gymId);
  const medals = ["🥇","🥈","🥉"];
  return (
    <div>
      {mine.map(ch=>(
        <Card key={ch.id} style={{ marginBottom:16,border:`1px solid ${C.amber}55` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
            <div style={{ fontWeight:700,color:C.text,fontSize:15 }}>{ch.title}</div>
            <Badge color={C.amber}>Ends {ch.ends}</Badge>
          </div>
          <div style={{ fontSize:12,color:C.muted,marginBottom:12 }}>{ch.description||ch.desc}</div>
          <div style={{ background:`${C.amber}11`,borderRadius:8,padding:"8px 12px",marginBottom:14,display:"flex",alignItems:"center",gap:8 }}>
            <span style={{ fontSize:16 }}>🏆</span>
            <span style={{ fontSize:12,color:C.amber,fontWeight:600 }}>Prize: {ch.prize}</span>
          </div>
          {ch.leaderboard&&(
            <>
              <div style={{ fontSize:11,color:C.muted,fontWeight:700,letterSpacing:"0.07em",marginBottom:8 }}>LEADERBOARD</div>
              {ch.leaderboard.map((e,i)=>{
                const isMe=e.memberId===memberId||e.member_id===memberId;
                return (
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,marginBottom:4,background:isMe?`${C.accent}11`:C.surface,border:isMe?`1px solid ${C.accent}44`:"none" }}>
                    <span style={{ fontSize:18,width:24,textAlign:"center" }}>{medals[i]||`#${i+1}`}</span>
                    <span style={{ flex:1,fontSize:13,fontWeight:isMe?700:500,color:isMe?C.accent:C.text }}>{e.name}{isMe?" (You)":""}</span>
                    <span style={{ fontSize:13,fontWeight:700,color:C.text }}>{e.value} {ch.metric==="checkins"?"visits":"kg"}</span>
                  </div>
                );
              })}
            </>
          )}
          <div style={{ marginTop:12 }}>
            <Btn small fullWidth onClick={async()=>{ try{ await db.insert("challenge_entries",{challenge_id:ch.id,member_id:memberId,value:0}); showToast("Challenge joined!"); }catch(e){ showToast("Already joined!"); } }}>Join Challenge</Btn>
          </div>
        </Card>
      ))}
    </div>
  );
};

// EQUIPMENT TRACKER
const EquipmentTracker = ({ equipment, setEquipment, gymId, isAdmin, showToast, memberId }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const mine = equipment.filter(e=>e.gymId===gymId||e.gym_id===gymId);
  const sc=s=>s==="open"?C.red:s==="in-progress"?C.amber:C.green;
  const sl=s=>s==="open"?"Open":s==="in-progress"?"In Progress":"Resolved";

  const submit = async () => {
    if (!form.name||!form.issue) return;
    setSaving(true);
    try {
      const row = await db.insert("equipment",{ gym_id:gymId,name:form.name,issue:form.issue,reported_by:form.anon?"Anonymous":"Member",member_id:form.anon?null:memberId,date:todayStr,status:"open" });
      setEquipment(eq=>[...eq,{...row,gymId:row.gym_id}]);
      showToast("Issue reported!"); setModal(false); setForm({});
    } catch(e){ showToast("Error: "+e.message,"error"); }
    setSaving(false);
  };

  const updateStatus = async (eq, status) => {
    try {
      const updates = { status, ...(status==="resolved"?{resolved_at:new Date().toISOString()}:{}) };
      await db.update("equipment", eq.id, updates);
      setEquipment(es=>es.map(e=>e.id===eq.id?{...e,...updates}:e));
      showToast(status==="resolved"?"Marked resolved ✓":"Updated");
    } catch(e){ showToast("Error","error"); }
  };

  return (
    <div>
      <div style={{ display:"flex",gap:8,marginBottom:16 }}>
        {[["Open",mine.filter(e=>e.status==="open").length,C.red],["In Progress",mine.filter(e=>e.status==="in-progress").length,C.amber],["Resolved",mine.filter(e=>e.status==="resolved").length,C.green]].map(([l,v,c])=>(
          <div key={l} style={{ flex:1,background:C.surface,borderRadius:10,padding:"10px 8px",textAlign:"center",border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:22,fontWeight:700,color:c,fontFamily:"'Bebas Neue',sans-serif" }}>{v}</div>
            <div style={{ fontSize:10,color:C.muted }}>{l}</div>
          </div>
        ))}
      </div>
      {mine.map(eq=>(
        <Card key={eq.id} style={{ marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700,color:C.text,fontSize:14 }}>{eq.name}</div>
              <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>{eq.issue}</div>
              <div style={{ fontSize:11,color:C.faint,marginTop:4 }}>By {eq.reported_by||eq.reportedBy} · {eq.date}</div>
            </div>
            <Badge color={sc(eq.status)}>{sl(eq.status)}</Badge>
          </div>
          {isAdmin&&eq.status!=="resolved"&&(
            <div style={{ display:"flex",gap:8,marginTop:8 }}>
              {eq.status==="open"&&<Btn small variant="ghost" onClick={()=>updateStatus(eq,"in-progress")}>In Progress</Btn>}
              <Btn small onClick={()=>updateStatus(eq,"resolved")}>Resolve</Btn>
            </div>
          )}
        </Card>
      ))}
      {!isAdmin&&<div style={{ marginTop:8 }}><Btn fullWidth variant="ghost" onClick={()=>setModal(true)}>+ Report Equipment Issue</Btn></div>}
      {modal&&<Modal title="Report Issue" onClose={()=>{setModal(false);setForm({})}}>
        <Input label="Equipment name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Treadmill #4" required />
        <Textarea label="Describe the issue" value={form.issue||""} onChange={v=>setForm(f=>({...f,issue:v}))} placeholder="What's wrong with it?" rows={3} />
        <label style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16,cursor:"pointer" }}>
          <input type="checkbox" checked={!!form.anon} onChange={e=>setForm(f=>({...f,anon:e.target.checked}))} />
          <span style={{ fontSize:13,color:C.muted }}>Report anonymously</span>
        </label>
        <Btn fullWidth loading={saving} onClick={submit}>Submit Report</Btn>
      </Modal>}
    </div>
  );
};

// PARTNER BRANDS
const PartnerBrands = ({ partners, showToast }) => (
  <div>
    <div style={{ fontSize:13,color:C.muted,marginBottom:16,lineHeight:1.5 }}>Exclusive discounts for Vaultr members. Show the code at checkout.</div>
    {partners.map(p=>(
      <Card key={p.id} style={{ marginBottom:10 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:12 }}>
          <div style={{ width:44,height:44,borderRadius:10,background:`#${p.color_hex||p.color}22`,border:`1px solid #${p.color_hex||p.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:`#${p.color_hex||p.color}`,flexShrink:0 }}>
            {(p.logo_url ? null : p.name.slice(0,2).toUpperCase())}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700,color:C.text,fontSize:14 }}>{p.name}</div>
            <div style={{ fontSize:11,color:C.muted }}>{p.category}</div>
          </div>
          <div style={{ fontSize:15,fontWeight:700,color:`#${p.color_hex||p.color}` }}>{p.discount}</div>
        </div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:C.surface,borderRadius:8,padding:"8px 12px" }}>
          <div>
            <div style={{ fontSize:10,color:C.muted,marginBottom:2 }}>YOUR CODE</div>
            <div style={{ fontFamily:"monospace",fontSize:15,fontWeight:700,color:C.accent,letterSpacing:"0.1em" }}>{p.code}</div>
          </div>
          <Btn small onClick={()=>{ navigator.clipboard?.writeText(p.code); showToast(`${p.code} copied!`); }}>Copy Code</Btn>
        </div>
      </Card>
    ))}
  </div>
);

// BENCHMARKING
const Benchmarking = () => {
  const items=[
    {label:"Member retention rate",key:"avgRetention",icon:"📈"},
    {label:"Revenue per member",key:"revenuePerMember",icon:"💰"},
    {label:"Peak hour fill rate",key:"peakHourFill",icon:"🔥"},
    {label:"Members per trainer",key:"trainerRatio",icon:"👥"},
    {label:"Avg visits per month",key:"avgCheckins",icon:"📅"},
    {label:"Content engagement",key:"contentEngagement",icon:"📱"},
  ];
  return (
    <div>
      <div style={{ background:`${C.accent}0D`,border:`1px solid ${C.accent}33`,borderRadius:12,padding:"12px 16px",marginBottom:16 }}>
        <div style={{ fontSize:12,color:C.muted,marginBottom:4 }}>Benchmarked against</div>
        <div style={{ fontSize:14,fontWeight:700,color:C.text }}>62 gyms in Bengaluru on Vaultr</div>
        <div style={{ fontSize:11,color:C.accent,marginTop:4 }}>🏆 Top 18% overall performance</div>
      </div>
      {items.map(item=>{
        const d=benchmarks[item.key];
        const winning=(d.better==="higher"&&d.yours>d.market)||(d.better==="lower"&&d.yours<d.market);
        const pct=Math.abs(Math.round(((d.yours-d.market)/d.market)*100));
        return (
          <Card key={item.key} style={{ marginBottom:10 }}>
            <div style={{ display:"flex",gap:10,marginBottom:10 }}>
              <span style={{ fontSize:18 }}>{item.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13,fontWeight:600,color:C.text,marginBottom:8 }}>{item.label}</div>
                <div style={{ display:"flex",gap:16,alignItems:"flex-end" }}>
                  <div><div style={{ fontSize:10,color:C.muted,marginBottom:2 }}>YOUR GYM</div><div style={{ fontSize:22,fontWeight:700,color:winning?C.green:C.amber,fontFamily:"'Bebas Neue',sans-serif" }}>{d.yours}{d.unit}</div></div>
                  <div><div style={{ fontSize:10,color:C.muted,marginBottom:2 }}>MARKET AVG</div><div style={{ fontSize:22,fontWeight:700,color:C.faint,fontFamily:"'Bebas Neue',sans-serif" }}>{d.market}{d.unit}</div></div>
                  <div style={{ flex:1,display:"flex",justifyContent:"flex-end" }}><Badge color={winning?C.green:C.amber}>{winning?"▲":"▼"} {pct}% {winning?"above":"below"}</Badge></div>
                </div>
              </div>
            </div>
            <div style={{ height:4,background:C.surface,borderRadius:2 }}>
              <div style={{ height:"100%",width:`${Math.min((d.yours/Math.max(d.yours,d.market))*100,100)}%`,background:winning?C.green:C.amber,borderRadius:2 }} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// BUDDY MATCH
const BuddyMatch = ({ members, gymId, memberId, showToast }) => {
  const [optedIn, setOptedIn] = useState(true);
  const suggestions = members.filter(m=>(m.gymId===gymId||m.gym_id===gymId)&&m.active&&(m.id!==memberId)&&(m.buddy_opt_in||m.buddyOptIn));
  return (
    <div>
      <Card style={{ marginBottom:16,background:`${C.pink}0E`,border:`1px solid ${C.pink}44` }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div>
            <div style={{ fontWeight:700,color:C.text,fontSize:14 }}>Buddy matching</div>
            <div style={{ fontSize:12,color:C.muted,marginTop:2 }}>Pair with members who share your schedule</div>
          </div>
          <div onClick={()=>setOptedIn(v=>!v)} style={{ width:44,height:24,borderRadius:12,background:optedIn?C.green:C.faint,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0 }}>
            <div style={{ width:18,height:18,borderRadius:"50%",background:"white",position:"absolute",top:3,left:optedIn?23:3,transition:"left 0.2s" }} />
          </div>
        </div>
        {optedIn&&<div style={{ fontSize:11,color:C.green,marginTop:8 }}>✓ Visible to potential buddies</div>}
      </Card>
      <SectionHeader title={`Suggested Matches (${suggestions.length})`} />
      {suggestions.map(m=>(
        <Card key={m.id} style={{ marginBottom:10 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <Avatar name={m.name} color={C.pink} size={40} photoUrl={m.profile_photo_url||m.photoUrl} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700,color:C.text,fontSize:14 }}>{m.name}</div>
              <div style={{ fontSize:12,color:C.muted }}>{m.plan} plan</div>
              <div style={{ display:"flex",gap:6,marginTop:6 }}>
                <Badge color={C.teal}>Similar schedule</Badge>
                <Badge color={C.purple}>Same goals</Badge>
              </div>
            </div>
            <Btn small onClick={()=>showToast(`Request sent to ${m.name.split(" ")[0]}!`)}>Connect</Btn>
          </div>
        </Card>
      ))}
      <div style={{ marginTop:12,padding:"12px 16px",background:`${C.pink}0E`,borderRadius:10,border:`1px solid ${C.pink}22` }}>
        <div style={{ fontSize:12,color:C.muted,lineHeight:1.6 }}>Members with buddies visit <span style={{ color:C.pink,fontWeight:700 }}>25% more often</span> and are less likely to cancel.</div>
      </div>
    </div>
  );
};

// ─── GYM ADMIN APP ────────────────────────────────────────────────────────────
const GymAdminApp = ({ gyms, members, setMembers, trainers, setTrainers, attendance, setAttendance, content:ct, setContent, feedback, setFeedback, events, holidays, setHolidays, classes, setClasses, equipment, setEquipment, metrics, setMetrics, challenges, partners, showToast }) => {
  const [tab, setTab] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const gym = gyms[0];
  const myMembers = members.filter(m=>m.gymId===gym.id||m.gym_id===gym.id);
  const myTrainers = trainers.filter(t=>t.gymId===gym.id||t.gym_id===gym.id);
  const myAttendance = attendance.filter(a=>a.gymId===gym.id||a.gym_id===gym.id);
  const todayAtt = myAttendance.filter(a=>a.date===todayStr);
  const max = Math.max(...peakData.map(d=>d.count));

  const tabs=[
    {id:"dashboard",label:"Dashboard"},{id:"gym",label:"Gym Profile"},
    {id:"members",label:"Members"},{id:"trainers",label:"Trainers"},
    {id:"attendance",label:"Attendance"},{id:"classes",label:"Classes"},
    {id:"content",label:"Content"},{id:"equipment",label:"Equipment"},
    {id:"feedback",label:"Feedback"},{id:"benchmarks",label:"Benchmarks"},
    {id:"calendar",label:"Calendar"},{id:"reviews",label:"Reviews"},
  ];

  useEffect(()=>{
    const load = async () => {
      setLoading(true);
      try {
        const [mData,tData,cData,hData,clData,eqData,attData,fbData] = await Promise.all([
          db.load("members",{gym_id:gym.id}),
          db.load("trainers",{gym_id:gym.id}),
          db.load("content",{gym_id:gym.id}),
          db.load("holidays",{gym_id:gym.id}),
          db.load("classes",{gym_id:gym.id}),
          db.load("equipment",{gym_id:gym.id}),
          db.load("attendance_logs",{gym_id:gym.id}),
          db.load("feedback",{gym_id:gym.id}),
        ]);
        setMembers(mData.map(mapMember));
        setTrainers(tData.map(mapTrainer));
        setContent(cData.map(c=>({...c,gymId:c.gym_id})));
        setHolidays(hData.map(h=>({...h,gymId:h.gym_id})));
        setClasses(clData.map(c=>({...c,gymId:c.gym_id})));
        setEquipment(eqData.map(e=>({...e,gymId:e.gym_id})));
        setAttendance(attData.map(mapAtt));
        setFeedback(fbData.map(f=>({...f,gymId:f.gym_id,user:f.user_name})));
      } catch(e){ showToast("Load error: "+e.message,"error"); }
      setLoading(false);
    };
    load();
  },[gym.id]);

  const saveMember = async (form) => {
    setLoading(true);
    try {
      if (form.id) {
        const updated = await db.update("members", form.id, {
          name:form.name,email:form.email,phone:form.phone,address:form.address,
          plan:form.plan,date_of_birth:form.date_of_birth||null,
          height_cm:Number(form.height_cm)||null,weight_kg:Number(form.weight_kg)||null,
          health_issues:form.health_issues,emergency_contact_name:form.emergency_contact_name,
          emergency_contact_phone:form.emergency_contact_phone,emergency_contact_relation:form.emergency_contact_relation,
          profile_photo_url:form.profile_photo_url,profile_visibility:form.profile_visibility,
          buddy_opt_in:!!form.buddy_opt_in,
        });
        setMembers(ms=>ms.map(m=>m.id===form.id?mapMember(updated):m));
        showToast("Member updated!");
      } else {
        const row = await db.insert("members",{
          gym_id:gym.id,name:form.name,email:form.email,phone:form.phone,
          address:form.address,plan:form.plan||"Monthly",active:true,joined:todayStr,
          points:0,date_of_birth:form.date_of_birth||null,
          height_cm:Number(form.height_cm)||null,weight_kg:Number(form.weight_kg)||null,
          health_issues:form.health_issues,emergency_contact_name:form.emergency_contact_name,
          emergency_contact_phone:form.emergency_contact_phone,
          emergency_contact_relation:form.emergency_contact_relation,
          profile_photo_url:form.profile_photo_url,profile_visibility:form.profile_visibility||"private",
          buddy_opt_in:!!form.buddy_opt_in,
          referral_code:`IRON-${Date.now().toString(36).toUpperCase()}`,
        });
        setMembers(ms=>[...ms,mapMember(row)]);
        showToast("Member added!");
      }
      setModal(null);
    } catch(e){
      showToast(e.code==="23505"?"Email already exists":("Error: "+e.message),"error");
    }
    setLoading(false);
  };

  const saveTrainer = async (form) => {
    setLoading(true);
    try {
      const payload = {
        name:form.name,email:form.email,phone:form.phone,speciality:form.speciality,
        about:form.about,experience_years:Number(form.experience_years)||0,
        tier:form.tier||"silver",transformation_count:Number(form.transformation_count)||0,
        profile_photo_url:form.profile_photo_url,certifications:form.certifications||[],
      };
      if (form.id) {
        const updated = await db.update("trainers", form.id, payload);
        setTrainers(ts=>ts.map(t=>t.id===form.id?mapTrainer(updated):t));
        showToast("Trainer updated!");
      } else {
        const row = await db.insert("trainers",{...payload,gym_id:gym.id,active:true,joined:todayStr});
        setTrainers(ts=>[...ts,mapTrainer(row)]);
        showToast("Trainer added!");
      }
      setModal(null);
    } catch(e){ showToast("Error: "+e.message,"error"); }
    setLoading(false);
  };

  const toggleMember = async (m) => {
    try {
      await db.update("members",m.id,{active:!m.active});
      setMembers(ms=>ms.map(x=>x.id===m.id?{...x,active:!m.active}:x));
      showToast(!m.active?"Member activated":"Member deactivated");
    } catch(e){ showToast("Error","error"); }
  };

  const toggleTrainer = async (t) => {
    try {
      await db.update("trainers",t.id,{active:!t.active});
      setTrainers(ts=>ts.map(x=>x.id===t.id?{...x,active:!t.active}:x));
      showToast(!t.active?"Trainer reinstated":"Trainer removed");
    } catch(e){ showToast("Error","error"); }
  };

  const addContent = async (form) => {
    setLoading(true);
    try {
      const row = await db.insert("content",{gym_id:gym.id,title:form.title,type:form.type||"text",category:form.category||"Workout",likes:0,date:todayStr});
      setContent(c=>[...c,{...row,gymId:row.gym_id}]);
      showToast("Published!"); setModal(null);
    } catch(e){ showToast("Error","error"); }
    setLoading(false);
  };

  const addHoliday = async (form) => {
    setLoading(true);
    try {
      const row = await db.insert("holidays",{gym_id:gym.id,name:form.name,date:form.date});
      setHolidays(h=>[...h,{...row,gymId:row.gym_id}]);
      showToast("Holiday added!"); setModal(null);
    } catch(e){ showToast("Error","error"); }
    setLoading(false);
  };

  const [contentForm, setContentForm] = useState({});
  const [holidayForm, setHolidayForm] = useState({});

  return (
    <div style={{ background:C.bg,minHeight:"100vh",maxWidth:420,margin:"0 auto" }}>
      <div style={{ padding:"20px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          {gym.logo_url&&<img src={gym.logo_url} alt="logo" style={{ width:36,height:36,borderRadius:8,objectFit:"cover" }}/>}
          <div>
            <div style={{ fontSize:11,color:C.accent,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase" }}>◈ Gym Admin</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:C.text,lineHeight:1 }}>{gym.name}</div>
          </div>
        </div>
        <Badge color={C.green}>Active</Badge>
      </div>
      <LoadingBar show={loading} />
      <div style={{ display:"flex",gap:6,padding:"14px 20px 0",overflowX:"auto",scrollbarWidth:"none" }}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{ background:tab===t.id?`${C.accent}22`:"transparent",border:`1px solid ${tab===t.id?C.accent:C.border}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:600,color:tab===t.id?C.accent:C.muted,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap" }}>{t.label}</button>)}
      </div>

      <div style={{ padding:20,paddingBottom:40 }}>

        {tab==="dashboard"&&(
          <>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20 }}>
              <Stat label="Total Members" value={myMembers.length} />
              <Stat label="Active" value={myMembers.filter(m=>m.active).length} color={C.green} />
              <Stat label="Today Check-ins" value={todayAtt.length} color={C.accent} />
              <Stat label="Open Issues" value={equipment.filter(e=>(e.gymId===gym.id||e.gym_id===gym.id)&&e.status==="open").length} color={C.red} />
            </div>
            <SectionHeader title="Peak Hours" />
            <Card style={{ marginBottom:20 }}>
              <div style={{ display:"flex",alignItems:"flex-end",gap:3,height:110 }}>
                {peakData.map(d=><HeatBar key={d.hour} {...d} max={max} />)}
              </div>
              <div style={{ display:"flex",gap:12,marginTop:16,flexWrap:"wrap" }}>
                {[[C.red,"Peak"],[C.accent,"High"],[C.amber,"Med"],[C.blue,"Low"]].map(([c,l])=>(
                  <div key={l} style={{ display:"flex",alignItems:"center",gap:4 }}><div style={{ width:8,height:8,borderRadius:2,background:c }} /><span style={{ fontSize:10,color:C.muted }}>{l}</span></div>
                ))}
              </div>
            </Card>
            {gym.address&&<Card style={{ marginBottom:16 }}>
              <div style={{ fontSize:12,color:C.muted,marginBottom:8,fontWeight:600 }}>GYM INFO</div>
              <InfoRow label="📍 Address" value={gym.address} />
              <InfoRow label="📞 Phone" value={gym.phone} />
              <InfoRow label="🌐 Website" value={gym.website} />
              <InfoRow label="🕐 Timings" value={gym.timings?.default||gym.timings} />
              {Array.isArray(gym.amenities)&&gym.amenities.length>0&&(
                <div style={{ marginTop:8 }}>
                  <div style={{ fontSize:11,color:C.muted,marginBottom:6 }}>Amenities</div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                    {gym.amenities.map(a=><Badge key={a} color={C.teal}>{a}</Badge>)}
                  </div>
                </div>
              )}
            </Card>}
            <SectionHeader title="Today's Attendance" />
            {todayAtt.length===0&&<div style={{ color:C.muted,fontSize:13 }}>No check-ins yet today.</div>}
            {todayAtt.map(a=>{
              const usr=a.userType==="member"?myMembers.find(m=>m.id===a.userId):myTrainers.find(t=>t.id===a.userId);
              return (
                <Card key={a.id} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                      <Avatar name={usr?.name||"?"} color={a.userType==="trainer"?C.amber:C.blue} size={32} photoUrl={usr?.photoUrl||usr?.profile_photo_url} />
                      <div>
                        <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{usr?.name||"Unknown"}</div>
                        <div style={{ fontSize:11,color:C.muted }}>{a.checkIn} – {a.checkOut||"Still in"}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex",gap:4,flexDirection:"column",alignItems:"flex-end" }}>
                      <Badge color={a.userType==="trainer"?C.amber:C.blue}>{a.userType}</Badge>
                      <Badge color={a.method==="biometric"?C.purple:C.green}>{a.method}</Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </>
        )}

        {tab==="gym"&&<GymProfile gym={gym} onSave={(updated)=>{ gyms[0]=updated; showToast("Saved!"); }} showToast={showToast} />}

        {tab==="members"&&(
          <>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
              <div style={{ fontSize:15,fontWeight:700,color:C.text }}>Members ({myMembers.length})</div>
              <Btn small onClick={()=>{ setSelectedMember(null); setModal("member"); }}>+ Add</Btn>
            </div>
            {myMembers.length===0&&<div style={{ color:C.muted,fontSize:13 }}>No members yet. Add your first member above.</div>}
            {myMembers.map(m=>(
              <Card key={m.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex",alignItems:"flex-start",gap:12 }}>
                  <Avatar name={m.name} color={C.blue} size={44} photoUrl={m.photoUrl} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700,color:C.text,fontSize:14 }}>{m.name}</div>
                    <div style={{ fontSize:12,color:C.muted }}>{m.email}</div>
                    {m.phone&&<div style={{ fontSize:12,color:C.muted }}>📞 {m.phone}</div>}
                    {m.dob&&<div style={{ fontSize:11,color:C.faint,marginTop:2 }}>DOB: {m.dob}</div>}
                    <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginTop:6 }}>
                      <Badge color={m.active?C.green:C.red}>{m.active?"Active":"Inactive"}</Badge>
                      <Badge color={C.blue}>{m.plan}</Badge>
                      <span style={{ fontSize:11,color:C.faint }}>{m.points} pts</span>
                    </div>
                    {m.healthIssues&&<div style={{ fontSize:11,color:C.amber,marginTop:4 }}>⚕ {m.healthIssues}</div>}
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                    <Btn small variant="ghost" onClick={()=>{ setSelectedMember(m); setModal("member"); }}>Edit</Btn>
                    <Btn small variant={m.active?"danger":"ghost"} onClick={()=>toggleMember(m)}>{m.active?"Off":"On"}</Btn>
                  </div>
                </div>
                {m.emergencyName&&(
                  <div style={{ marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`,fontSize:11,color:C.muted }}>
                    🆘 Emergency: {m.emergencyName} ({m.emergencyRelation}) — {m.emergencyPhone}
                  </div>
                )}
              </Card>
            ))}
          </>
        )}

        {tab==="trainers"&&(
          <>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
              <div style={{ fontSize:15,fontWeight:700,color:C.text }}>Trainers ({myTrainers.length})</div>
              <Btn small onClick={()=>{ setSelectedTrainer(null); setModal("trainer"); }}>+ Add</Btn>
            </div>
            {myTrainers.length===0&&<div style={{ color:C.muted,fontSize:13 }}>No trainers yet.</div>}
            {myTrainers.map(t=>(
              <Card key={t.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex",alignItems:"flex-start",gap:12 }}>
                  <Avatar name={t.name} color={C.amber} size={48} photoUrl={t.photoUrl} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700,color:C.text,fontSize:14 }}>{t.name}</div>
                    <div style={{ fontSize:12,color:C.muted }}>{t.speciality}</div>
                    {t.phone&&<div style={{ fontSize:12,color:C.muted }}>📞 {t.phone}</div>}
                    <div style={{ display:"flex",gap:6,marginTop:6,flexWrap:"wrap" }}>
                      <TierBadge tier={t.tier||"silver"} />
                      <Badge color={t.active?C.green:C.red}>{t.active?"Active":"Inactive"}</Badge>
                      {t.expYears>0&&<Badge color={C.blue}>{t.expYears} yrs</Badge>}
                      {t.transformationCount>0&&<Badge color={C.purple}>{t.transformationCount} transformations</Badge>}
                    </div>
                    {t.about&&<div style={{ fontSize:12,color:C.muted,marginTop:6,lineHeight:1.5 }}>{t.about}</div>}
                    {Array.isArray(t.certifications)&&t.certifications.length>0&&(
                      <div style={{ marginTop:6,display:"flex",flexWrap:"wrap",gap:4 }}>
                        {t.certifications.map((c,i)=><Badge key={i} color={C.teal}>{c.name}</Badge>)}
                      </div>
                    )}
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                    <Btn small variant="ghost" onClick={()=>{ setSelectedTrainer(t); setModal("trainer"); }}>Edit</Btn>
                    <Btn small variant={t.active?"danger":"ghost"} onClick={()=>toggleTrainer(t)}>{t.active?"Off":"On"}</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {tab==="attendance"&&(
          <>
            <div style={{ fontSize:15,fontWeight:700,color:C.text,marginBottom:16 }}>Attendance Logs</div>
            {myAttendance.length===0&&<div style={{ color:C.muted,fontSize:13 }}>No attendance records yet.</div>}
            {myAttendance.map(a=>{
              const usr=a.userType==="member"?myMembers.find(m=>m.id===a.userId):myTrainers.find(t=>t.id===a.userId);
              return (
                <Card key={a.id} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex",justifyContent:"space-between" }}>
                    <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                      <Avatar name={usr?.name||"?"} color={a.userType==="trainer"?C.amber:C.blue} size={32} photoUrl={usr?.photoUrl} />
                      <div>
                        <div style={{ fontWeight:600,color:C.text,fontSize:13 }}>{usr?.name||"Unknown"}</div>
                        <div style={{ fontSize:11,color:C.muted }}>{a.date} · {a.checkIn} → {a.checkOut||"ongoing"}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex",gap:4,flexDirection:"column",alignItems:"flex-end" }}>
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
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
              <div style={{ fontSize:15,fontWeight:700,color:C.text }}>Content</div>
              <Btn small onClick={()=>setModal("content")}>+ Post</Btn>
            </div>
            {ct.filter(c=>c.gymId===gym.id||c.gym_id===gym.id).map(c=>(
              <Card key={c.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex",justifyContent:"space-between" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",gap:6,marginBottom:8 }}>
                      <Badge color={c.type==="video"?C.red:c.type==="image"?C.blue:C.green}>{c.type}</Badge>
                      <Badge color={C.muted}>{c.category}</Badge>
                    </div>
                    <div style={{ fontWeight:700,color:C.text,marginBottom:4 }}>{c.title}</div>
                    <div style={{ fontSize:11,color:C.faint }}>{c.date} · {c.likes} likes</div>
                  </div>
                  <div style={{ fontSize:20,marginLeft:12 }}>{c.type==="video"?"▶":c.type==="image"?"🖼":"📝"}</div>
                </div>
              </Card>
            ))}
          </>
        )}

        {tab==="equipment"&&<EquipmentTracker equipment={equipment} setEquipment={setEquipment} gymId={gym.id} isAdmin={true} showToast={showToast} />}

        {tab==="feedback"&&(
          <>
            <div style={{ fontSize:15,fontWeight:700,color:C.text,marginBottom:16 }}>Member Feedback</div>
            {feedback.filter(f=>f.gymId===gym.id||f.gym_id===gym.id).length===0&&<div style={{ color:C.muted,fontSize:13 }}>No feedback yet.</div>}
            {feedback.filter(f=>f.gymId===gym.id||f.gym_id===gym.id).map(f=>(
              <Card key={f.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex",gap:10 }}>
                  <Avatar name={f.type==="anonymous"?"AN":f.user||f.user_name} color={f.type==="anonymous"?C.faint:C.blue} size={32} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                      <div style={{ fontSize:13,fontWeight:600,color:f.type==="anonymous"?C.muted:C.text }}>{f.type==="anonymous"?"Anonymous":f.user||f.user_name}</div>
                      <Badge color={f.type==="anonymous"?C.faint:C.blue}>{f.type}</Badge>
                    </div>
                    <div style={{ fontSize:13,color:C.text,lineHeight:1.5 }}>{f.message}</div>
                    <div style={{ fontSize:11,color:C.faint,marginTop:6 }}>{f.date||f.created_at?.slice(0,10)}</div>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {tab==="benchmarks"&&<Benchmarking />}
        {tab==="reviews"&&<GymReviews gymId={gym.id} showToast={showToast} />}

        {tab==="calendar"&&(
          <>
            <SectionHeader title="Events" />
            {events.filter(e=>e.gymId===gym.id||e.gym_id===gym.id).map(e=>(
              <Card key={e.id} style={{ marginBottom:10,borderColor:`${C.accent}33` }}>
                <div style={{ fontWeight:700,color:C.text,marginBottom:4 }}>{e.title}</div>
                <div style={{ fontSize:12,color:C.muted }}>{e.event_date||e.date} · {e.time}</div>
                <div style={{ marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div style={{ fontSize:12,color:C.muted }}>{e.registered}/{e.slots} registered</div>
                  <div style={{ width:120,height:4,background:C.surface,borderRadius:2 }}><div style={{ width:`${(e.registered/e.slots)*100}%`,height:"100%",background:C.accent,borderRadius:2 }} /></div>
                </div>
              </Card>
            ))}
            <SectionHeader title="Holidays" action={<Btn small onClick={()=>setModal("holiday")}>+ Add</Btn>} />
            {holidays.filter(h=>h.gymId===gym.id||h.gym_id===gym.id).map(h=>(
              <Card key={h.id} style={{ marginBottom:8 }}>
                <div style={{ display:"flex",justifyContent:"space-between" }}>
                  <div style={{ fontWeight:600,color:C.text }}>{h.name}</div>
                  <div style={{ fontSize:12,color:C.muted }}>{h.date}</div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* ── MODALS ── */}
      {modal==="member"&&(
        <Modal title={selectedMember?"Edit Member":"Add Member"} onClose={()=>{setModal(null);setSelectedMember(null);}} wide>
          <MemberForm initial={selectedMember||{}} gymId={gym.id} onSave={saveMember} showToast={showToast} loading={loading} />
        </Modal>
      )}
      {modal==="trainer"&&(
        <Modal title={selectedTrainer?"Edit Trainer":"Add Trainer"} onClose={()=>{setModal(null);setSelectedTrainer(null);}} wide>
          <TrainerForm initial={selectedTrainer||{}} gymId={gym.id} onSave={saveTrainer} showToast={showToast} loading={loading} />
        </Modal>
      )}
      {modal==="content"&&(
        <Modal title="Post Content" onClose={()=>setModal(null)}>
          <Input label="Title" value={contentForm.title||""} onChange={v=>setContentForm(f=>({...f,title:v}))} placeholder="Workout or nutrition tip..." />
          <Select label="Type" value={contentForm.type||"text"} onChange={v=>setContentForm(f=>({...f,type:v}))} options={[{value:"text",label:"Article"},{value:"image",label:"Image"},{value:"video",label:"Video"}]} />
          <Select label="Category" value={contentForm.category||"Workout"} onChange={v=>setContentForm(f=>({...f,category:v}))} options={[{value:"Workout",label:"Workout"},{value:"Nutrition",label:"Nutrition"},{value:"Wellness",label:"Wellness"},{value:"Flexibility",label:"Flexibility"}]} />
          <Btn fullWidth loading={loading} onClick={()=>addContent(contentForm)}>Publish</Btn>
        </Modal>
      )}
      {modal==="holiday"&&(
        <Modal title="Add Holiday" onClose={()=>setModal(null)}>
          <Input label="Holiday Name" value={holidayForm.name||""} onChange={v=>setHolidayForm(f=>({...f,name:v}))} placeholder="Republic Day" />
          <Input label="Date" value={holidayForm.date||""} onChange={v=>setHolidayForm(f=>({...f,date:v}))} type="date" />
          <Btn fullWidth loading={loading} onClick={()=>addHoliday(holidayForm)}>Add Holiday</Btn>
        </Modal>
      )}
    </div>
  );
};

// ─── TRAINER APP ──────────────────────────────────────────────────────────────
const TrainerApp = ({ gyms, trainers, attendance, setAttendance, members, classes, setClasses, equipment, setEquipment, showToast }) => {
  const [tab, setTab] = useState("home");
  const gym = gyms[0];
  const me = trainers[0];
  const myAtt = attendance.filter(a=>(a.userType==="trainer"||a.user_type==="trainer")&&(a.userId===me?.id||a.user_id===me?.id));
  const todayRecord = myAtt.find(a=>a.date===todayStr);
  const checkedIn = todayRecord&&!todayRecord.checkOut&&!todayRecord.check_out;
  const myMembers = members.filter(m=>(m.gymId===gym.id||m.gym_id===gym.id)&&m.active);

  if (!me) return <div style={{ color:C.muted,padding:20,textAlign:"center" }}>No trainer profile found.</div>;

  const doCheckIn = async () => {
    if (todayRecord) return;
    const time = new Date().toTimeString().slice(0,5);
    try {
      const row = await db.insert("attendance_logs",{ user_id:me.id,user_type:"trainer",gym_id:gym.id,date:todayStr,check_in:time,method:gym.check_in_method||gym.checkInMethod||"qr" });
      setAttendance(a=>[...a,mapAtt(row)]);
      showToast("Checked in!");
    } catch(e){ showToast("Error","error"); }
  };

  const doCheckOut = async () => {
    if (!todayRecord) return;
    const time = new Date().toTimeString().slice(0,5);
    try {
      await db.update("attendance_logs",todayRecord.id,{check_out:time});
      setAttendance(a=>a.map(x=>x.id===todayRecord.id?{...x,checkOut:time}:x));
      showToast("Checked out. Good work today!");
    } catch(e){ showToast("Error","error"); }
  };

  return (
    <div style={{ background:C.bg,minHeight:"100vh",maxWidth:420,margin:"0 auto" }}>
      <div style={{ padding:"20px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div style={{ display:"flex",gap:12,alignItems:"center" }}>
          <Avatar name={me.name} color={C.amber} size={48} photoUrl={me.photoUrl} />
          <div>
            <div style={{ fontSize:11,color:C.amber,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase" }}>◎ Trainer</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:C.text }}>{me.name}</div>
            <div style={{ display:"flex",gap:6,marginTop:3 }}>
              <TierBadge tier={me.tier||"silver"} />
              {me.expYears>0&&<Badge color={C.blue}>{me.expYears} yrs exp</Badge>}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display:"flex",gap:6,padding:"14px 20px 0",overflowX:"auto",scrollbarWidth:"none" }}>
        {[{id:"home",label:"Home"},{id:"profile",label:"My Profile"},{id:"attendance",label:"Attendance"},{id:"members",label:"Members"},{id:"classes",label:"Classes"},{id:"equipment",label:"Equipment"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ background:tab===t.id?`${C.amber}22`:"transparent",border:`1px solid ${tab===t.id?C.amber:C.border}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:600,color:tab===t.id?C.amber:C.muted,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap" }}>{t.label}</button>
        ))}
      </div>
      <div style={{ padding:20,paddingBottom:40 }}>
        {tab==="home"&&(
          <>
            <Card style={{ marginBottom:20,border:`1.5px solid ${checkedIn?C.green+"66":C.amber+"44"}`,textAlign:"center",padding:28 }}>
              {!todayRecord?(
                <><div style={{ fontSize:13,color:C.muted,marginBottom:16 }}>Tap to check in for today</div><Btn onClick={doCheckIn}>Check In Now</Btn></>
              ):!todayRecord.checkOut?(
                <><div style={{ fontSize:32,marginBottom:8 }}>✓</div><div style={{ fontSize:15,fontWeight:700,color:C.green,marginBottom:4 }}>Checked In</div><div style={{ fontSize:13,color:C.muted,marginBottom:16 }}>Since {todayRecord.checkIn}</div><Btn variant="danger" onClick={doCheckOut}>Check Out</Btn></>
              ):(
                <div style={{ padding:"12px 16px",background:`${C.green}18`,borderRadius:8 }}>
                  <div style={{ fontSize:14,color:C.green,fontWeight:600 }}>Session complete · {todayRecord.checkIn} – {todayRecord.checkOut}</div>
                </div>
              )}
            </Card>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
              <Stat label="This Month" value={myAtt.length} color={C.amber} />
              <Stat label="Active Members" value={myMembers.length} />
              <Stat label="Transformations" value={me.transformationCount||0} color={C.purple} />
            </div>
          </>
        )}
        {tab==="profile"&&(
          <Card>
            <div style={{ display:"flex",gap:14,alignItems:"flex-start",marginBottom:16 }}>
              <Avatar name={me.name} color={C.amber} size={64} photoUrl={me.photoUrl} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700,color:C.text,fontSize:16 }}>{me.name}</div>
                <div style={{ fontSize:13,color:C.muted,marginBottom:8 }}>{me.speciality}</div>
                <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}><TierBadge tier={me.tier||"silver"} />{me.expYears>0&&<Badge color={C.blue}>{me.expYears} years exp</Badge>}{me.transformationCount>0&&<Badge color={C.purple}>{me.transformationCount} transformations</Badge>}</div>
              </div>
            </div>
            {me.about&&<div style={{ fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:14,padding:"10px 14px",background:C.surface,borderRadius:8 }}>{me.about}</div>}
            <InfoRow label="📞 Phone" value={me.phone} />
            <InfoRow label="📧 Email" value={me.email} />
            {Array.isArray(me.certifications)&&me.certifications.length>0&&(
              <div style={{ marginTop:12 }}>
                <div style={{ fontSize:12,color:C.muted,marginBottom:8,fontWeight:600 }}>CERTIFICATIONS</div>
                {me.certifications.map((c,i)=>(
                  <div key={i} style={{ display:"flex",justifyContent:"space-between",background:C.surface,borderRadius:8,padding:"8px 12px",marginBottom:6 }}>
                    <div style={{ fontSize:13,color:C.text }}>{c.name}</div>
                    <div style={{ fontSize:12,color:C.muted }}>{c.year}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
        {tab==="attendance"&&(
          <>
            <SectionHeader title="My Attendance" />
            {myAtt.map(a=>(
              <Card key={a.id} style={{ marginBottom:8 }}>
                <div style={{ display:"flex",justifyContent:"space-between" }}>
                  <div><div style={{ fontWeight:600,color:C.text }}>{a.date}</div><div style={{ fontSize:12,color:C.muted }}>{a.checkIn||a.check_in} → {a.checkOut||a.check_out||"ongoing"}</div></div>
                  <Badge color={C.green}>{a.method}</Badge>
                </div>
              </Card>
            ))}
            <SectionHeader title="Members Today" />
            {attendance.filter(a=>(a.gymId===gym.id||a.gym_id===gym.id)&&a.date===todayStr&&(a.userType==="member"||a.user_type==="member")).map(a=>{
              const m=members.find(x=>x.id===(a.userId||a.user_id));
              return (
                <Card key={a.id} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                      <Avatar name={m?.name||"?"} size={30} color={C.blue} photoUrl={m?.photoUrl} />
                      <div><div style={{ fontSize:13,fontWeight:600,color:C.text }}>{m?.name}</div><div style={{ fontSize:11,color:C.muted }}>{a.checkIn||a.check_in}</div></div>
                    </div>
                    <Badge color={C.green}>Present</Badge>
                  </div>
                </Card>
              );
            })}
          </>
        )}
        {tab==="members"&&myMembers.map(m=>(
          <Card key={m.id} style={{ marginBottom:8 }}>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <Avatar name={m.name} color={C.blue} photoUrl={m.photoUrl} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600,color:C.text }}>{m.name}</div>
                <div style={{ fontSize:12,color:C.muted }}>{m.plan} plan</div>
                {m.healthIssues&&<div style={{ fontSize:11,color:C.amber,marginTop:2 }}>⚕ {m.healthIssues}</div>}
              </div>
            </div>
          </Card>
        ))}
        {tab==="classes"&&<ClassBooking classes={classes} setClasses={setClasses} gymId={gym.id} showToast={showToast} isAdmin={false} />}
        {tab==="equipment"&&<EquipmentTracker equipment={equipment} setEquipment={setEquipment} gymId={gym.id} isAdmin={false} showToast={showToast} memberId={me.id} />}
      </div>
    </div>
  );
};

// ─── MEMBER APP ───────────────────────────────────────────────────────────────
const MemberApp = ({ gyms, members, attendance, setAttendance, content:ct, events, transformations, feedback, setFeedback, classes, setClasses, equipment, setEquipment, metrics, setMetrics, challenges, partners, showToast }) => {
  const [tab, setTab] = useState("home");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [scanning, setScanning] = useState(false);
  const gym = gyms[0];
  const me = members[0];
  const myAtt = me ? attendance.filter(a=>(a.userId||a.user_id)===me.id&&(a.userType||a.user_type)==="member") : [];
  const todayRecord = myAtt.find(a=>a.date===todayStr);
  const checkedIn = todayRecord&&!todayRecord.checkOut&&!todayRecord.check_out;

  if (!me) return <div style={{ color:C.muted,padding:20,textAlign:"center" }}>No member profile found.</div>;

  const doCheckIn = () => {
    if (todayRecord) return;
    setScanning(true);
    setTimeout(async()=>{
      const time = new Date().toTimeString().slice(0,5);
      try {
        const row = await db.insert("attendance_logs",{ user_id:me.id,user_type:"member",gym_id:gym.id,date:todayStr,check_in:time,method:"qr" });
        setAttendance(a=>[...a,mapAtt(row)]);
        showToast("Checked in!");
      } catch(e){ showToast("Error","error"); }
      setScanning(false);
    },1800);
  };

  const doCheckOut = async () => {
    if (!todayRecord) return;
    const time = new Date().toTimeString().slice(0,5);
    try {
      await db.update("attendance_logs",todayRecord.id,{check_out:time});
      setAttendance(a=>a.map(x=>x.id===todayRecord.id?{...x,checkOut:time}:x));
      showToast("See you tomorrow!");
    } catch(e){ showToast("Error","error"); }
  };

  const submitFeedback = async () => {
    if (!form.message) return;
    try {
      const row = await db.insert("feedback",{ gym_id:gym.id,member_id:form.anonymous?null:me.id,user_name:form.anonymous?"Anonymous":me.name,message:form.message,type:form.anonymous?"anonymous":"named",date:todayStr });
      setFeedback(fb=>[...fb,{...row,gymId:row.gym_id,user:row.user_name}]);
      showToast("Feedback submitted!"); setModal(null); setForm({});
    } catch(e){ showToast("Error","error"); }
  };

  const tabs=[{id:"home",label:"Home",icon:"◉"},{id:"checkin",label:"Check In",icon:"⬡"},{id:"feed",label:"Feed",icon:"◈"},{id:"classes",label:"Classes",icon:"📅"},{id:"more",label:"More",icon:"···"}];

  return (
    <div style={{ background:C.bg,minHeight:"100vh",maxWidth:420,margin:"0 auto",paddingBottom:80 }}>
      <div style={{ padding:"20px 20px 14px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          <Avatar name={me.name} color={C.blue} size={40} photoUrl={me.photoUrl} />
          <div>
            <div style={{ fontSize:11,color:C.blue,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase" }}>◉ Member</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:C.text }}>Hey, {me.name.split(" ")[0]} 👋</div>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:20,fontWeight:800,color:C.accent,fontFamily:"'Bebas Neue',sans-serif" }}>{me.points}</div>
          <div style={{ fontSize:10,color:C.muted,fontWeight:600 }}>REWARD PTS</div>
        </div>
      </div>

      <div style={{ padding:"0 20px 14px" }}>
        {tab==="home"&&(
          <>
            <Card style={{ marginBottom:16,background:checkedIn?`${C.green}0A`:C.card,borderColor:checkedIn?`${C.green}44`:C.border }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:12,color:C.muted,marginBottom:4 }}>Today's status</div>
                  <div style={{ fontSize:15,fontWeight:700,color:checkedIn?C.green:todayRecord?C.text:C.muted }}>
                    {checkedIn?`✓ At gym since ${todayRecord.checkIn||todayRecord.check_in}`:todayRecord?"Session complete":"Not checked in yet"}
                  </div>
                </div>
                {!todayRecord&&<Btn small onClick={()=>setTab("checkin")}>Check In →</Btn>}
              </div>
            </Card>
            {me.healthIssues&&(
              <div style={{ background:`${C.amber}0D`,border:`1px solid ${C.amber}44`,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:C.amber }}>
                ⚕ Health note: {me.healthIssues}
              </div>
            )}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
              <Stat label="Total Sessions" value={myAtt.length} />
              <Stat label="Reward Points" value={me.points} color={C.accent} />
            </div>
            <SectionHeader title="Quick Actions" />
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16 }}>
              {[
                {label:"Feedback",icon:"💬",color:C.blue,action:()=>setModal("feedback")},
                {label:"My Progress",icon:"📏",color:C.teal,action:()=>setModal("metrics")},
                {label:"Challenges",icon:"🏆",color:C.amber,action:()=>setModal("challenges")},
                {label:"Buddy Match",icon:"👫",color:C.pink,action:()=>setModal("buddy")},
                {label:"Equipment",icon:"🔧",color:C.orange,action:()=>setModal("equipment")},
                {label:"Partners",icon:"🤝",color:C.purple,action:()=>setModal("partners")},
              ].map(q=>(
                <Card key={q.label} onClick={q.action} style={{ textAlign:"center",padding:"12px 8px",cursor:"pointer",border:`1px solid ${q.color}33` }}>
                  <div style={{ fontSize:22,marginBottom:4 }}>{q.icon}</div>
                  <div style={{ fontSize:11,fontWeight:600,color:q.color }}>{q.label}</div>
                </Card>
              ))}
            </div>
            {/* Gym Info Card */}
            {(gym.address||gym.phone)&&(
              <Card style={{ marginBottom:16 }}>
                <div style={{ fontSize:12,color:C.muted,fontWeight:600,marginBottom:8 }}>YOUR GYM</div>
                {gym.logo_url&&<img src={gym.logo_url} alt={gym.name} style={{ height:28,marginBottom:8,borderRadius:4 }}/>}
                <div style={{ fontWeight:700,color:C.text,marginBottom:6 }}>{gym.name}</div>
                <InfoRow label="📍" value={gym.address} />
                <InfoRow label="📞" value={gym.phone} />
                <InfoRow label="🕐" value={gym.timings?.default||gym.timings} />
                {Array.isArray(gym.facilities)&&gym.facilities.length>0&&(
                  <div style={{ marginTop:8,display:"flex",flexWrap:"wrap",gap:4 }}>
                    {gym.facilities.map(f=><Badge key={f} color={C.blue}>{f}</Badge>)}
                  </div>
                )}
              </Card>
            )}
            <SectionHeader title="Transformation Stories" />
            {transformations.filter(t=>t.gymId===gym.id||t.gym_id===gym.id).map(t=>(
              <Card key={t.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex",gap:12 }}>
                  <div style={{ textAlign:"center",minWidth:68,background:C.surface,borderRadius:8,padding:8 }}>
                    <div style={{ fontSize:10,color:C.muted }}>Before</div>
                    <div style={{ fontSize:16,fontWeight:800,color:C.red,fontFamily:"'Bebas Neue',sans-serif" }}>{t.before_weight||t.before}</div>
                    <div style={{ fontSize:16,color:C.accent }}>→</div>
                    <div style={{ fontSize:10,color:C.muted }}>After</div>
                    <div style={{ fontSize:16,fontWeight:800,color:C.green,fontFamily:"'Bebas Neue',sans-serif" }}>{t.after_weight||t.after}</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700,color:C.text,marginBottom:4 }}>{t.member_name||t.member}</div>
                    <div style={{ fontSize:12,color:C.muted,marginBottom:6,lineHeight:1.5 }}>{t.story}</div>
                    <Badge color={C.accent}>{t.duration}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {tab==="checkin"&&(
          <div style={{ textAlign:"center",paddingTop:20 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:32,color:C.text,marginBottom:4 }}>{gym.name}</div>
            {gym.address&&<div style={{ fontSize:13,color:C.muted,marginBottom:28 }}>📍 {gym.address}</div>}
            {scanning?(<div style={{ padding:40 }}><div style={{ fontSize:48,marginBottom:16 }}>📷</div><div style={{ fontSize:15,color:C.accent,fontWeight:600 }}>Scanning...</div></div>)
            :!todayRecord?(<>
              <div style={{ width:170,height:170,background:C.surface,borderRadius:16,margin:"0 auto 24px",display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${C.border}` }}>
                <svg viewBox="0 0 60 60" width="140" height="140">
                  <rect x="2" y="2" width="24" height="24" rx="3" fill="none" stroke={C.accent} strokeWidth="2"/><rect x="8" y="8" width="12" height="12" rx="1" fill={C.accent}/>
                  <rect x="34" y="2" width="24" height="24" rx="3" fill="none" stroke={C.accent} strokeWidth="2"/><rect x="40" y="8" width="12" height="12" rx="1" fill={C.accent}/>
                  <rect x="2" y="34" width="24" height="24" rx="3" fill="none" stroke={C.accent} strokeWidth="2"/><rect x="8" y="40" width="12" height="12" rx="1" fill={C.accent}/>
                  <rect x="34" y="34" width="6" height="6" rx="1" fill={C.accent}/><rect x="44" y="34" width="6" height="6" rx="1" fill={C.accent}/>
                  <rect x="34" y="44" width="6" height="6" rx="1" fill={C.accent}/><rect x="52" y="44" width="6" height="6" rx="1" fill={C.accent}/>
                  <rect x="44" y="52" width="14" height="6" rx="1" fill={C.accent}/>
                </svg>
              </div>
              <div style={{ fontSize:13,color:C.muted,marginBottom:24 }}>Point your camera at the gym QR code.</div>
              <Btn onClick={doCheckIn}>📷 Scan & Check In</Btn>
            </>):!todayRecord.checkOut&&!todayRecord.check_out?(<>
              <div style={{ width:100,height:100,borderRadius:"50%",background:`${C.green}18`,border:`2px solid ${C.green}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:40 }}>✓</div>
              <div style={{ fontSize:22,fontWeight:800,color:C.green,marginBottom:4,fontFamily:"'Bebas Neue',sans-serif" }}>YOU'RE IN!</div>
              <div style={{ fontSize:13,color:C.muted,marginBottom:24 }}>Since {todayRecord.checkIn||todayRecord.check_in}</div>
              <Btn variant="danger" onClick={doCheckOut}>Check Out</Btn>
            </>):(
              <div style={{ padding:24 }}>
                <div style={{ fontSize:40,marginBottom:16 }}>🏋️</div>
                <div style={{ fontSize:18,fontWeight:700,color:C.text,marginBottom:8 }}>Great workout!</div>
                <div style={{ fontSize:13,color:C.muted }}>{todayRecord.checkIn||todayRecord.check_in} – {todayRecord.checkOut||todayRecord.check_out}</div>
              </div>
            )}
          </div>
        )}

        {tab==="feed"&&ct.filter(c=>c.gymId===gym.id||c.gym_id===gym.id).map(c=>(
          <Card key={c.id} style={{ marginBottom:12 }}>
            <div style={{ display:"flex",gap:12 }}>
              <div style={{ width:52,height:52,borderRadius:10,background:c.type==="video"?`${C.red}22`:c.type==="image"?`${C.blue}22`:`${C.green}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>{c.type==="video"?"▶":c.type==="image"?"🖼":"📖"}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",gap:6,marginBottom:6 }}><Badge color={c.type==="video"?C.red:c.type==="image"?C.blue:C.green}>{c.type}</Badge><Badge color={C.muted}>{c.category}</Badge></div>
                <div style={{ fontWeight:700,color:C.text,marginBottom:4 }}>{c.title}</div>
                <div style={{ fontSize:11,color:C.faint }}>{c.date} · ♥ {c.likes}</div>
              </div>
            </div>
          </Card>
        ))}

        {tab==="classes"&&(
          <><div style={{ fontSize:15,fontWeight:700,color:C.text,marginBottom:16 }}>Book a Class</div>
          <ClassBooking classes={classes} setClasses={setClasses} gymId={gym.id} showToast={showToast} isAdmin={false} /></>
        )}

        {tab==="more"&&(
          <>
            <div style={{ fontSize:15,fontWeight:700,color:C.text,marginBottom:16 }}>All Features</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20 }}>
              {[
                {label:"Body Metrics",icon:"📏",color:C.teal,action:()=>setModal("metrics")},
                {label:"Challenges",icon:"🏆",color:C.amber,action:()=>setModal("challenges")},
                {label:"Buddy Match",icon:"👫",color:C.pink,action:()=>setModal("buddy")},
                {label:"Equipment",icon:"🔧",color:C.orange,action:()=>setModal("equipment")},
                {label:"Partner Brands",icon:"🤝",color:C.purple,action:()=>setModal("partners")},
                {label:"Events",icon:"📅",color:C.green,action:()=>setModal("events")},
                {label:"Reviews",icon:"⭐",color:C.amber,action:()=>setModal("reviews")},
                {label:"Feedback",icon:"💬",color:C.blue,action:()=>setModal("feedback")},
              ].map(item=>(
                <Card key={item.label} onClick={item.action} style={{ textAlign:"center",padding:"14px 10px",cursor:"pointer",border:`1px solid ${item.color}33` }}>
                  <div style={{ fontSize:26,marginBottom:6 }}>{item.icon}</div>
                  <div style={{ fontSize:12,fontWeight:600,color:item.color }}>{item.label}</div>
                </Card>
              ))}
            </div>
            {/* Profile card */}
            <SectionHeader title="My Profile" />
            <Card style={{ marginBottom:12 }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:12 }}>
                <Avatar name={me.name} size={52} color={C.blue} photoUrl={me.photoUrl} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700,color:C.text,fontSize:15 }}>{me.name}</div>
                  <div style={{ fontSize:12,color:C.muted }}>{me.email}</div>
                  {me.phone&&<div style={{ fontSize:12,color:C.muted }}>📞 {me.phone}</div>}
                  <div style={{ display:"flex",gap:6,marginTop:6 }}><Badge color={C.blue}>{me.plan}</Badge><Badge color={C.green}>Active</Badge></div>
                </div>
              </div>
              {me.address&&<InfoRow label="📍" value={me.address} />}
              {me.dob&&<InfoRow label="🎂 DOB" value={me.dob} />}
              {me.heightCm&&<InfoRow label="📐 Height" value={`${me.heightCm} cm`} />}
              {me.weightKg&&<InfoRow label="⚖️ Weight" value={`${me.weightKg} kg`} />}
              {me.healthIssues&&<InfoRow label="⚕ Health" value={me.healthIssues} />}
              {me.emergencyName&&(
                <div style={{ marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:11,color:C.muted,marginBottom:4,fontWeight:600 }}>EMERGENCY CONTACT</div>
                  <InfoRow label="👤" value={`${me.emergencyName} (${me.emergencyRelation})`} />
                  <InfoRow label="📞" value={me.emergencyPhone} />
                </div>
              )}
              <div style={{ marginTop:12,background:C.surface,borderRadius:10,padding:"10px 14px" }}>
                <div style={{ fontSize:11,color:C.muted,marginBottom:4 }}>Referral code</div>
                <div style={{ fontFamily:"monospace",fontSize:16,fontWeight:800,color:C.accent,letterSpacing:"0.1em" }}>{me.referral_code||`IRON-${me.id?.slice(-4)}`}</div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:420,background:C.surface,borderTop:`1px solid ${C.border}`,display:"flex",padding:"8px 0 16px" }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1,background:"none",border:"none",cursor:"pointer",padding:"6px 0",color:tab===t.id?C.accent:C.faint,fontSize:10,fontWeight:600,fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
            <span style={{ fontSize:16 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* All modals */}
      {modal==="feedback"&&<Modal title="Share Feedback" onClose={()=>{setModal(null);setForm({})}}>
        <Textarea value={form.message||""} onChange={v=>setForm(f=>({...f,message:v}))} placeholder="Tell us what you think..." rows={4} />
        <label style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16,cursor:"pointer" }}><input type="checkbox" checked={!!form.anonymous} onChange={e=>setForm(f=>({...f,anonymous:e.target.checked}))} /><span style={{ fontSize:13,color:C.muted }}>Submit anonymously</span></label>
        <Btn fullWidth onClick={submitFeedback}>Submit Feedback</Btn>
      </Modal>}
      {modal==="metrics"&&<Modal title="Body Metrics" onClose={()=>setModal(null)} wide><BodyMetrics metrics={metrics} setMetrics={setMetrics} memberId={me.id} showToast={showToast} /></Modal>}
      {modal==="challenges"&&<Modal title="Active Challenges" onClose={()=>setModal(null)}><Challenges challenges={challenges} gymId={gym.id} memberId={me.id} showToast={showToast} /></Modal>}
      {modal==="buddy"&&<Modal title="Workout Buddy" onClose={()=>setModal(null)}><BuddyMatch members={members} gymId={gym.id} memberId={me.id} showToast={showToast} /></Modal>}
      {modal==="equipment"&&<Modal title="Equipment Issues" onClose={()=>setModal(null)}><EquipmentTracker equipment={equipment} setEquipment={setEquipment} gymId={gym.id} isAdmin={false} showToast={showToast} memberId={me.id} /></Modal>}
      {modal==="partners"&&<Modal title="Partner Brands" onClose={()=>setModal(null)}><PartnerBrands partners={partners} showToast={showToast} /></Modal>}
      {modal==="reviews"&&<Modal title="Gym Reviews" onClose={()=>setModal(null)}><GymReviews gymId={gym.id} showToast={showToast} /></Modal>}
      {modal==="events"&&<Modal title="Events" onClose={()=>setModal(null)}>
        {events.filter(e=>e.gymId===gym.id||e.gym_id===gym.id).map(e=>(
          <Card key={e.id} style={{ marginBottom:12,borderColor:`${C.accent}33` }}>
            <div style={{ fontWeight:700,color:C.text,marginBottom:4 }}>{e.title}</div>
            <div style={{ fontSize:13,color:C.muted,marginBottom:12 }}>{e.event_date||e.date} · {e.time}</div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div><div style={{ fontSize:12,color:C.muted,marginBottom:4 }}>{e.registered}/{e.slots} registered</div>
              <div style={{ width:140,height:4,background:C.surface,borderRadius:2 }}><div style={{ width:`${(e.registered/e.slots)*100}%`,height:"100%",background:C.accent,borderRadius:2 }} /></div></div>
              <Btn small onClick={async()=>{ try{ await db.insert("event_registrations",{event_id:e.id,member_id:me.id}); showToast("Registered!"); }catch(e){ showToast("Already registered!"); } }}>Register</Btn>
            </div>
          </Card>
        ))}
      </Modal>}
    </div>
  );
};

// ─── SUPER ADMIN APP ──────────────────────────────────────────────────────────
const SuperAdminApp = ({ gyms, setGyms, members, trainers, showToast }) => {
  const [tab, setTab] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const addGym = async () => {
    if (!form.name) return;
    setLoading(true);
    try {
      const row = await db.insert("gyms",{ name:form.name,address:form.address||"",phone:form.phone||"",active:true,check_in_method:form.method||"qr" });
      setGyms(g=>[...g,{...row,gymId:row.id}]);
      showToast("Gym created!"); setModal(null); setForm({});
    } catch(e){ showToast("Error: "+e.message,"error"); }
    setLoading(false);
  };

  const toggleGym = async (gym) => {
    try {
      await db.update("gyms",gym.id,{active:!gym.active});
      setGyms(g=>g.map(x=>x.id===gym.id?{...x,active:!gym.active}:x));
      showToast("Status updated");
    } catch(e){ showToast("Error","error"); }
  };

  return (
    <div style={{ background:C.bg,minHeight:"100vh",maxWidth:420,margin:"0 auto" }}>
      <div style={{ padding:"20px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>
          <div style={{ fontSize:11,color:C.purple,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase" }}>⬡ Super Admin</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:C.text }}>Platform Control</div>
        </div>
        <Avatar name="SA" color={C.purple} size={36} />
      </div>
      <LoadingBar show={loading} />
      <div style={{ display:"flex",gap:6,padding:"16px 20px 0",overflowX:"auto",scrollbarWidth:"none" }}>
        {[{id:"dashboard",label:"Dashboard"},{id:"gyms",label:"Gyms"},{id:"users",label:"Users"},{id:"benchmarks",label:"Benchmarks"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ background:tab===t.id?`${C.purple}22`:"transparent",border:`1px solid ${tab===t.id?C.purple:C.border}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:600,color:tab===t.id?C.purple:C.muted,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap" }}>{t.label}</button>
        ))}
      </div>
      <div style={{ padding:20,paddingBottom:40 }}>
        {tab==="dashboard"&&(
          <>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20 }}>
              <Stat label="Total Gyms" value={gyms.length} color={C.purple} />
              <Stat label="Active" value={gyms.filter(g=>g.active).length} color={C.green} />
              <Stat label="Members" value={members.length} color={C.blue} />
              <Stat label="Trainers" value={trainers.length} color={C.amber} />
            </div>
            <SectionHeader title="All Gyms" />
            {gyms.map(gym=>(
              <Card key={gym.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                  <div style={{ flex:1 }}>
                    {gym.logo_url&&<img src={gym.logo_url} alt={gym.name} style={{ height:24,marginBottom:6,borderRadius:4 }}/>}
                    <div style={{ fontWeight:700,color:C.text,marginBottom:2 }}>{gym.name}</div>
                    {gym.address&&<div style={{ fontSize:12,color:C.muted }}>{gym.address}</div>}
                    {gym.phone&&<div style={{ fontSize:12,color:C.muted }}>📞 {gym.phone}</div>}
                    <div style={{ display:"flex",gap:6,marginTop:8 }}>
                      <Badge color={gym.active?C.green:C.red}>{gym.active?"Active":"Inactive"}</Badge>
                      <Badge color={C.blue}>{(gym.check_in_method||gym.checkInMethod||"qr").toUpperCase()}</Badge>
                    </div>
                  </div>
                  <Btn small variant={gym.active?"danger":"ghost"} onClick={()=>toggleGym(gym)}>{gym.active?"Deactivate":"Activate"}</Btn>
                </div>
              </Card>
            ))}
          </>
        )}
        {tab==="gyms"&&(
          <>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
              <div style={{ fontSize:15,fontWeight:700,color:C.text }}>Manage Gyms</div>
              <Btn small onClick={()=>setModal("addGym")}>+ Add Gym</Btn>
            </div>
            {gyms.map(gym=>(
              <Card key={gym.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex",justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontWeight:700,color:C.text,marginBottom:2 }}>{gym.name}</div>
                    {gym.address&&<div style={{ fontSize:12,color:C.muted,marginBottom:4 }}>{gym.address}</div>}
                    <div style={{ display:"flex",gap:6 }}>
                      <Badge color={gym.active?C.green:C.red}>{gym.active?"Active":"Inactive"}</Badge>
                      <Badge color={C.purple}>{gym.check_in_method||gym.checkInMethod}</Badge>
                    </div>
                  </div>
                  <Btn small variant={gym.active?"danger":"ghost"} onClick={()=>toggleGym(gym)}>{gym.active?"Deactivate":"Reactivate"}</Btn>
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
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <Avatar name={m.name} color={C.blue} size={36} photoUrl={m.photoUrl} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600,color:C.text,fontSize:14 }}>{m.name}</div>
                    <div style={{ fontSize:11,color:C.muted }}>{m.email}</div>
                    {m.phone&&<div style={{ fontSize:11,color:C.muted }}>📞 {m.phone}</div>}
                  </div>
                  <Badge color={m.active?C.green:C.red}>{m.active?"Active":"Inactive"}</Badge>
                </div>
              </Card>
            ))}
            <SectionHeader title="Trainers" />
            {trainers.map(t=>(
              <Card key={t.id} style={{ marginBottom:8 }}>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <Avatar name={t.name} color={C.amber} size={36} photoUrl={t.photoUrl} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600,color:C.text,fontSize:14 }}>{t.name}</div>
                    <div style={{ fontSize:11,color:C.muted }}>{t.speciality}</div>
                  </div>
                  <TierBadge tier={t.tier||"silver"} />
                </div>
              </Card>
            ))}
          </>
        )}
        {tab==="benchmarks"&&<Benchmarking />}
      </div>
      {modal==="addGym"&&<Modal title="Add New Gym" onClose={()=>{setModal(null);setForm({})}}>
        <Input label="Gym Name" value={form.name||""} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="FitZone Whitefield" required />
        <Input label="Address" value={form.address||""} onChange={v=>setForm(f=>({...f,address:v}))} placeholder="123 Main Rd, Bengaluru" />
        <Input label="Phone" value={form.phone||""} onChange={v=>setForm(f=>({...f,phone:v}))} type="tel" />
        <Select label="Check-in Method" value={form.method||"qr"} onChange={v=>setForm(f=>({...f,method:v}))} options={[{value:"qr",label:"QR Code"},{value:"biometric",label:"Biometric"},{value:"both",label:"Both"}]} />
        <Btn fullWidth loading={loading} onClick={addGym}>Create Gym</Btn>
      </Modal>}
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [role,  setRole]      = useState(null);
  const [toast, setToast]     = useState(null);
  const [toastType, setToastType] = useState("success");
  const [gyms,  setGyms]      = useState([]);
  const [members,  setMembers]   = useState([]);
  const [trainers, setTrainers]  = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [ct, setCt]           = useState([]);
  const [fb, setFb]           = useState([]);
  const [hl, setHl]           = useState([]);
  const [classes,   setClasses]  = useState([]);
  const [equipment, setEquipment]= useState([]);
  const [metrics,   setMetrics]  = useState([]);
  const [challenges,setChallenges]=useState([]);
  const [events,    setEvents]   = useState([]);
  const [transformations,setTransformations]=useState([]);
  const [partners,  setPartners] = useState([]);
  const [dbLoading, setDbLoading]=useState(false);

  // Load font
  useEffect(()=>{
    const l=document.createElement("link");
    l.rel="stylesheet";
    l.href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap";
    document.head.appendChild(l);
  },[]);

  // Load global data from Supabase on startup
  useEffect(()=>{
    const loadAll = async () => {
      setDbLoading(true);
      try {
        const [gymData,partnerData,challengeData] = await Promise.all([
          db.load("gyms"),
          db.load("partners",{active:true}),
          db.load("challenges"),
        ]);
        setGyms(gymData.map(g=>({...g,gymId:g.id,checkInMethod:g.check_in_method})));
        setPartners(partnerData);
        setChallenges(challengeData.map(c=>({...c,gymId:c.gym_id})));

        if (gymData.length>0) {
          const gid = gymData[0].id;
          const [evData,trData] = await Promise.all([
            db.load("events",{gym_id:gid}),
            db.load("transformations",{gym_id:gid,approved:true}),
          ]);
          setEvents(evData.map(e=>({...e,gymId:e.gym_id})));
          setTransformations(trData.map(t=>({...t,gymId:t.gym_id})));
        }
      } catch(e){ console.error("Startup load:",e.message); }
      setDbLoading(false);
    };
    loadAll();
  },[]);

  const showToast = useCallback((msg, type="success") => {
    setToast(msg); setToastType(type);
    setTimeout(()=>setToast(null), 2600);
  },[]);

  const roles = {
    superadmin: { label:"Super Admin", color:C.purple, icon:"⬡" },
    gymadmin:   { label:"Gym Admin",   color:C.accent, icon:"◈" },
    trainer:    { label:"Trainer",     color:C.amber,  icon:"◎" },
    member:     { label:"Member",      color:C.blue,   icon:"◉" },
  };

  if (!role) return (
    <div style={{ minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif" }}>
      {dbLoading&&<div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:C.accent,opacity:0.8 }}/>}
      <div style={{ fontSize:11,color:C.muted,letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:600,marginBottom:6 }}>Welcome to</div>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:52,color:C.text,letterSpacing:"0.06em",lineHeight:1,marginBottom:4 }}>IRONFORGE</div>
      <div style={{ fontSize:11,color:C.accent,letterSpacing:"0.14em",marginBottom:6,fontWeight:600 }}>GYM MANAGEMENT · POWERED BY VAULTR</div>
      <div style={{ fontSize:11,color:C.faint,marginBottom:36,textAlign:"center",lineHeight:1.6 }}>
        {dbLoading?"Connecting to database…":"Full production app · Select your role to continue"}
      </div>
      <div style={{ width:"100%",maxWidth:360 }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20 }}>
          {Object.entries(roles).map(([key,r])=>(
            <div key={key} onClick={()=>!dbLoading&&setRole(key)} style={{ background:C.card,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"18px 12px",cursor:dbLoading?"not-allowed":"pointer",textAlign:"center",transition:"all 0.2s",opacity:dbLoading?0.5:1 }}
              onMouseEnter={e=>{ if(!dbLoading){e.currentTarget.style.borderColor=r.color;e.currentTarget.style.background=`${r.color}18`;} }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.card; }}>
              <div style={{ fontSize:24,marginBottom:8,color:r.color }}>{r.icon}</div>
              <div style={{ fontSize:13,fontWeight:700,color:C.text }}>{r.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:11,color:C.faint,textAlign:"center" }}>Demo mode — uses your Supabase database</div>
      </div>
    </div>
  );

  const shared = {
    gyms, setGyms, members, setMembers, trainers, setTrainers,
    attendance, setAttendance, content:ct, setContent:setCt,
    feedback:fb, setFeedback:setFb, events, setEvents,
    transformations, holidays:hl, setHolidays:setHl,
    classes, setClasses, equipment, setEquipment,
    metrics, setMetrics, challenges, partners, showToast,
  };

  return (
    <div style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",background:C.bg,minHeight:"100vh" }}>
      <div style={{ position:"fixed",top:14,right:16,zIndex:500 }}>
        <button onClick={()=>setRole(null)} style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"5px 12px",fontSize:11,color:C.muted,cursor:"pointer",fontFamily:"inherit",fontWeight:600 }}>⟵ Switch Role</button>
      </div>
      {role==="superadmin"&&<SuperAdminApp {...shared} />}
      {role==="gymadmin"  &&gyms.length>0&&<GymAdminApp {...shared} />}
      {role==="trainer"   &&trainers.length>0&&<TrainerApp {...shared} />}
      {role==="member"    &&members.length>0&&<MemberApp {...shared} />}
      {(role==="gymadmin"&&gyms.length===0)||(role==="trainer"&&trainers.length===0)||(role==="member"&&members.length===0)
        ? <div style={{ color:C.muted,padding:40,textAlign:"center",fontSize:14 }}>
            No data found in database for this role.<br/>
            <span style={{ fontSize:12,color:C.faint }}>Add a gym, trainer, or member in Supabase first.</span>
          </div>
        : null}
      {toast&&<Toast msg={toast} type={toastType} />}
    </div>
  );
}
