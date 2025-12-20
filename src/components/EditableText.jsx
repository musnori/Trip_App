import React, { useEffect, useRef, useState } from "react";

export default function EditableText({ value, onChange, placeholder, className }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const inputRef = useRef(null);

  useEffect(() => setDraft(value ?? ""), [value]);

  useEffect(() => {
    if (editing) setTimeout(() => inputRef.current?.focus(), 0);
  }, [editing]);

  if (!editing) {
    return (
      <button
        type="button"
        className={"editable " + (className || "")}
        onClick={() => setEditing(true)}
        title="クリックして編集"
      >
        {value?.trim() ? value : <span className="placeholder">{placeholder || "編集"}</span>}
      </button>
    );
  }

  return (
    <span className={"editableWrap " + (className || "")}>
      <input
        ref={inputRef}
        className="input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onChange(draft);
            setEditing(false);
          }
          if (e.key === "Escape") {
            setDraft(value ?? "");
            setEditing(false);
          }
        }}
        onBlur={() => {
          onChange(draft);
          setEditing(false);
        }}
        placeholder={placeholder}
      />
    </span>
  );
}
