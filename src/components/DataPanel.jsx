import React from "react";
import { defaultState, downloadJson, readJsonFile } from "../storage.js";

export default function DataPanel({ state, setState }) {
  async function importJson(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readJsonFile(file);
      setState({ ...defaultState, ...data });
      e.target.value = "";
      alert("インポート完了！");
    } catch {
      alert("JSONの読み込みに失敗したよ（形式を確認してね）");
    }
  }

  function reset() {
    if (!confirm("本当に初期化する？（ローカルデータが消えます）")) return;
    setState(defaultState);
  }

  return (
    <section className="card">
      <h2>データ（編集・共有用）</h2>
      <p className="muted">
        エクスポートしたJSONを彼女に渡して、インポートすれば内容を揃えられるよ。
        （本格同期は次のステップでFirebase等を使う）
      </p>

      <div className="rowForm">
        <button className="btn" onClick={() => downloadJson(state)}>JSONを書き出す</button>

        <label className="btn ghost">
          JSONを読み込む
          <input type="file" accept="application/json" onChange={importJson} style={{ display: "none" }} />
        </label>

        <button className="btn danger" onClick={reset}>初期化</button>
      </div>

      <details className="details">
        <summary>現在のJSON（確認用）</summary>
        <pre className="pre">{JSON.stringify(state, null, 2)}</pre>
      </details>
    </section>
  );
}
