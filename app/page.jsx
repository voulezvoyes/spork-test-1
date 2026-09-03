"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const FORK_COLORS = ["#ffffff","#d4d4d4","#a3a3a3","#737373","#525252"];
const ROOT_ID = "root";
const genId = () => Math.random().toString(36).slice(2,8);

function makeBranch(id, parentId, forkIdx, msgs, ci, label) {
  return {
    id, parentId, forkIdx,
    messages: msgs ? [...msgs] : [],
    color: FORK_COLORS[ci % FORK_COLORS.length],
    label: label || (id === ROOT_ID ? "main" : `branch·${id.slice(0,3)}`),
    colorIdx: ci,
    createdAt: new Date(),
  };
}

function buildChildren(branches) {
  const c = {};
  Object.keys(branches).forEach(id => { c[id] = []; });
  Object.values(branches).forEach(b => { if (b.parentId) c[b.parentId]?.push(b.id); });
  return c;
}

function SporkIcon({ size = 20, spinning = false, dark = false }) {
  const stroke = dark ? "#f0f0f0" : "#1a1a1a";
  const bg = dark ? "#1a1a1a" : "transparent";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      style={spinning ? { animation:"spin 1.4s linear infinite", display:"block" } : { display:"block" }}>
      <circle cx="50" cy="50" r="48" fill={bg}/>
      <line x1="35" y1="18" x2="35" y2="36" stroke={stroke} strokeWidth="4" strokeLinecap="round"/>
      <line x1="43" y1="16" x2="43" y2="36" stroke={stroke} strokeWidth="4" strokeLinecap="round"/>
      <line x1="51" y1="16" x2="51" y2="36" stroke={stroke} strokeWidth="4" strokeLinecap="round"/>
      <line x1="59" y1="18" x2="59" y2="36" stroke={stroke} strokeWidth="4" strokeLinecap="round"/>
      <path d="M35 36 Q35 44 47 46 Q59 44 59 36" fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="47" y1="46" x2="47" y2="66" stroke={stroke} strokeWidth="5" strokeLinecap="round"/>
      <ellipse cx="47" cy="76" rx="12" ry="9" fill="none" stroke={stroke} strokeWidth="4"/>
      <line x1="47" y1="56" x2="40" y2="50" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.45"/>
      <line x1="47" y1="56" x2="54" y2="50" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.45"/>
    </svg>
  );
}

export default function Spork() {
  const [branches, setBranches] = useState({ [ROOT_ID]: makeBranch(ROOT_ID, null, null, [], 0, "main") });
  const [activeId, setActiveId] = useState(ROOT_ID);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [colorCt, setColorCt] = useState(1);
  const [treeOpen, setTreeOpen] = useState(false);
  const [hoveredMsg, setHoveredMsg] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const endRef = useRef(null);
  const taRef = useRef(null);

  const active = branches[activeId];
  const msgs = active?.messages || [];
  const children = buildChildren(branches);
  const allBranches = Object.values(branches);

  const [sessions] = useState([
    { id:"s1", title:"진로 고민", preview:"퇴사를 먼저 해야 할까...", branches:3 },
    { id:"s2", title:"소개글 작성", preview:"LA에 사는 한국계 미국인...", branches:2 },
    { id:"s3", title:"앱 이름 아이디어", preview:"AI 챗봇에 대화 브랜치...", branches:5 },
    { id:"s4", title:"코드 디버깅", preview:"TypeError: cannot read...", branches:1 },
    { id:"s5", title:"여행 계획", preview:"도쿄 3박 4일 일정...", branches:4 },
  ]);
  const [activeSession, setActiveSession] = useState("current");

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length, loading]);

  const send = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMsgs = [...msgs, userMsg];
    setBranches(p => ({ ...p, [activeId]: { ...p[activeId], messages: newMsgs } }));
    const userText = input.trim();
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    setLoading(true);

    await new Promise(r => setTimeout(r, 700));

    let reply = "";
    const t = userText.toLowerCase();
    if (t.includes("la") || t.includes("los angeles") || t.includes("여행")) {
      reply = "좋아. LA 3일 여행이라면 먼저 방향을 잡아볼 수 있어. Day 1은 Downtown과 Arts District, Day 2는 Santa Monica와 Venice, Day 3는 Griffith Observatory와 Los Feliz를 중심으로 구성해볼게. 여기서 예산, 음식, 이동 방식, 분위기에 따라 서로 다른 방향으로 더 깊게 발전시킬 수 있어.";
    } else if (t.includes("저예산") || t.includes("budget")) {
      reply = "저예산 방향으로 이어가면 대중교통과 무료 명소를 중심으로 다시 구성할 수 있어. 숙소 위치와 식비까지 포함해 하루 예산을 낮추는 방향으로 세부 일정을 짜볼게.";
    } else if (t.includes("럭셔리") || t.includes("luxury")) {
      reply = "럭셔리 방향으로 이어가면 숙소, 레스토랑, 이동 수단을 업그레이드하고 일정 밀도를 낮춰 경험 중심으로 구성할 수 있어. 같은 원래 계획에서 완전히 다른 버전으로 발전시켜볼게.";
    } else if (t.includes("이름") || t.includes("name")) {
      reply = "가능성을 여러 방향으로 탐색해보자. 기능 중심 이름, 감성적인 이름, 기술적인 이름처럼 서로 다른 방향을 만들 수 있어. 마음에 드는 지점에서 branch를 만들어 각각 발전시켜봐.";
    } else {
      reply = "이 아이디어에는 몇 가지 서로 다른 방향이 있어. 지금 답변의 특정 지점에서 다른 가능성을 따로 탐색하고 싶다면 그 지점에서 새 branch를 만들어 이어갈 수 있어.";
    }

    setBranches(p => ({
      ...p,
      [activeId]: { ...p[activeId], messages: [...newMsgs, { role: "assistant", content: reply }] }
    }));
    setLoading(false);
  }, [input, loading, msgs, activeId]);

  const fork = useCallback((msgIdx) => {
    const newId = genId();
    const inherited = msgs.slice(0, msgIdx + 1);
    const nb = makeBranch(newId, activeId, msgIdx, inherited, colorCt, `branch·${newId.slice(0,3)}`);
    setBranches(p => ({ ...p, [newId]: nb }));
    setColorCt(c => c + 1);
    setActiveId(newId);
    setTreeOpen(false);
  }, [msgs, activeId, colorCt]);

  function TreeNode({ id, depth }) {
    const b = branches[id];
    if (!b) return null;
    const isActive = id === activeId;
    const kids = children[id] || [];
    return (
      <div>
        <button onClick={() => { setActiveId(id); setTreeOpen(false); }} style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          padding: `6px ${10 + depth * 14}px`, borderRadius: 8, marginBottom: 2,
          background: isActive ? "rgba(0,0,0,0.1)" : "transparent",
          border: `1px solid ${isActive ? "rgba(0,0,0,0.18)" : "transparent"}`,
          cursor: "pointer", textAlign: "left", transition: "all .15s",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? "#fff" : "rgba(0,0,0,0.28)", display: "block", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: isActive ? "#fff" : "rgba(0,0,0,0.42)", fontWeight: isActive ? 600 : 400, flex: 1 }}>{b.label}</span>
          <span style={{ fontSize: 10, color: "rgba(0,0,0,0.22)", background: "rgba(0,0,0,0.08)", borderRadius: 10, padding: "1px 6px" }}>{b.messages.length}</span>
        </button>
        {kids.map(cid => <TreeNode key={cid} id={cid} depth={depth + 1} />)}
      </div>
    );
  }

  const glass = (opacity = 0.07, border = 0.12) => ({
    background: `rgba(255,255,255,${opacity})`,
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: `1px solid rgba(255,255,255,${border})`,
  });

  return (
    <div style={{ height: "100vh", display: "flex", position: "relative", overflow: "hidden", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
        textarea { resize: none; }
        textarea:focus, button:focus { outline: none; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { from{opacity:0;transform:scale(.96) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes float {
          0%,100%{transform:translateY(0px) translateX(0px)}
          33%{transform:translateY(-18px) translateX(8px)}
          66%{transform:translateY(10px) translateX(-6px)}
        }
        @keyframes pulse { 0%,100%{opacity:.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
        @keyframes shimmer { from{opacity:.4} to{opacity:.9} }
        .sidebar-btn:hover { background: rgba(0,0,0,0.08) !important; }
        .fork-btn-wrap { transition: opacity .2s; }
      `}</style>

      <div style={{ position: "absolute", inset: 0, background: "#e5e5e5", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)", top: "10%", left: "20%", animation: "float 12s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 70%)", bottom: "15%", right: "15%", animation: "float 16s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,0,0,0.015) 0%, transparent 70%)", top: "50%", right: "35%", animation: "float 20s ease-in-out infinite 4s" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px", opacity: 0.3 }} />
      </div>

      {sidebarOpen && (
        <div style={{ width: 232, flexShrink: 0, position: "relative", zIndex: 10, display: "flex", flexDirection: "column", ...glass(0.06, 0.1), borderRight: "1px solid rgba(0,0,0,0.08)", borderLeft: "none", borderTop: "none", borderBottom: "none", borderRadius: 0 }}>
          <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, ...glass(0.12, 0.2), display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(0,0,0,0.12)" }}>
              <SporkIcon size={18} dark={true}/>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: "-0.5px" }}>spork</div>
              <div style={{ fontSize: 10, color: "rgba(0,0,0,0.22)", letterSpacing: "0.04em" }}>conversation branching</div>
            </div>
          </div>

          <div style={{ padding: "12px 12px 8px" }}>
            <button style={{ width: "100%", padding: "9px 14px", borderRadius: 10, ...glass(0.1, 0.18), color: "#111", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 0 0 0 transparent", transition: "all .15s" }}>
              <span style={{ fontSize: 15, opacity: 0.8 }}>+</span> 새 대화
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
            <div style={{ fontSize: 9, color: "rgba(0,0,0,0.18)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 8px 4px" }}>오늘</div>

            <button className="sidebar-btn" onClick={() => setActiveSession("current")} style={{
              width: "100%", padding: "9px 10px", borderRadius: 10, marginBottom: 2,
              background: activeSession === "current" ? "rgba(0,0,0,0.08)" : "transparent",
              border: `1px solid ${activeSession === "current" ? "rgba(0,0,0,0.12)" : "transparent"}`,
              cursor: "pointer", textAlign: "left", transition: "all .15s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#111", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>현재 대화</span>
                <span style={{ fontSize: 10, color: "rgba(0,0,0,0.22)", background: "rgba(0,0,0,0.06)", borderRadius: 10, padding: "1px 6px" }}>{allBranches.length}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(0,0,0,0.22)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {msgs.length > 0 ? msgs[msgs.length - 1].content.slice(0, 30) + "..." : "대화를 시작해보세요"}
              </div>
            </button>

            <div style={{ fontSize: 9, color: "rgba(0,0,0,0.18)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 8px 4px" }}>이전</div>
            {sessions.map(s => (
              <button key={s.id} className="sidebar-btn" onClick={() => setActiveSession(s.id)} style={{
                width: "100%", padding: "9px 10px", borderRadius: 10, marginBottom: 2,
                background: activeSession === s.id ? "rgba(0,0,0,0.08)" : "transparent",
                border: `1px solid ${activeSession === s.id ? "rgba(0,0,0,0.12)" : "transparent"}`,
                cursor: "pointer", textAlign: "left", transition: "all .15s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: activeSession === s.id ? "#fff" : "rgba(0,0,0,0.5)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</span>
                  <span style={{ fontSize: 10, color: "rgba(0,0,0,0.18)", background: "rgba(0,0,0,0.06)", borderRadius: 10, padding: "1px 6px" }}>{s.branches}</span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(0,0,0,0.18)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.preview}</div>
              </button>
            ))}
          </div>

          <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", ...glass(0.14, 0.2), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#111", flexShrink: 0 }}>J</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>James</div>
              <div style={{ fontSize: 10, color: "rgba(0,0,0,0.22)" }}>Free plan</div>
            </div>
            <button style={{ background: "transparent", border: "none", color: "rgba(0,0,0,0.22)", cursor: "pointer", fontSize: 15 }}>⚙</button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 10 }}>
        <div style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, borderBottom: "1px solid rgba(0,0,0,0.07)", ...glass(0.04, 0) }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{ ...glass(0.08, 0.12), border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, padding: "4px 10px", cursor: "pointer", color: "rgba(0,0,0,0.42)", fontSize: 13, transition: "all .15s" }}>
            {sidebarOpen ? "←" : "→"}
          </button>

          <div style={{ display: "flex", gap: 4, overflowX: "auto", flex: 1, scrollbarWidth: "none" }}>
            {allBranches.map(b => {
              const isActive = activeId === b.id;
              return (
                <button key={b.id} onClick={() => setActiveId(b.id)} style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "4px 12px",
                  background: isActive ? "rgba(0,0,0,0.1)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(0,0,0,0.15)" : "transparent"}`,
                  borderRadius: 20, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s",
                  backdropFilter: isActive ? "blur(10px)" : "none",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: isActive ? "#fff" : "rgba(0,0,0,0.22)", display: "block", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: isActive ? "#fff" : "rgba(0,0,0,0.32)", fontWeight: isActive ? 600 : 400 }}>{b.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {active?.parentId && (
          <div style={{ padding: "6px 20px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(0,0,0,0.07)", animation: "fadeUp .2s ease" }}>
            <span style={{ fontSize: 12, color: "rgba(0,0,0,0.32)" }}>⑂</span>
            <span style={{ fontSize: 12, color: "rgba(0,0,0,0.32)" }}>
              <b style={{ color: "rgba(0,0,0,0.7)" }}>{active.label}</b>{" — "}
              {branches[active.parentId]?.label}의 {active.forkIdx + 1}번째 메시지에서 분기됨
            </span>
            <button onClick={() => setActiveId(active.parentId)} style={{ marginLeft: "auto", fontSize: 11, color: "rgba(0,0,0,0.28)", background: "transparent", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, padding: "2px 10px", cursor: "pointer" }}>
              ← 돌아가기
            </button>
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: "28px 0" }}>
          <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 20px" }}>
            {msgs.length === 0 && (
              <div style={{ textAlign: "center", paddingTop: 80 }}>
                <div style={{ width: 72, height: 72, borderRadius: 22, ...glass(0.1, 0.18), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(0,0,0,0.12)" }}>
                  <SporkIcon size={32} dark={true}/>
                </div>
                <div style={{ fontSize: 20, fontWeight: 600, color: "#111", marginBottom: 8, letterSpacing: "-0.5px" }}>spork</div>
                <div style={{ fontSize: 14, color: "rgba(0,0,0,0.28)", lineHeight: 1.7 }}>대화를 시작하고, 어느 지점에서든<br />⑂ fork로 새로운 방향을 열어보세요</div>
              </div>
            )}

            {msgs.map((msg, i) => (
              <div key={i}
                onMouseEnter={() => setHoveredMsg(i)}
                onMouseLeave={() => setHoveredMsg(null)}
                style={{ display: "flex", gap: 10, marginBottom: 16, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start", animation: "fadeUp .18s ease" }}>

                <div style={{ width: 32, height: 32, borderRadius: msg.role === "user" ? "50%" : 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", ...glass(msg.role === "user" ? 0.18 : 0.1, 0.2), boxShadow: "0 0 16px rgba(255,255,255,0.05), inset 0 1px 0 rgba(0,0,0,0.1)", fontSize: 12, fontWeight: 700, color: "#111" }}>
                  {msg.role === "user" ? "J" : <SporkIcon size={16} dark={true}/>}
                </div>

                <div style={{ maxWidth: "72%", ...glass(msg.role === "user" ? 0.15 : 0.07, msg.role === "user" ? 0.22 : 0.1), borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "12px 16px", fontSize: 14, lineHeight: 1.75, color: msg.role === "user" ? "#fff" : "rgba(0,0,0,0.78)", boxShadow: msg.role === "user" ? "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(0,0,0,0.08)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {msg.content}
                </div>

                <div className="fork-btn-wrap" style={{ display: "flex", alignItems: "center", marginTop: 7, opacity: hoveredMsg === i ? 1 : 0 }}>
                  <button onClick={() => fork(i)} style={{ ...glass(0.1, 0.15), border: "1px solid rgba(0,0,0,0.15)", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "rgba(0,0,0,0.65)", cursor: "pointer", fontWeight: 500, transition: "all .15s", whiteSpace: "nowrap", backdropFilter: "blur(10px)" }}>
                    ⑂ fork
                  </button>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-start", animation: "fadeUp .18s ease" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", ...glass(0.1, 0.2), boxShadow: "0 0 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(0,0,0,0.1)" }}>
                  <SporkIcon size={16} spinning={true} />
                </div>
                <div style={{ ...glass(0.07, 0.1), borderRadius: "18px 18px 18px 4px", padding: "14px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(0,0,0,0.08)", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(0,0,0,0.55)", animation: `pulse 1.3s ${i * 0.18}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        <div style={{ padding: "12px 20px 18px", flexShrink: 0, borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <div style={{ maxWidth: 660, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", ...glass(0.08, 0.15), borderRadius: 18, padding: "10px 14px", boxShadow: "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(0,0,0,0.08)" }}>
              <textarea ref={taRef} value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
                }}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="메시지를 입력하세요..."
                rows={1}
                style={{ flex: 1, background: "transparent", border: "none", color: "#111", fontSize: 14, lineHeight: 1.6, padding: 0, fontFamily: "inherit", caretColor: "#111" }}
              />
              <button onClick={send} disabled={loading || !input.trim()} style={{
                ...glass(input.trim() && !loading ? 0.18 : 0.06, input.trim() && !loading ? 0.25 : 0.1),
                border: `1px solid rgba(255,255,255,${input.trim() && !loading ? 0.25 : 0.08})`,
                borderRadius: 12, padding: "7px 16px",
                color: `rgba(255,255,255,${input.trim() && !loading ? 1 : 0.25})`,
                fontSize: 13, fontWeight: 600, cursor: input.trim() && !loading ? "pointer" : "default",
                transition: "all .2s", flexShrink: 0,
                boxShadow: input.trim() && !loading ? "0 0 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(0,0,0,0.15)" : "none",
              }}>전송</button>
            </div>
            <div style={{ textAlign: "center", fontSize: 10, color: "rgba(0,0,0,0.12)", fontFamily: "monospace", marginTop: 7, letterSpacing: "0.05em" }}>
              메시지 위에 마우스 올리면 ⑂ fork
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 90, right: 18, zIndex: 200 }}>
        {treeOpen && (
          <div style={{ position: "absolute", bottom: 56, right: 0, width: 256, ...glass(0.1, 0.15), borderRadius: 18, boxShadow: "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(0,0,0,0.1)", padding: 14, animation: "popIn .2s ease" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#111", marginBottom: 10, padding: "0 4px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>⑂</span> 브랜치 트리
              <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(0,0,0,0.22)", background: "rgba(0,0,0,0.06)", borderRadius: 10, padding: "1px 7px" }}>{allBranches.length}개</span>
            </div>
            <TreeNode id={ROOT_ID} depth={0} />
          </div>
        )}
        <button onClick={() => setTreeOpen(v => !v)} style={{
          width: 46, height: 46, borderRadius: "50%",
          ...glass(treeOpen ? 0.2 : 0.12, 0.22),
          border: "1px solid rgba(0,0,0,0.15)",
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(0,0,0,0.12)",
          fontSize: 20, color: "#111",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .2s",
        }}>
          {treeOpen ? "✕" : "⑂"}
        </button>
      </div>
    </div>
  );
}
