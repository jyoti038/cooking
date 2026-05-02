import { useEffect, useRef, useState, type ElementType } from "react";
import { Pencil, Check } from "lucide-react";

interface EditableTextProps {
  value: string;
  onChange: (next: string) => void;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  ariaLabel?: string;
}

export function EditableText({
  value,
  onChange,
  as: Tag = "span",
  className = "",
  multiline = false,
  ariaLabel = "Editable text",
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if ("setSelectionRange" in inputRef.current) {
        const len = inputRef.current.value.length;
        try {
          inputRef.current.setSelectionRange(len, len);
        } catch {}
      }
    }
  }, [editing]);

  const commit = () => {
    onChange(draft.trim() || value);
    setEditing(false);
  };

  if (editing) {
    const sharedClass = `w-full rounded-2xl border-2 border-dashed border-rose/50 bg-white/70 px-3 py-2 outline-none focus:border-rose ${className}`;
    return (
      <span className="relative inline-block w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) commit();
              if (e.key === "Escape") {
                setDraft(value);
                setEditing(false);
              }
            }}
            rows={3}
            className={sharedClass}
            aria-label={ariaLabel}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraft(value);
                setEditing(false);
              }
            }}
            className={sharedClass}
            aria-label={ariaLabel}
          />
        )}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={commit}
          className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose text-white shadow-soft"
          aria-label="Save"
        >
          <Check className="h-4 w-4" />
        </button>
      </span>
    );
  }

  return (
    <Tag
      className={`group relative inline-block cursor-text rounded-xl px-1 transition hover:bg-white/40 ${className}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value}
      <span
        aria-hidden
        className="ml-2 inline-flex h-6 w-6 -translate-y-1 items-center justify-center rounded-full bg-white/80 text-cocoa opacity-0 shadow-soft transition group-hover:opacity-100"
      >
        <Pencil className="h-3 w-3" />
      </span>
    </Tag>
  );
}
