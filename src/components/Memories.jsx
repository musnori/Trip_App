import React, { useState } from "react";

export default function Memories({ state, setState }) {
  const [dateISO, setDateISO] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  function add() {
    if (!title.trim() || !text.trim()) return;
    const item = { id: crypto.randomUUID(), dateISO, title: title.trim(), text: text.trim() };
    setState((s) => ({ ...s, memories: [item, ...s.memories] }));
    setTitle("");
    setText("");
  }

  function update(id, patch) {
    setState((s) => ({
      ...s,
      memories: s.memories.map((m) => (m.id === id ? { ...m, ...patch } : m))
    }));
  }

  function remove(id) {
    setState((s) => ({ ...s, memories: s.memories.filter((m) => m.id !== id) }));
  }

  return (
    <section className="card">
      <h2>思い出（2人で追記）</h2>

      <div className="rowForm">
        <input className="input" type="date" value={dateISO} onChange={(e) => setDateISO(e.target.value)} />
        <input className="input grow" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="タイトル" />
        <button className="btn" onClick={add}>追加</button>
      </div>

      <textarea
        className="textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="今日の出来事、楽しかったこと、次回やりたいこと…"
      />

      <div className="stack">
        {state.memories.map((m) => (
          <div key={m.id} className="memoryCard">
            <div className="rowBetween">
              <input className="input" type="date" value={m.dateISO} onChange={(e) => update(m.id, { dateISO: e.target.value })} />
              <button className="btn ghost" onClick={() => remove(m.id)}>削除</button>
            </div>
            <input className="input" value={m.title} onChange={(e) => update(m.id, { title: e.target.value })} />
            <textarea className="textarea" value={m.text} onChange={(e) => update(m.id, { text: e.target.value })} />
          </div>
        ))}
        {state.memories.length === 0 && <p className="muted">まだ思い出がないよ。上から追加してね。</p>}
      </div>
    </section>
  );
}
