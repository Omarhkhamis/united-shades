"use client";

import { ArrowDown, ArrowUp, ChevronDown, ExternalLink, ImageUp, Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useEffect, useId, useState, useTransition } from "react";
import { resetSection, saveSection } from "@/app/(admin)/dashboard/actions";
import { confirmAction, notify } from "@/lib/alerts";
import type { Field, SectionSchema } from "@/content/editor-schema";

type Data = Record<string, unknown>;
type Change = (value: unknown) => void;

export function SectionEditor({ schema, initial, defaults }: { schema: Omit<SectionSchema, "icon">; initial: Data; defaults: Data }) {
  const [data, setData] = useState<Data>(initial);
  const [saved, setSaved] = useState<Data>(initial);
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(data) !== JSON.stringify(saved);

  // warn before leaving with unsaved edits
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = () =>
    startTransition(async () => {
      const res = await saveSection(schema.key, data);
      if (res.ok) setSaved(data);
      notify(res.ok ? "success" : "error", res.ok ? res.message ?? "تم الحفظ" : res.error);
    });

  const reset = async () => {
    const ok = await confirmAction({
      title: "استعادة المحتوى الأصلي؟",
      text: `سيتم استبدال محتوى قسم «${schema.title}» بالمحتوى الأصلي للموقع، وستفقد التعديلات الحالية.`,
      confirmText: "نعم، استعادة",
      danger: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await resetSection(schema.key);
      notify(res.ok ? "success" : "error", res.ok ? "تمت استعادة المحتوى الأصلي." : res.error);
      if (res.ok) {
        setData(defaults);
        setSaved(defaults);
      }
    });
  };

  return (
    <form
      className="editor"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <header className="editor__bar">
        <div>
          <h1 className="editor__title">{schema.title}</h1>
          <p className="editor__desc">{schema.description}</p>
        </div>
        <div className="editor__actions">
          {schema.anchor !== undefined && (
            <a className="btn btn--ghost" href={`/#${schema.anchor}`} target="_blank" rel="noopener">
              <ExternalLink size={16} /> <span className="hide-sm">معاينة</span>
            </a>
          )}
          <button type="submit" className="btn btn--primary" disabled={pending || !dirty}>
            {pending ? <Loader2 size={16} className="spin" /> : <Save size={16} />} حفظ التغييرات
          </button>
        </div>
      </header>

      <div className="editor__status" aria-live="polite">
        {dirty && <span className="pill pill--warn">لديك تغييرات غير محفوظة</span>}
      </div>

      {schema.groups.map((group) => (
        <section className="card" key={group.title}>
          <h2 className="card__title">{group.title}</h2>
          <Fields fields={group.fields} value={data} onChange={(v) => setData(v as Data)} />
        </section>
      ))}

      <div className="editor__foot">
        <button type="button" className="btn btn--text" onClick={reset} disabled={pending}>
          <RotateCcw size={15} /> استعادة المحتوى الأصلي لهذا القسم
        </button>
      </div>
    </form>
  );
}

/* ---------- field rendering ---------- */

function Fields({ fields, value, onChange }: { fields: Field[]; value: Data; onChange: Change }) {
  return (
    <div className="fields">
      {fields.map((f) =>
        f.kind === "sharePreview" ? (
          <SharePreview key={f.name} label={f.label} data={value} />
        ) : (
          <FieldInput key={f.name} field={f} value={value[f.name]} onChange={(v) => onChange({ ...value, [f.name]: v })} />
        ),
      )}
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: Change }) {
  const id = useId();
  const full = field.kind === "list" || field.kind === "strings" || field.kind === "image" || ("wide" in field && field.wide) || field.kind === "rich" || field.kind === "textarea";
  const label = (
    <label className="field__label" htmlFor={id}>
      {field.label}
    </label>
  );
  const counter =
    "recommended" in field && field.recommended ? (
      <span className={"counter" + (String(value ?? "").length > field.recommended ? " is-over" : "")}>
        {String(value ?? "").length} / {field.recommended} حرف
      </span>
    ) : null;
  const hint = field.hint || counter ? (
    <p className="field__hint">
      {field.hint} {counter}
    </p>
  ) : null;

  switch (field.kind) {
    case "text":
    case "url":
      return (
        <div className={"field" + (full ? " field--full" : "")}>
          {label}
          <input id={id} className="input" type="text" dir={field.kind === "url" ? "ltr" : undefined} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
          {hint}
        </div>
      );
    case "textarea":
    case "rich":
      return (
        <div className="field field--full">
          {label}
          <textarea id={id} className="input" rows={field.kind === "rich" ? 2 : 3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
          {hint}
        </div>
      );
    case "number":
      return (
        <div className="field">
          {label}
          <input id={id} className="input" type="number" dir="ltr" value={Number(value ?? 0)} onChange={(e) => onChange(e.target.valueAsNumber || 0)} />
          {hint}
        </div>
      );
    case "boolean":
      return (
        <div className="field field--check">
          <label className="check" htmlFor={id}>
            <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
            <span>{field.label}</span>
          </label>
          {hint}
        </div>
      );
    case "select":
      return (
        <div className="field">
          {label}
          <select id={id} className="input" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {hint}
        </div>
      );
    case "image":
      return <ImageField id={id} label={field.label} hint={field.hint} value={String(value ?? "")} onChange={onChange} />;
    case "strings":
      return <StringList field={field} value={(value as string[]) ?? []} onChange={onChange} />;
    case "list":
      return <ObjectList field={field} value={(value as Data[]) ?? []} onChange={onChange} />;
    case "sharePreview":
      return null;
  }
}

function ImageField({ id, label, hint, value, onChange }: { id: string; label: string; hint?: string; value: string; onChange: Change }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "تعذّر رفع الصورة");
      onChange(json.url);
      notify("success", "تم رفع الصورة — اضغط «حفظ التغييرات» لتطبيقها.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "تعذّر رفع الصورة";
      setError(msg);
      notify("error", msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="field field--full">
      <span className="field__label">{label}</span>
      <div className="imgfield">
        <div className="imgfield__preview">{value ? <img src={value} alt="" /> : <span>لا توجد صورة</span>}</div>
        <div className="imgfield__side">
          <label className="btn btn--ghost" htmlFor={id}>
            {busy ? <Loader2 size={16} className="spin" /> : <ImageUp size={16} />} {busy ? "جارٍ الرفع…" : "رفع صورة جديدة"}
          </label>
          <input
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            hidden
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = "";
            }}
          />
          <p className="field__hint">JPG أو PNG أو WEBP — حتى 8 ميجابايت.</p>
          {error && <p className="field__error">{error}</p>}
          {hint && <p className="field__hint">{hint}</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------- lists ---------- */

const move = <T,>(arr: T[], from: number, to: number) => {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

function emptyValue(field: Field): unknown {
  switch (field.kind) {
    case "number": return 0;
    case "boolean": return false;
    case "select": return field.options[0]?.value ?? "";
    case "strings":
    case "list": return [];
    default: return "";
  }
}

function ItemTools({ index, count, onMove, onRemove }: { index: number; count: number; onMove: (to: number) => void; onRemove: () => void }) {
  return (
    <div className="item__tools">
      <button type="button" className="icon-btn" onClick={() => onMove(index - 1)} disabled={index === 0} aria-label="تحريك للأعلى" title="تحريك للأعلى"><ArrowUp size={15} /></button>
      <button type="button" className="icon-btn" onClick={() => onMove(index + 1)} disabled={index === count - 1} aria-label="تحريك للأسفل" title="تحريك للأسفل"><ArrowDown size={15} /></button>
      <button type="button" className="icon-btn icon-btn--danger" onClick={onRemove} aria-label="حذف" title="حذف"><Trash2 size={15} /></button>
    </div>
  );
}

function StringList({ field, value, onChange }: { field: Extract<Field, { kind: "strings" }>; value: string[]; onChange: Change }) {
  const removeAt = async (i: number) => {
    if (value[i].trim()) {
      const ok = await confirmAction({ title: `حذف ${field.itemLabel}؟`, text: `«${value[i]}»`, confirmText: "حذف", danger: true });
      if (!ok) return;
    }
    onChange(value.filter((_, j) => j !== i));
  };
  return (
    <div className="field field--full">
      <span className="field__label">{field.label} <em className="count">{value.length}</em></span>
      <div className="strings">
        {value.map((v, i) => (
          <div className="strings__row" key={i}>
            <span className="badge">{i + 1}</span>
            <input className="input" value={v} aria-label={`${field.itemLabel} ${i + 1}`} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
            <ItemTools index={i} count={value.length} onMove={(to) => onChange(move(value, i, to))} onRemove={() => removeAt(i)} />
          </div>
        ))}
      </div>
      <button type="button" className="btn btn--add" onClick={() => onChange([...value, ""])}>
        <Plus size={16} /> إضافة {field.itemLabel}
      </button>
    </div>
  );
}

function ObjectList({ field, value, onChange }: { field: Extract<Field, { kind: "list" }>; value: Data[]; onChange: Change }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setOpen((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });

  const add = () => {
    const item = Object.fromEntries(field.fields.map((f) => [f.name, emptyValue(f)]));
    onChange([...value, item]);
    setOpen((s) => new Set(s).add(value.length));
  };
  const remove = async (i: number) => {
    const name = field.titleKey ? String(value[i][field.titleKey] || "") : "";
    const ok = await confirmAction({
      title: `حذف ${field.itemLabel}؟`,
      text: name ? `سيتم حذف «${name}». لن يُطبَّق الحذف على الموقع إلا بعد الضغط على «حفظ التغييرات».` : "لن يُطبَّق الحذف على الموقع إلا بعد الضغط على «حفظ التغييرات».",
      confirmText: "حذف",
      danger: true,
    });
    if (!ok) return;
    onChange(value.filter((_, j) => j !== i));
    setOpen(new Set());
  };

  return (
    <div className="field field--full">
      <span className="field__label">{field.label} <em className="count">{value.length}</em></span>
      {field.hint && <p className="field__hint">{field.hint}</p>}
      <div className="items">
        {value.map((item, i) => {
          const isOpen = open.has(i);
          const title = field.titleKey ? String(item[field.titleKey] || "") : "";
          const thumb = typeof item.image === "string" && item.image ? item.image : null;
          return (
            <div className={"item" + (isOpen ? " is-open" : "")} key={i}>
              <div className="item__head">
                <button type="button" className="item__toggle" onClick={() => toggle(i)} aria-expanded={isOpen}>
                  <span className="badge">{i + 1}</span>
                  {thumb && <img className="item__thumb" src={thumb} alt="" />}
                  <span className="item__title">{title || <em>{field.itemLabel} بدون عنوان</em>}</span>
                  <ChevronDown size={18} className="item__chev" />
                </button>
                <ItemTools
                  index={i}
                  count={value.length}
                  onMove={(to) => { onChange(move(value, i, to)); setOpen(new Set()); }}
                  onRemove={() => remove(i)}
                />
              </div>
              {isOpen && (
                <div className="item__body">
                  <Fields fields={field.fields} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? (v as Data) : x)))} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button type="button" className="btn btn--add" onClick={add}>
        <Plus size={16} /> إضافة {field.itemLabel}
      </button>
    </div>
  );
}

/** Live preview of the link card WhatsApp shows when the site is shared. */
function SharePreview({ label, data }: { label: string; data: Data }) {
  const str = (k: string) => String(data[k] ?? "").trim();
  const title = str("shareTitle") || str("title");
  const description = str("shareDescription") || str("description");
  let host = "uscompany.com.sa";
  try {
    host = new URL(str("siteUrl")).host || host;
  } catch {}
  return (
    <div className="field field--full">
      <span className="field__label">{label}</span>
      <div className="wa-preview">
        <div className="wa-preview__bubble">
          <div className="wa-preview__card">
            {str("shareImage") && <img src={str("shareImage")} alt="" />}
            <div className="wa-preview__text">
              <b>{title}</b>
              <span>{description}</span>
              <small dir="ltr">{host}</small>
            </div>
          </div>
          <p className="wa-preview__link" dir="ltr">https://{host}</p>
        </div>
      </div>
      <p className="field__hint">المعاينة تقريبية. واتساب يحفظ معاينة الرابط لفترة، فقد لا يظهر التغيير فوراً في المحادثات القديمة.</p>
    </div>
  );
}
