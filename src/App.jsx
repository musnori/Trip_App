import React, { useEffect, useMemo, useState } from "react";
import { loadState, saveState } from "./storage.js";
import Nav from "./components/Nav.jsx";
import EditableText from "./components/EditableText.jsx";
import Schedule from "./components/Schedule.jsx";
import Photos from "./components/Photos.jsx";
import Memories from "./components/Memories.jsx";
import DataPanel from "./components/DataPanel.jsx";

function msToCountdown(targetDate) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return "旅が始まったよ ✈️";
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const m = Math.floor(diff / (1000 * 60)) % 60;
  return `あと ${d}日 ${h}時間 ${m}分`;
}

export default function App() {
  const [state, setState] = useState(() => loadState());
  const [page, setPage] = useState("home");
  const tripDate = useMemo(() => new Date(state.tripStartISO + "T00:00:00"), [state.tripStartISO]);

  // autosave
  useEffect(() => {
    saveState(state);
  }, [state]);

  // countdown tick
  const [countdown, setCountdown] = useState(() => msToCountdown(tripDate));
  useEffect(() => {
    const tick = () => setCountdown(msToCountdown(tripDate));
    tick();
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, [tripDate]);

  const heroStyle = {
    backgroundImage: `url('/hero-bg.png')`
  };

  return (
    <div className="app">
      <header className="hero" style={heroStyle}>
        <div className="heroOverlay">
          <div className="topRow">
            <img className="appIcon" src="/app-icon.png" alt="app icon" />
            <div className="titles">
              <EditableText
                value={state.appTitle}
                placeholder="アプリ名"
                onChange={(v) => setState((s) => ({ ...s, appTitle: v }))}
                className="title"
              />
              <div className="subtitle">
                <EditableText
                  value={state.partnerA}
                  placeholder="あなた"
                  onChange={(v) => setState((s) => ({ ...s, partnerA: v }))}
                  className="name"
                />
                <span className="heart">♡</span>
                <EditableText
                  value={state.partnerB}
                  placeholder="彼女"
                  onChange={(v) => setState((s) => ({ ...s, partnerB: v }))}
                  className="name"
                />
              </div>
            </div>

            <div className="tripBox">
              <label className="label">旅行開始日</label>
              <input
                className="input"
                type="date"
                value={state.tripStartISO}
                onChange={(e) => setState((s) => ({ ...s, tripStartISO: e.target.value }))}
              />
              <div className="countdown">{countdown}</div>
            </div>
          </div>

          <Nav page={page} setPage={setPage} />
        </div>
      </header>

      <main className="main">
        {page === "home" && (
          <section className="card">
            <h2>今日のメモ</h2>
            <p className="muted">
              予定・写真・思い出を、2人でどんどん追加していこう。
              （編集は全部この画面のボタンからできるよ）
            </p>
            <div className="grid2">
              <div className="miniCard">
                <h3>直近の予定</h3>
                <ul className="list">
                  {state.schedule.slice(0, 5).map((it) => (
                    <li key={it.id} className="row">
                      <span className="chip">{it.time || "--:--"}</span>
                      <span className={it.done ? "done" : ""}>{it.text}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn" onClick={() => setPage("schedule")}>予定を編集</button>
              </div>

              <div className="miniCard scrapbook">
                <h3>写真</h3>
                <div className="photoStrip">
                  {state.photos.slice(0, 4).map((p) => (
                    <img key={p.id} className="thumb" src={p.dataUrl} alt={p.caption || "photo"} />
                  ))}
                  {state.photos.length === 0 && <div className="muted">まだ写真がないよ</div>}
                </div>
                <button className="btn" onClick={() => setPage("photos")}>写真を追加</button>
              </div>
            </div>
          </section>
        )}

        {page === "schedule" && (
          <Schedule state={state} setState={setState} />
        )}

        {page === "photos" && (
          <Photos state={state} setState={setState} />
        )}

        {page === "memories" && (
          <Memories state={state} setState={setState} />
        )}

        {page === "data" && (
          <DataPanel state={state} setState={setState} />
        )}
      </main>

      <footer className="footer">
        <span className="muted">Couple Trip • localStorage保存（ブラウザ内）</span>
      </footer>
    </div>
  );
}
