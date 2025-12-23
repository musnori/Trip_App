// src/App.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { loadState, saveState } from "./storage.js";
import Nav from "./components/Nav.jsx";
import EditableText from "./components/EditableText.jsx";
import Schedule from "./components/Schedule.jsx";
import Photos from "./components/Photos.jsx";
import Memories from "./components/Memories.jsx";
import { fetchTrip, upsertTrip, subscribeTrip } from "./remoteStore.js";

function msToCountdown(targetDate) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return "旅が始まったよ ✈️";
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const m = Math.floor(diff / (1000 * 60)) % 60;
  return `あと ${d}日 ${h}時間 ${m}分`;
}

function getTripId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("trip") || "default-trip";
}

export default function App() {
  const tripId = useMemo(() => getTripId(), []);
  const [state, setState] = useState(() => loadState());
  const [page, setPage] = useState("home");

  // 同期状態（UI表示したいなら使える）
  const [syncStatus, setSyncStatus] = useState("connecting"); // connecting | ready | error

  const tripDate = useMemo(
    () => new Date(state.tripStartISO + "T00:00:00"),
    [state.tripStartISO]
  );

  // ローカル保存（常に）
  useEffect(() => {
    saveState(state);
  }, [state]);

  // カウントダウン
  const [countdown, setCountdown] = useState(() => msToCountdown(tripDate));
  useEffect(() => {
    const tick = () => setCountdown(msToCountdown(tripDate));
    tick();
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, [tripDate]);

  // ---- Supabase 同期 ----
  // ループ防止：リモートから反映した直後は、同じ内容を再アップロードしない
  const lastRemoteHashRef = useRef("");
  const isHydratingRef = useRef(false);

  const safeHash = (obj) => {
    // 雑でOK：同一判定用（順序変動があると変わるが、今回用途では十分）
    try {
      return JSON.stringify(obj);
    } catch {
      return String(Date.now());
    }
  };

  // 1) 初回：リモート読み込み。なければローカル初期値を作成
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setSyncStatus("connecting");
      try {
        const remote = await fetchTrip(tripId);

        if (cancelled) return;

        if (remote) {
          isHydratingRef.current = true;
          const h = safeHash(remote);
          lastRemoteHashRef.current = h;
          setState(remote);
          // localStorageにも保存される（上のeffect）
          isHydratingRef.current = false;
        } else {
          // 初回だけ：今のローカル状態をDBに作成
          await upsertTrip(tripId, state);
          lastRemoteHashRef.current = safeHash(state);
        }

        setSyncStatus("ready");
      } catch (e) {
        console.error(e);
        setSyncStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  // 2) 他端末更新：Realtime購読して反映
  useEffect(() => {
    const unsub = subscribeTrip(tripId, (next) => {
      // nextが同じなら反映しない
      const h = safeHash(next);
      if (h === lastRemoteHashRef.current) return;

      isHydratingRef.current = true;
      lastRemoteHashRef.current = h;
      setState(next);
      isHydratingRef.current = false;
    });

    return () => unsub?.();
  }, [tripId]);

  // 3) ローカル変更：debounceしてリモートへ保存
  useEffect(() => {
    // 初回remote反映中はアップロードしない
    if (isHydratingRef.current) return;

    const h = safeHash(state);
    // 直近でremoteから来た状態と同じなら送らない
    if (h === lastRemoteHashRef.current) return;

    const t = setTimeout(() => {
      upsertTrip(tripId, state)
        .then(() => {
          lastRemoteHashRef.current = h;
          if (syncStatus !== "ready") setSyncStatus("ready");
        })
        .catch((e) => {
          console.error(e);
          setSyncStatus("error");
        });
    }, 400);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, tripId]);

  const tripRange = useMemo(() => {
    const dates = state.schedule
      .map((item) => item.dateISO)
      .filter(Boolean)
      .sort();
    const start = dates[0] || state.tripStartISO;
    const end = dates[dates.length - 1] || state.tripStartISO;
    return { start, end };
  }, [state.schedule, state.tripStartISO]);

  return (
    <div className="app">
      <header className="hero">
        <div className="heroBar">
          <button className="iconButton" type="button" aria-label="戻る">
            ←
          </button>
          <div className="heroTitleBlock">
            <div className="heroTitleRow">
              <span className="heroIcon" role="img" aria-label="ヤシの木">
                🌴
              </span>
              <EditableText
                value={state.appTitle}
                placeholder="旅のタイトル"
                onChange={(v) => setState((s) => ({ ...s, appTitle: v }))}
                className="heroTitle"
              />
            </div>
            <div className="heroDates">
              {tripRange.start} - {tripRange.end}
              <span className="heroZone">UTC+9</span>
            </div>
          </div>
          <button className="iconButton" type="button" aria-label="メッセージ">
            💬
          </button>
        </div>

        <div className="heroCard">
          <div className="heroMeta">
            <div className="heroNames">
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
            <div className="syncStatus">
              Trip ID: <b>{tripId}</b>{" "}
              {syncStatus === "connecting" && "• 同期中…"}
              {syncStatus === "ready" && "• 同期OK"}
              {syncStatus === "error" && "• 同期エラー（キー/ポリシー確認）"}
            </div>
          </div>

          <div className="tripBox">
            <div className="tripBoxHeader">
              <label className="label">旅行開始日</label>
              <span className="countdown">{countdown}</span>
            </div>
            <input
              className="input"
              type="date"
              value={state.tripStartISO}
              onChange={(e) => setState((s) => ({ ...s, tripStartISO: e.target.value }))}
            />
          </div>
        </div>

        <Nav page={page} setPage={setPage} />
      </header>

      <main className="main">
        {page === "home" && (
          <section className="card">
            <h2>今日のメモ</h2>
            <p className="muted">
              予定・写真・思い出を、2人でどんどん追加していこう。
              （同じURLを開いていれば、内容も同期されるよ）
            </p>

            <div className="grid2">
              <div className="miniCard">
                <h3>直近の予定</h3>
                <ul className="list">
                  {state.schedule.slice(0, 5).map((it) => (
                    <li key={it.id} className="row">
                      <span className="chip">{it.time || "--:--"}</span>
                      {/* scheduleのフィールド名が text or title どっちでも表示できるように保険 */}
                      <span className={it.done ? "done" : ""}>
                        {it.text ?? it.title ?? ""}
                      </span>
                    </li>
                  ))}
                </ul>
                <button className="btn" onClick={() => setPage("schedule")}>
                  予定を編集
                </button>
              </div>

              <div className="miniCard scrapbook">
                <h3>写真</h3>
                <div className="photoStrip">
                  {state.photos.slice(0, 4).map((p) => (
                    <img
                      key={p.id}
                      className="thumb"
                      src={p.dataUrl}
                      alt={p.caption || "photo"}
                    />
                  ))}
                  {state.photos.length === 0 && (
                    <div className="muted">まだ写真がないよ</div>
                  )}
                </div>
                <button className="btn" onClick={() => setPage("photos")}>
                  写真を追加
                </button>
              </div>
            </div>
          </section>
        )}

        {page === "schedule" && <Schedule state={state} setState={setState} />}
        {page === "photos" && <Photos state={state} setState={setState} />}
        {page === "memories" && <Memories state={state} setState={setState} />}
      </main>

      <footer className="footer">
        <span className="muted">
          Couple Trip • localStorage + Supabase同期（同じURLで同じデータ）
        </span>
      </footer>

      <button className="fab" type="button" onClick={() => setPage("schedule")}
        aria-label="予定を追加">
        +
      </button>
    </div>
  );
}
