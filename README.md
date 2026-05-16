import { useState, useEffect } from "react";

const PRICING = {
  single:  { audits: 1,  price: 4.99,  label: "Single Audit",  popular: false },
  starter: { audits: 5,  price: 19.99, label: "Starter Pack",  popular: true  },
  pro:     { audits: 15, price: 49.99, label: "Pro Pack",       popular: false },
};
const COST_PER_AUDIT_CENTS = 2;

const BLUE = "#4f8ef7";
const CYAN = "#00d4ff";
const DARK = "#0d0d1a";
const CARD = "#13131f";
const BORDER = "#1e1e35";
const G = "#1a1a2e";

const systemPrompt = `You are an elite SEO strategist for local service businesses — landscaping, lawn care, home services, plumbing, HVAC, etc.

Audit the given website content and return ONLY a valid JSON object, no markdown, no backticks:
{
  "overallScore": number,
  "contentType": "string",
  "dimensions": {
    "localSEO":       { "score": number, "label": "Local SEO" },
    "keywords":       { "score": number, "label": "Keyword Optimization" },
    "contentQuality": { "score": number, "label": "Content Quality" },
    "onPage":         { "score": number, "label": "On-Page Structure" },
    "competitive":    { "score": number, "label": "Competitive Edge" },
    "conversion":     { "score": number, "label": "Conversion Readiness" }
  },
  "quickWins": ["string","string","string"],
  "strategicRecs": ["string","string","string"],
  "criticalIssues": [],
  "targetKeywords": ["string","string","string","string","string"],
  "estimatedTrafficGain": "string"
}`;

function getCredits() {
  try { return parseInt(localStorage.getItem("seo_credits") || "0"); } catch { return 0; }
}
function saveCredits(n) {
  try { localStorage.setItem("seo_credits", String(n)); } catch {}
}

function ScoreRing({ score, size = 118 }) {
  const sw = 9, r = (size - sw) / 2, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? CYAN : score >= 50 ? "#f7c948" : "#f75f4f";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={G} strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)" }}/>
    </svg>
  );
}

function Bar({ label, score }) {
  const color = score >= 75 ? CYAN : score >= 50 ? "#f7c948" : "#f75f4f";
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontSize:12, color:"#888" }}>{label}</span>
        <span style={{ fontSize:12, fontWeight:700, color }}>{score}</span>
      </div>
      <div style={{ height:5, background:G, borderRadius:3, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${score}%`, background:color, borderRadius:3, transition:"width 1.1s ease" }}/>
      </div>
    </div>
  );
}

function Pill({ text, color, bg }) {
  return (
    <div style={{
      background:bg, border:`1px solid ${color}55`, borderRadius:8,
      padding:"9px 13px", marginBottom:7, fontSize:12.5,
      color, lineHeight:1.55, fontFamily:"'Lora',serif"
    }}>{text}</div>
  );
}

function PurchaseModal({ onClose, onPurchase }) {
  const [selected, setSelected] = useState("starter");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleBuy = () => {
    setLoading(true);
    setTimeout(() => {
      saveCredits(getCredits() + PRICING[selected].audits);
      setLoading(false);
      setDone(true);
      setTimeout(() => { onPurchase(); onClose(); }, 1400);
    }, 1800);
  };

  const pkg = PRICING[selected];
  const margin = (pkg.price - (pkg.audits * COST_PER_AUDIT_CENTS / 100)).toFixed(2);

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.85)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:1000, padding:20
    }}>
      <div style={{
        background:CARD, border:`1px solid ${BORDER}`, borderRadius:20,
        padding:"36px 28px", maxWidth:420, width:"100%",
        boxShadow:"0 40px 80px rgba(0,0,0,0.6)"
      }}>
        {done ? (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✓</div>
            <div style={{ fontSize:20, fontWeight:700, color:CYAN }}>Credits Added!</div>
            <div style={{ fontSize:13, color:"#666", marginTop:8 }}>Redirecting…</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize:10, letterSpacing:3, color:BLUE, textTransform:"uppercase", marginBottom:8 }}>Unlock Your Audit</div>
            <h2 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800 }}>Buy Audit Credits</h2>
            <p style={{ margin:"0 0 24px", fontSize:13, color:"#666", fontFamily:"'Lora',serif" }}>
              One credit = one full SEO report. No subscription. Credits never expire.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
              {Object.entries(PRICING).map(([key, p]) => (
                <div key={key} onClick={() => setSelected(key)} style={{
                  border:`1.5px solid ${selected===key ? BLUE : BORDER}`,
                  borderRadius:12, padding:"14px 16px", cursor:"pointer",
                  background: selected===key ? "rgba(79,142,247,0.08)" : "transparent",
                  position:"relative", transition:"all 0.15s"
                }}>
                  {p.popular && (
                    <div style={{
                      position:"absolute", top:-10, right:14,
                      background:BLUE, color:"#fff", fontSize:10,
                      padding:"2px 10px", borderRadius:20, letterSpacing:1, fontWeight:700
                    }}>BEST VALUE</div>
                  )}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14 }}>{p.label}</div>
                      <div style={{ fontSize:12, color:"#666", marginTop:2 }}>
                        {p.audits} audit{p.audits>1?"s":""} · ${(p.price/p.audits).toFixed(2)}/audit
                      </div>
                    </div>
                    <div style={{ fontWeight:800, fontSize:18, color: selected===key ? BLUE : "#ccc" }}>
                      ${p.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              background:"rgba(0,212,255,0.06)", border:`1px solid ${CYAN}33`,
              borderRadius:10, padding:"11px 14px", marginBottom:20,
              fontSize:12, color:"#aaa", fontFamily:"'Lora',serif"
            }}>
              💡 Owner margin on this pack: <strong style={{color:CYAN}}>${margin}</strong> after API costs
            </div>
            <button onClick={handleBuy} disabled={loading} style={{
              width:"100%", background:`linear-gradient(135deg,${BLUE},${CYAN})`,
              border:"none", borderRadius:11, padding:"15px",
              color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", opacity:loading?0.7:1
            }}>
              {loading ? "Processing…" : `Pay $${pkg.price} →`}
            </button>
            <div style={{ textAlign:"center", marginTop:10, fontSize:11, color:"#444" }}>
              🔒 Stripe-secured · Instant delivery · No subscription
            </div>
            <button onClick={onClose} style={{
              display:"block", margin:"12px auto 0", background:"none",
              border:"none", color:"#444", fontSize:12, cursor:"pointer"
            }}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [credits, setCreditsState] = useState(0);
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [tab, setTab] = useState("audit");

  useEffect(() => { setCreditsState(getCredits()); }, []);

  const handleAudit = async () => {
    if (!content.trim() || content.length < 50) { setError("Paste at least 50 characters."); return; }
    const c = getCredits();
    if (c < 1) { setShowPaywall(true); return; }
    setError(null); setLoading(true); setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:systemPrompt,
          messages:[{ role:"user", content:`Audit this website content:\n\n${content}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.find(b=>b.type==="text")?.text || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      const remaining = getCredits() - 1;
      saveCredits(remaining);
      setCreditsState(remaining);
      setResult(parsed);
    } catch { setError("Audit failed — please try again."); }
    finally { setLoading(false); }
  };

  const grade = s => s>=85?"Excellent":s>=70?"Good":s>=55?"Fair":s>=40?"Poor":"Critical";
  const gColor = s => s>=75?CYAN:s>=50?"#f7c948":"#f75f4f";

  return (
    <div style={{ minHeight:"100vh", background:DARK, color:"#f0f0f0", fontFamily:"'DM Sans',sans-serif", paddingBottom:60 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{
        background:`linear-gradient(135deg,#0d0d1a,#111128)`,
        borderBottom:`1px solid ${BORDER}`, padding:"26px 22px 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12
      }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:3, color:BLUE, textTransform:"uppercase", marginBottom:4 }}>SEO Audit Tool</div>
          <h1 style={{ margin:0, fontSize:22, fontWeight:800, letterSpacing:-0.5 }}>
            RankReady <span style={{color:CYAN}}>·</span> Local SEO
          </h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            background:credits>0?"rgba(0,212,255,0.1)":"rgba(247,95,79,0.1)",
            border:`1px solid ${credits>0?CYAN+"55":"#f75f4f55"}`,
            borderRadius:20, padding:"6px 14px", fontSize:13, fontWeight:700,
            color:credits>0?CYAN:"#f75f4f"
          }}>{credits} credit{credits!==1?"s":""}</div>
          <button onClick={()=>setShowPaywall(true)} style={{
            background:`linear-gradient(135deg,${BLUE},${CYAN})`,
            border:"none", borderRadius:20, padding:"6px 16px",
            color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer"
          }}>+ Buy Credits</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:`1px solid ${BORDER}`, background:CARD }}>
        {[["audit","🔍 Audit Tool"],["monetize","💰 Monetize"]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{
            padding:"13px 22px", background:"none", border:"none",
            borderBottom:`2px solid ${tab===key?BLUE:"transparent"}`,
            color:tab===key?"#fff":"#555", fontSize:13, fontWeight:700,
            cursor:"pointer", transition:"all 0.15s"
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth:760, margin:"0 auto", padding:"0 18px" }}>

        {tab==="audit" && (
          <>
            <div style={{ marginTop:28 }}>
              <label style={{ fontSize:11, color:"#555", letterSpacing:2, textTransform:"uppercase" }}>Paste Website Content</label>
              <textarea value={content} onChange={e=>setContent(e.target.value)}
                placeholder="Paste homepage, service page, blog post, or about page here…"
                rows={8} style={{
                  display:"block", width:"100%", boxSizing:"border-box", marginTop:10,
                  background:"#111", border:`1px solid ${BORDER}`, borderRadius:12,
                  padding:"14px", color:"#e0e0e0", fontSize:13.5,
                  fontFamily:"'Lora',serif", lineHeight:1.7, resize:"vertical", outline:"none"
                }}
                onFocus={e=>e.target.style.borderColor=BLUE}
                onBlur={e=>e.target.style.borderColor=BORDER}
              />
              {error && <div style={{ marginTop:7, color:"#f75f4f", fontSize:12 }}>{error}</div>}
              <button onClick={handleAudit} disabled={loading} style={{
                marginTop:14, width:"100%",
                background:loading?"#1a1a2e":`linear-gradient(135deg,${BLUE},${CYAN})`,
                border:"none", borderRadius:11, padding:"15px",
                color:"#fff", fontSize:14, fontWeight:800,
                cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1
              }}>
                {loading?"Analyzing…":credits>0?`Run SEO Audit (uses 1 credit) →`:"Buy Credits to Audit →"}
              </button>
              {credits===0&&!loading&&(
                <p style={{ textAlign:"center", fontSize:12, color:"#444", marginTop:10, fontFamily:"'Lora',serif" }}>
                  <span onClick={()=>setShowPaywall(true)} style={{ color:BLUE, cursor:"pointer", textDecoration:"underline" }}>
                    Get started from $4.99
                  </span>
                </p>
              )}
            </div>

            {result && (
              <div style={{ marginTop:36 }}>
                <div style={{
                  background:CARD, border:`1px solid ${BORDER}`, borderRadius:16,
                  padding:"26px 22px", display:"flex", gap:22, alignItems:"center",
                  flexWrap:"wrap", marginBottom:16
                }}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <ScoreRing score={result.overallScore}/>
                    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:28, fontWeight:800 }}>{result.overallScore}</span>
                      <span style={{ fontSize:10, color:"#555" }}>/ 100</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize:10, color:"#555", letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>{result.contentType}</div>
                    <div style={{ fontSize:26, fontWeight:800, color:gColor(result.overallScore) }}>{grade(result.overallScore)}</div>
                    {result.estimatedTrafficGain && (
                      <div style={{ marginTop:8, background:"rgba(0,212,255,0.07)", border:`1px solid ${CYAN}33`, borderRadius:8, padding:"7px 12px", fontSize:12, color:CYAN, fontFamily:"'Lora',serif" }}>
                        📈 {result.estimatedTrafficGain}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"22px", marginBottom:16 }}>
                  <div style={{ fontSize:10, color:"#444", letterSpacing:2, textTransform:"uppercase", marginBottom:16 }}>Score Breakdown</div>
                  {Object.values(result.dimensions).map(d=><Bar key={d.label} label={d.label} score={d.score}/>)}
                </div>

                {result.criticalIssues?.length>0&&(
                  <div style={{ background:"rgba(247,95,79,0.06)", border:"1px solid #f75f4f44", borderRadius:16, padding:"22px", marginBottom:16 }}>
                    <div style={{ fontSize:10, color:"#f75f4f", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>⚠ Critical Issues</div>
                    {result.criticalIssues.map((x,i)=><Pill key={i} text={x} color="#f75f4f" bg="rgba(247,95,79,0.08)"/>)}
                  </div>
                )}

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                  <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"22px" }}>
                    <div style={{ fontSize:10, color:CYAN, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>✦ Quick Wins</div>
                    {result.quickWins.map((x,i)=><Pill key={i} text={x} color={CYAN} bg="rgba(0,212,255,0.07)"/>)}
                  </div>
                  <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"22px" }}>
                    <div style={{ fontSize:10, color:"#f7c948", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>◈ Strategy</div>
                    {result.strategicRecs.map((x,i)=><Pill key={i} text={x} color="#f7c948" bg="rgba(247,201,72,0.07)"/>)}
                  </div>
                </div>

                <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"22px", marginBottom:16 }}>
                  <div style={{ fontSize:10, color:"#aaa", letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>🎯 Target Keywords</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {result.targetKeywords.map((kw,i)=>(
                      <div key={i} style={{ background:"rgba(79,142,247,0.1)", border:`1px solid ${BLUE}44`, borderRadius:20, padding:"6px 14px", fontSize:12.5, color:BLUE }}>{kw}</div>
                    ))}
                  </div>
                </div>

                <button onClick={()=>{setResult(null);setContent("");}} style={{
                  width:"100%", background:"transparent", border:`1px solid ${BORDER}`,
                  borderRadius:11, padding:"13px", color:"#444", fontSize:13, cursor:"pointer"
                }}>← Audit Another Page</button>
              </div>
            )}
          </>
        )}

        {tab==="monetize" && (
          <div style={{ marginTop:28 }}>
            <div style={{ fontSize:10, color:BLUE, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>Business Model</div>
            <h2 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800 }}>How to Monetize This</h2>
            <p style={{ margin:"0 0 28px", fontSize:13, color:"#666", fontFamily:"'Lora',serif" }}>
              You built it. Here's how to turn it into real revenue.
            </p>

            {/* Unit economics */}
            <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"24px", marginBottom:16 }}>
              <div style={{ fontSize:10, color:CYAN, letterSpacing:2, textTransform:"uppercase", marginBottom:16 }}>Unit Economics (Per Pack Sold)</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {Object.entries(PRICING).map(([key,pkg])=>{
                  const cost = pkg.audits * COST_PER_AUDIT_CENTS / 100;
                  const margin = pkg.price - cost;
                  const pct = Math.round((margin/pkg.price)*100);
                  return (
                    <div key={key} style={{ background:G, borderRadius:12, padding:"18px 12px", textAlign:"center" }}>
                      <div style={{ fontSize:11, color:"#555", marginBottom:7 }}>{pkg.label}</div>
                      <div style={{ fontSize:20, fontWeight:800, color:CYAN }}>${pkg.price}</div>
                      <div style={{ fontSize:11, color:"#444", margin:"5px 0" }}>API cost ~${cost.toFixed(2)}</div>
                      <div style={{ fontSize:14, fontWeight:700, color:"#7af77a" }}>${margin.toFixed(2)} profit</div>
                      <div style={{ fontSize:11, color:"#555", marginTop:3 }}>{pct}% gross margin</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GTM */}
            <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"24px", marginBottom:16 }}>
              <div style={{ fontSize:10, color:"#f7c948", letterSpacing:2, textTransform:"uppercase", marginBottom:16 }}>Go-To-Market Playbook</div>
              {[
                ["🎯","Niche down first","List on Gumroad or Lemon Squeezy targeting landscapers, lawn care, and home services specifically. Niche audiences convert 3–5x faster than broad."],
                ["📣","Facebook Groups","Groups like 'Lawn Care Business Owners' have 50K+ members. Post a free audit offer, collect emails, pitch the tool. Zero ad spend."],
                ["🤝","Web designer affiliates","Partner with designers who build sites for small biz owners — offer 30% per sale. They pitch it, you split the margin."],
                ["📦","Done-for-you tier","Charge $29–49 for a 'managed audit' — you run the tool + write a 1-page action plan. High perceived value, low extra work."],
                ["🔁","Subscription upsell","After first purchase, offer 4 audits/month for $24.99/mo. Monthly recurring = the real prize."],
              ].map(([icon,title,body],i)=>(
                <div key={i} style={{ display:"flex", gap:14, marginBottom:18, paddingBottom:18, borderBottom:i<4?`1px solid ${BORDER}`:"none" }}>
                  <div style={{ fontSize:22, flexShrink:0, marginTop:1 }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{title}</div>
                    <div style={{ fontSize:13, color:"#777", fontFamily:"'Lora',serif", lineHeight:1.6 }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Projections */}
            <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"24px", marginBottom:16 }}>
              <div style={{ fontSize:10, color:"#7af77a", letterSpacing:2, textTransform:"uppercase", marginBottom:16 }}>Revenue Projections</div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ color:"#555", fontSize:11, textTransform:"uppercase", letterSpacing:1 }}>
                      {["Scenario","Packs/Mo","Avg Pack","Revenue","Profit"].map(h=>(
                        <th key={h} style={{ textAlign:"left", padding:"8px 10px", borderBottom:`1px solid ${BORDER}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Side hustle","10","Starter $19.99","~$200","~$196"],
                      ["Part-time","50","Starter $19.99","~$1,000","~$980"],
                      ["Scaled","200","Pro $49.99","~$10,000","~$9,700"],
                    ].map(([s,m,a,r,p],i)=>(
                      <tr key={i} style={{ borderBottom:`1px solid ${BORDER}22` }}>
                        <td style={{ padding:"11px 10px", fontWeight:700 }}>{s}</td>
                        <td style={{ padding:"11px 10px", color:"#888" }}>{m}</td>
                        <td style={{ padding:"11px 10px", color:"#888" }}>{a}</td>
                        <td style={{ padding:"11px 10px", color:CYAN, fontWeight:700 }}>{r}</td>
                        <td style={{ padding:"11px 10px", color:"#7af77a", fontWeight:700 }}>{p}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop:12, fontSize:11, color:"#444", fontFamily:"'Lora',serif" }}>
                * After API costs (~$0.02/audit). Stripe fees (~2.9% + $0.30/transaction) not included.
              </div>
            </div>

            {/* Tech stack */}
            <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"24px" }}>
              <div style={{ fontSize:10, color:"#aaa", letterSpacing:2, textTransform:"uppercase", marginBottom:16 }}>Ship It: Tech Stack</div>
              {[
                ["Frontend","This React app — deploy free on Vercel or Netlify in 5 minutes"],
                ["Payments","Stripe Checkout — 15 min to integrate, handles tax, receipts, refunds"],
                ["Credits","Stripe webhook → Supabase credits table → app reads on load"],
                ["Auth","Clerk.dev free tier — Google or email login in under an hour"],
                ["Domain","Namecheap ~$10/yr — e.g. rankready.io or localseoaudit.com"],
              ].map(([label,detail],i)=>(
                <div key={i} style={{ display:"flex", gap:14, marginBottom:12, alignItems:"flex-start" }}>
                  <div style={{ background:`${BLUE}22`, border:`1px solid ${BLUE}44`, borderRadius:6, padding:"4px 10px", fontSize:11, color:BLUE, fontWeight:700, flexShrink:0, marginTop:1 }}>{label}</div>
                  <div style={{ fontSize:13, color:"#888", fontFamily:"'Lora',serif", lineHeight:1.6 }}>{detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showPaywall && (
        <PurchaseModal
          onClose={()=>setShowPaywall(false)}
          onPurchase={()=>setCreditsState(getCredits())}
        />
      )}
    </div>
  );
}
