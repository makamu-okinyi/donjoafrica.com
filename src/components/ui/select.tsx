import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlClass } from "./field";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  /** Show a search box when there are more options than this (default 8). */
  searchableAbove?: number;
  className?: string;
}

/**
 * Accessible custom select (WAI-ARIA select-only combobox + listbox). Keyboard: arrows,
 * Home/End, type-ahead, Enter/Space to choose, Esc/Tab to close. Popover is portalled so it is
 * never clipped; on narrow screens it becomes a bottom sheet. Searchable above N options.
 */
export function Select({
  id, value, onChange, options, placeholder = "Choose one", disabled, required,
  searchableAbove = 8, className, ...aria
}: SelectProps) {
  const items = useMemo<SelectOption[]>(
    () => options.map((o) => (typeof o === "string" ? { value: o, label: o } : o)),
    [options]
  );
  const searchable = items.length > searchableAbove;
  const listId = useId().replace(/:/g, "");
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const typed = useRef({ text: "", t: 0 });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<{ top: number; left: number; width: number; up: boolean } | null>(null);
  const [sheet, setSheet] = useState(false);

  const visible = useMemo(
    () => (query ? items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase())) : items),
    [items, query]
  );
  const selected = items.find((i) => i.value === value);

  const place = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const narrow = window.innerWidth < 640;
    setSheet(narrow);
    const r = btn.getBoundingClientRect();
    const room = window.innerHeight - r.bottom;
    setPos({ top: r.bottom + 6, left: r.left, width: r.width, up: room < 280 && r.top > room });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const idx = Math.max(0, visible.findIndex((i) => i.value === value));
    setActive(idx);
    if (searchable) searchRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!popRef.current?.contains(t) && !btnRef.current?.contains(t)) close(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${listId}-o${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, listId]);

  function close(refocus = true) {
    setOpen(false);
    setQuery("");
    if (refocus) btnRef.current?.focus();
  }

  function choose(i: number) {
    const item = visible[i];
    if (!item) return;
    onChange(item.value);
    close();
  }

  function typeAhead(char: string) {
    const now = Date.now();
    typed.current.text = now - typed.current.t > 700 ? char : typed.current.text + char;
    typed.current.t = now;
    const text = typed.current.text.toLowerCase();
    const start = typed.current.text.length === 1 ? active + 1 : active;
    const order = [...visible.keys()].map((k) => (k + start) % visible.length);
    const hit = order.find((k) => visible[k].label.toLowerCase().startsWith(text));
    if (hit !== undefined) setActive(hit);
  }

  function onListKey(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); setActive((a) => Math.min(a + 1, visible.length - 1)); break;
      case "ArrowUp": e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); break;
      case "Home": if (!searchable) { e.preventDefault(); setActive(0); } break;
      case "End": if (!searchable) { e.preventDefault(); setActive(visible.length - 1); } break;
      case "Enter": e.preventDefault(); choose(active); break;
      case " ": if (!searchable) { e.preventDefault(); choose(active); } break;
      case "Escape": e.preventDefault(); close(); break;
      case "Tab": close(false); break;
      default:
        if (!searchable && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) typeAhead(e.key);
    }
  }

  function onButtonKey(e: React.KeyboardEvent) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
    }
  }

  const popover = open && pos && (
    <>
      {sheet && <div className="fixed inset-0 z-[70] bg-foreground/30" aria-hidden="true" />}
      <div
        ref={popRef}
        onKeyDown={onListKey}
        style={
          sheet
            ? undefined
            : { position: "fixed", left: pos.left, width: pos.width, ...(pos.up ? { bottom: window.innerHeight - pos.top + 6 + (btnRef.current?.offsetHeight ?? 0) } : { top: pos.top }) }
        }
        className={cn(
          "z-[80] overflow-hidden border border-[hsl(var(--field-border))] bg-popover shadow-[0_18px_40px_-12px_rgba(20,25,40,0.35)] outline-none",
          sheet ? "fixed inset-x-0 bottom-0 max-h-[70dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom)]" : "rounded-xl"
        )}
      >
        {searchable && (
          <div className="flex items-center gap-2 border-b border-foreground/15 px-3">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              ref={searchRef}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={visible[active] ? `${listId}-o${active}` : undefined}
              aria-label="Search options"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActive(0); }}
              placeholder="Search..."
              className="h-11 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        )}
        <ul
          id={listId}
          role="listbox"
          aria-label={placeholder}
          className="max-h-64 overflow-y-auto p-1.5"
        >
          {visible.length === 0 && <li className="px-3 py-3 text-sm text-muted-foreground">No matches</li>}
          {visible.map((o, i) => (
            <li
              key={o.value}
              id={`${listId}-o${i}`}
              role="option"
              aria-selected={o.value === value}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-base text-foreground",
                i === active && "bg-[hsl(var(--brand-strong)/0.12)]",
                o.value === value && "font-semibold"
              )}
            >
              {o.label}
              {o.value === value && <Check className="h-4 w-4 text-[hsl(var(--brand-ink))]" aria-hidden="true" />}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <>
      <button
        ref={btnRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-required={required || undefined}
        aria-describedby={aria["aria-describedby"]}
        aria-invalid={aria["aria-invalid"]}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-activedescendant={open && !searchable && visible[active] ? `${listId}-o${active}` : undefined}
        onKeyDown={open && !searchable ? onListKey : onButtonKey}
        className={cn(controlClass, "flex h-12 items-center justify-between gap-3 text-left", className)}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>{selected ? selected.label : placeholder}</span>
        <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {popover && createPortal(popover, document.body)}
    </>
  );
}
