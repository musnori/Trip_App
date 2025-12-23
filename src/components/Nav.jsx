import React from "react";

const tabs = [
  { id: "home", label: "ホーム" },
  { id: "schedule", label: "予定" },
  { id: "photos", label: "写真" },
  { id: "memories", label: "思い出" }
];

export default function Nav({ page, setPage }) {
  return (
    <nav className="nav">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={"tab" + (page === t.id ? " active" : "")}
          onClick={() => setPage(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
