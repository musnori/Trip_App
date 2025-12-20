import React, { useMemo, useState } from "react";

export default function Schedule({ state, setState }) {
  const [time, setTime] = useState("09:00");
  const [text, setText] = useState("");

  const sorted = useMemo(() => {
    return [...state.schedule].sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  }, [state.schedule]);

  function add() {
    if (!text.trim()) return;
    const item = { id: crypto.randomUUID(), time, text: text.trim(), done: false };
    setState((s) => ({ ...s, schedule: [...s.schedule, item] }));
    setText("");
  }

  function toggle(id) {
    setState((s) => ({
      ...s,
      schedule: s.schedule.map((it) => (it.id === id ? { ...it, done: !it.done } : it))
    }));
  }

  function update(id, patch) {
    setState((s) => ({
      ...s,
      schedule: s.schedule.map((it) => (it.id === id ? { ...it, ...patch } : it))
    }));
  }

  function remove(id) {
    setState((s) => ({ ...s, schedule: s.schedule.filter((it) => it.id !== id) }));
  }

  return (
    <section className="card">
      <h2>予定（2人で編集）</h2>

      <div className="rowForm">
        <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <input
          className="input grow"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例）チェックイン / 美術館 / 夜ごはん など"
        />
        <button className="btn" onClick={add}>追加</button>
      </div>

      <div className="table">
        {sorted.map((it) => (
          <div key={it.id} className="tableRow">
            <button className={"check" + (it.done ? " on" : "")} onClick={() => toggle(it.id)}>
              {it.done ? "✓" : ""}
            </button>

            <input
              className="input time"
              type="time"
              value={it.time || "09:00"}
              onChange={(e) => update(it.id, { time: e.target.value })}
            />

            <input
              className={"input grow" + (it.done ? " strike" : "")}
              value={it.text}
              onChange={(e) => update(it.id, { text: e.target.value })}
            />

            <button className="btn ghost" onClick={() => remove(it.id)}>削除</button>
          </div>
        ))}

        {sorted.length === 0 && <p className="muted">まだ予定がないよ。上から追加してね。</p>}
      </div>
    </section>
  );
}
