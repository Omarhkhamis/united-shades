/**
 * Coerce untrusted input into the exact shape of `template`:
 * unknown keys are dropped, missing keys fall back to the template,
 * and array items are shaped after the template's first item.
 */
export function sanitize<T>(template: T, input: unknown): T {
  if (Array.isArray(template)) {
    if (!Array.isArray(input)) return template;
    const itemTemplate = template[0];
    if (itemTemplate === undefined) return [] as T;
    return input.map((item) => sanitize(itemTemplate, item)) as T;
  }
  if (template !== null && typeof template === "object") {
    const src = input !== null && typeof input === "object" && !Array.isArray(input) ? (input as Record<string, unknown>) : {};
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(template)) {
      out[key] = key in src ? sanitize(value, src[key]) : value;
    }
    return out as T;
  }
  if (typeof template === "number") {
    const n = Number(input);
    return (Number.isFinite(n) ? n : template) as T;
  }
  if (typeof template === "boolean") return (typeof input === "boolean" ? input : template) as T;
  if (typeof template === "string") return (typeof input === "string" ? input : input == null ? template : String(input)) as T;
  return template;
}
