// src/components/Schedule.jsx
import React, { useEffect, useMemo, useState } from "react";

const emptyRow = (dateISO) => ({
  id: crypto.randomUUID(),
  dateISO: dateISO || new Date().toISOString().slice(0, 10),
  time: "09:00",
  category: "",
  title: "",
  location: "",
  notes: "",
  done: false
});

export default function Schedule({ state, setState }) {
  const [selectedDate, setSelectedDate] = useState(
    () => state.tripStartISO || new Date().toISOString().slice(0, 10)
  );
  const [draft, setDraft] = useState(() => emptyRow(selectedDate));

  useEffect(() => {
    if (!state.tripStartISO) return;
    setSelectedDate(state.tripStartISO);
  }, [state.tripStartISO]);

  useEffect(() => {
    setDraft((prev) => ({ ...prev, dateISO: selectedDate }));
  }, [selectedDate]);

  const sorted = useMemo(() => {
    return [...state.schedule].sort((a, b) => {
      const d = (a.dateISO || "").localeCompare(b.dateISO || "");
      if (d !== 0) return d;
      return (a.time || "").localeCompare(b.time || "");
    });
  }, [state.schedule]);

  const filtered = useMemo(() => {
    return sorted.filter((it) => (selectedDate ? it.dateISO === selectedDate : true));
  }, [sorted, selectedDate]);

  function add() {
    if (!draft.title.trim()) return;
    setState((s) => ({ ...s, schedule: [...s.schedule, { ...draft, title: draft.title.trim() }] }));
    setDraft(emptyRow(selectedDate));
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

  function toggle(id) {
    setState((s) => ({
      ...s,
      schedule: s.schedule.map((it) => (it.id === id ? { ...it, done: !it.done } : it))
    }));
  }

  return (
    <section className="card">
      <h2>予定（表で編集できる）</h2>
      <p className="muted">日付/時間/分類/内容/場所/メモを、そのまま書き換えOK。</p>

      <div className="rowForm">
        <label className="label">日付で絞り込み</label>
        <input
          className="input"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* 追加フォーム */}
      <div className="rowForm">
        <input
          className="input"
          type="date"
          value={draft.dateISO}
          onChange={(e) => setDraft((d) => ({ ...d, dateISO: e.target.value }))}
        />
        <input className="input" type="time" value={draft.time} onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))} />
        <input className="input" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))} placeholder="分類（移動/食事…）" />
        <input className="input grow" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="予定・内容" />
        <button className="btn" onClick={add}>追加</button>
      </div>

      <div className="table">
        {filtered.map((it) => (
          <div key={it.id} className="tableRow">
            <button className={"check" + (it.done ? " on" : "")} onClick={() => toggle(it.id)}>
              {it.done ? "✓" : ""}
            </button>

            <input className="input" type="date" value={it.dateISO || ""} onChange={(e) => update(it.id, { dateISO: e.target.value })} />
            <input className="input time" type="time" value={it.time || ""} onChange={(e) => update(it.id, { time: e.target.value })} />

            <input className="input" value={it.category || ""} onChange={(e) => update(it.id, { category: e.target.value })} placeholder="分類" />

            <input className={"input grow" + (it.done ? " strike" : "")} value={it.title || ""} onChange={(e) => update(it.id, { title: e.target.value })} placeholder="予定・内容" />

            <input className="input grow" value={it.location || ""} onChange={(e) => update(it.id, { location: e.target.value })} placeholder="場所・詳細" />

            <input className="input grow" value={it.notes || ""} onChange={(e) => update(it.id, { notes: e.target.value })} placeholder="メモ・予算・予約（URLもOK）" />

            <button className="btn ghost" onClick={() => remove(it.id)}>削除</button>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="muted">この日に予定はまだないよ。上から追加してね。</p>
        )}
      </div>
    </section>
  );
}
