import React, { useState } from "react";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function Photos({ state, setState }) {
  const [caption, setCaption] = useState("");

  async function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    const item = { id: crypto.randomUUID(), dataUrl, caption: caption.trim() };
    setState((s) => ({ ...s, photos: [item, ...s.photos] }));
    setCaption("");
    e.target.value = "";
  }

  function update(id, patch) {
    setState((s) => ({
      ...s,
      photos: s.photos.map((p) => (p.id === id ? { ...p, ...patch } : p))
    }));
  }

  function remove(id) {
    setState((s) => ({ ...s, photos: s.photos.filter((p) => p.id !== id) }));
  }

  return (
    <section className="card scrapbook">
      <h2>写真（アップロードして保存）</h2>
      <p className="muted">スマホで撮った写真を追加して、2人のアルバムにしよう。</p>

      <div className="rowForm">
        <input
          className="input grow"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="キャプション（任意）"
        />
        <label className="btn">
          写真を選ぶ
          <input type="file" accept="image/*" onChange={onPick} style={{ display: "none" }} />
        </label>
      </div>

      <div className="photoGrid">
        {state.photos.map((p) => (
          <div key={p.id} className="photoCard">
            <img className="photo" src={p.dataUrl} alt={p.caption || "photo"} />
            <input
              className="input"
              value={p.caption || ""}
              onChange={(e) => update(p.id, { caption: e.target.value })}
              placeholder="キャプション"
            />
            <button className="btn ghost" onClick={() => remove(p.id)}>削除</button>
          </div>
        ))}
        {state.photos.length === 0 && <p className="muted">まだ写真がないよ。上から追加してね。</p>}
      </div>
    </section>
  );
}
