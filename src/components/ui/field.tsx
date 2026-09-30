import { forwardRef, useId, useState } from "react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Form field system: calm, clearly bounded controls with a persistent label above, helper and
 * error text below, and a brand-orange focus ring. 16px text prevents iOS zoom; borders meet 3:1.
 */
export const controlClass =
  "block w-full rounded-xl border border-[hsl(var(--field-border))] bg-[hsl(var(--field-bg))] px-4 text-base text-foreground " +
  "placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-150 " +
  "hover:border-foreground/70 " +
  "focus-visible:border-[hsl(var(--brand-strong))] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[hsl(var(--brand-strong)/0.35)] " +
  "disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-foreground/5 " +
  "aria-[invalid=true]:border-[hsl(var(--destructive-ink))] aria-[invalid=true]:focus-visible:ring-[hsl(var(--destructive-ink)/0.3)]";

export interface FieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  required?: boolean;
}

interface FieldProps {
  label: string;
  /** Marks the field required (adds an asterisk and the required attribute). */
  required?: boolean;
  /** Shows "(optional)" after the label. */
  optional?: boolean;
  helper?: string;
  error?: string;
  /** Character counter, shown when max is set. */
  count?: { value: number; max: number };
  className?: string;
  /** Provide an id to control the label/for relationship; generated otherwise. */
  id?: string;
  children: (control: FieldControlProps) => ReactNode;
}

/** Label + control + helper/error/counter wrapper. Children receive the ARIA wiring. */
export function Field({ label, required, optional, helper, error, count, className, id, children }: FieldProps) {
  const auto = useId();
  const fieldId = id ?? `f-${auto.replace(/:/g, "")}`;
  const helperId = helper ? `${fieldId}-help` : undefined;
  const errorId = error ? `${fieldId}-err` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={fieldId} className="flex items-baseline gap-1.5 text-sm font-semibold text-foreground">
        {label}
        {required && (
          <span className="text-[hsl(var(--destructive-ink))]" aria-hidden="true">*</span>
        )}
        {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </label>
      {children({
        id: fieldId,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        required: required || undefined,
      })}
      <div className="flex items-start justify-between gap-3 min-h-[1.25rem]">
        <div className="space-y-1 text-sm">
          {error && (
            <p id={errorId} role="alert" className="flex items-start gap-1.5 font-medium text-[hsl(var(--destructive-ink))]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}
          {helper && (
            <p id={helperId} className="text-muted-foreground">
              {helper}
            </p>
          )}
        </div>
        {count && (
          <span className={cn("shrink-0 text-xs tabular-nums", count.value > count.max * 0.9 ? "text-foreground" : "text-muted-foreground")} aria-hidden="true">
            {count.value}/{count.max}
          </span>
        )}
      </div>
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, type = "text", ...props },
  ref
) {
  return <input ref={ref} type={type} className={cn(controlClass, "h-12", className)} {...props} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, rows = 4, ...props },
  ref
) {
  return <textarea ref={ref} rows={rows} className={cn(controlClass, "min-h-28 py-3 resize-y leading-relaxed", className)} {...props} />;
});

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, "type">>(function PasswordInput(
  { className, ...props },
  ref
) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input
        ref={ref}
        type={shown ? "text" : "password"}
        autoCapitalize="none"
        spellCheck={false}
        className={cn(controlClass, "h-12 pr-12", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-pressed={shown}
        aria-label={shown ? "Hide password" : "Show password"}
        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
      >
        {shown ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
      </button>
    </div>
  );
});
