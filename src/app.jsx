import { useState, useEffect } from "react";

const PRICING = {
  single:  { audits: 1,  price: 4.99,  label: "Single Audit",  desc: "Try it out", popular: false },
  starter: { audits: 5,  price: 19.99, label: "Starter Pack",  desc: "Most popular", popular: true  },
  pro:     { audits: 15, price: 49.99, label: "Pro Pack",       desc: "Best value", popular: false },
};

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

function PurchaseModal({ onClose, onPurchase, defaultPlan }) {
  const [selected, setSelected] = useState(defaultPlan || "starter");
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
            <div style={{ fontSize:13, color:"#666", marginTop:8 }}>You're ready to audit.</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize:10, letterSpacing:3, color:BLUE, textTransform:"uppercase", marginBottom:8 }}>Checkout</div>
            <h2 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800 }}>Choose Your Pack</h2>
            <p style={{ margin:"0 0 24px", fontSize:13, color:"#666", fontFamily:"'Lora',serif" }}>
              One credit = one full SEO audit report. No subscription. Credits never expire.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
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
                    }}>MOST POPULAR</div>
                  )}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14 }}>{p.label}</div>
                      <div style={{ fontSize:12, color:"#666", marginTop:2 }}>
                        {p.audits} audit{p.audits>1?"s":""} · ${(p.price/p.audits).toFixed(2)} per audit
                      </div>
                    </div>
                    <div style={{ fontWeight:800, fontSize:18, color: selected===key ? BLUE : "#ccc" }}>
                      ${p.price}
                    </div>
                  </div>
                </div>
              ))}
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
  const [defaultPlan, setDefaultPlan] = useState("starter");
  const [tab, setTab] = useState("audit");

  useEffect(() => { setCreditsState(getCredits()); }, []);

  const handleAudit = async () => {
    if (!content.trim() || content.length < 50) { setError("Paste at least 50 characters."); return; }
    const c = getCredits();
    if (c < 1) { setShowPaywall(true); return; }
    setError(null); setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/audit", {
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

  const openCheckout = (plan) => { setDefaultPlan(plan); setShowPaywall(true); };

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
          <div style={{ fontSize:10, letterSpacing:3, color:BLUE, textTransform:"uppercase", marginBottom:4 }}>Local SEO Tool</div>
          <h1 style={{ margin:0, fontSize:22, fontWeight:800, letterSpacing:-0.5 }}>
            RankReady <span style={{color:CYAN}}>·</span> SEO Auditor
          </h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            background:credits>0?"rgba(0,212,255,0.1)":"rgba(247,95,79,0.1)",
            border:`1px solid ${credits>0?CYAN+"55":"#f75f4f55"}`,
            borderRadius:20, padding:"6px 14px", fontSize:13, fontWeight:700,
            color:credits>0?CYAN:"#f75f4f"
          }}>{credits} credit{credits!==1?"s":""}</div>
          <button onClick={()=>openCheckout("starter")} style={{
            background:`linear-gradient(135deg,${BLUE},${CYAN})`,
            border:"none", borderRadius:20, padding:"6px 16px",
            color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer"
          }}>+ Buy Credits</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:`1px solid ${BORDER}`, background:CARD }}>
        {[["audit","🔍 Audit"],["pricing","💳 Pricing"]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{
            padding:"13px 22px", background:"none", border:"none",
            borderBottom:`2px solid ${tab===key?BLUE:"transparent"}`,
            color:tab===key?"#fff":"#555", fontSize:13, fontWeight:700,
            cursor:"pointer", transition:"all 0.15s"
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth:760, margin:"0 auto", padding:"0 18px" }}>

        {/* ── AUDIT TAB ── */}
        {tab==="audit" && (
          <>
            <div style={{ marginTop:28 }}>
              <label style={{ fontSize:11, color:"#555", letterSpacing:2, textTransform:"uppercase" }}>
                Paste Your Website Content
              </label>
              <textarea value={content} onChange={e=>setContent(e.target.value)}
                placeholder="Paste your homepage, service page, blog post, or about page here…"
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
                {loading?"Analyzing your content…":credits>0?`Run SEO Audit — 1 Credit →`:"Buy Credits to Get Started →"}
              </button>
              {credits===0&&!loading&&(
                <p style={{ textAlign:"center", fontSize:12, color:"#444", marginTop:10, fontFamily:"'Lora',serif" }}>
                  <span onClick={()=>setTab("pricing")} style={{ color:BLUE, cursor:"pointer", textDecoration:"underline" }}>
                    View pricing — starting at $4.99
                  </span>
                </p>
              )}
            </div>

            {result && (
              <div style={{ marginTop:36 }}>
                {/* Score */}
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

                {/* Bars */}
                <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"22px", marginBottom:16 }}>
                  <div style={{ fontSize:10, color:"#444", letterSpacing:2, textTransform:"uppercase", marginBottom:16 }}>Score Breakdown</div>
                  {Object.values(result.dimensions).map(d=><Bar key={d.label} label={d.label} score={d.score}/>)}
                </div>

                {/* Critical */}
                {result.criticalIssues?.length>0&&(
                  <div style={{ background:"rgba(247,95,79,0.06)", border:"1px solid #f75f4f44", borderRadius:16, padding:"22px", marginBottom:16 }}>
                    <div style={{ fontSize:10, color:"#f75f4f", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>⚠ Critical Issues</div>
                    {result.criticalIssues.map((x,i)=><Pill key={i} text={x} color="#f75f4f" bg="rgba(247,95,79,0.08)"/>)}
                  </div>
                )}

                {/* Quick Wins + Strategic */}
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

                {/* Keywords */}
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

        {/* ── PRICING TAB ── */}
        {tab==="pricing" && (
          <div style={{ marginTop:28 }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ fontSize:10, color:BLUE, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>Simple Pricing</div>
              <h2 style={{ margin:"0 0 10px", fontSize:26, fontWeight:800 }}>Pay Per Audit. No Subscription.</h2>
              <p style={{ margin:0, fontSize:14, color:"#666", fontFamily:"'Lora',serif" }}>
                Buy a pack of credits and use them whenever you need. Credits never expire.
              </p>
            </div>

            {/* Pricing cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:32 }}>
              {Object.entries(PRICING).map(([key,pkg])=>(
                <div key={key} style={{
                  background: pkg.popular ? `linear-gradient(135deg,${G},#1e1e3a)` : CARD,
                  border:`1.5px solid ${pkg.popular?BLUE:BORDER}`,
                  borderRadius:16, padding:"28px 22px", position:"relative",
                  textAlign:"center"
                }}>
                  {pkg.popular && (
                    <div style={{
                      position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)",
                      background:BLUE, color:"#fff", fontSize:10,
                      padding:"3px 14px", borderRadius:20, letterSpacing:1, fontWeight:700,
                      whiteSpace:"nowrap"
                    }}>MOST POPULAR</div>
                  )}
                  <div style={{ fontSize:13, color:"#888", marginBottom:6 }}>{pkg.label}</div>
                  <div style={{ fontSize:36, fontWeight:800, color:"#fff", lineHeight:1 }}>${pkg.price}</div>
                  <div style={{ fontSize:12, color:"#555", margin:"6px 0 20px" }}>
                    ${(pkg.price/pkg.audits).toFixed(2)} per audit
                  </div>
                  <div style={{ marginBottom:20 }}>
                    {[
                      `${pkg.audits} full audit report${pkg.audits>1?"s":""}`,
                      "6-dimension score breakdown",
                      "Quick wins + strategy",
                      "Keyword recommendations",
                      "Credits never expire",
                    ].map((feature,i)=>(
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, textAlign:"left" }}>
                        <span style={{ color:CYAN, fontSize:14 }}>✓</span>
                        <span style={{ fontSize:12.5, color:"#aaa", fontFamily:"'Lora',serif" }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>openCheckout(key)} style={{
                    width:"100%",
                    background: pkg.popular ? `linear-gradient(135deg,${BLUE},${CYAN})` : "transparent",
                    border:`1.5px solid ${pkg.popular?BLUE:BORDER}`,
                    borderRadius:10, padding:"12px",
                    color: pkg.popular?"#fff":"#888",
                    fontSize:13, fontWeight:700, cursor:"pointer"
                  }}>
                    Get Started →
                  </button>
                </div>
              ))}
            </div>

            {/* What you get */}
            <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"24px", marginBottom:16 }}>
              <div style={{ fontSize:10, color:CYAN, letterSpacing:2, textTransform:"uppercase", marginBottom:18 }}>What Every Audit Includes</div>
              {[
                ["📊","Overall SEO Score","A single 0–100 score so you know exactly where you stand against competitors."],
                ["🔬","6-Dimension Breakdown","Scored across Local SEO, Keywords, Content Quality, On-Page Structure, Competitive Edge, and Conversion Readiness."],
                ["⚡","Quick Wins","3 fixes you can make today that will move the needle fast."],
                ["🗺","Strategic Recommendations","3 longer-term moves for sustained ranking growth."],
                ["🎯","Keyword Targets","5 high-value keywords you should be targeting right now."],
                ["📈","Traffic Estimate","Projected organic traffic improvement if you implement the recommendations."],
              ].map(([icon,title,body],i)=>(
                <div key={i} style={{ display:"flex", gap:14, marginBottom:i<5?18:0, paddingBottom:i<5?18:0, borderBottom:i<5?`1px solid ${BORDER}`:"none" }}>
                  <div style={{ fontSize:20, flexShrink:0, marginTop:2 }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{title}</div>
                    <div style={{ fontSize:13, color:"#777", fontFamily:"'Lora',serif", lineHeight:1.6 }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"24px" }}>
              <div style={{ fontSize:10, color:"#aaa", letterSpacing:2, textTransform:"uppercase", marginBottom:18 }}>FAQ</div>
              {[
                ["Do credits expire?","No — credits never expire. Buy now, use whenever."],
                ["What kind of content can I audit?","Any website text — homepages, service pages, blog posts, about pages, location pages."],
                ["What industries does this work for?","Any local service business — landscaping, lawn care, HVAC, plumbing, roofing, cleaning, and more."],
              ].map(([q,a],i)=>(
                <div key={i} style={{ marginBottom:i<2?18:0, paddingBottom:i<2?18:0, borderBottom:i<2?`1px solid ${BORDER}`:"none" }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:5 }}>{q}</div>
                  <div style={{ fontSize:13, color:"#777", fontFamily:"'Lora',serif", lineHeight:1.6 }}>{a}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showPaywall && (
        <PurchaseModal
          defaultPlan={defaultPlan}
          onClose={()=>setShowPaywall(false)}
          onPurchase={()=>setCreditsState(getCredits())}
        />
      )}
    </div>
  );
}
