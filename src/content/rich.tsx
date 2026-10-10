import { Fragment, type ReactNode } from "react";

/**
 * Minimal inline markup used by dashboard text fields:
 * **bold** → <strong>, *emphasis* → <em>, line breaks → <br>.
 */
export function rich(text: string): ReactNode {
  const lines = text.split(/\r?\n/);
  return lines.map((line, li) => (
    <Fragment key={li}>
      {li > 0 && <br />}
      {inline(line)}
    </Fragment>
  ));
}

function inline(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    out.push(m[1] !== undefined ? <strong key={m.index}>{m[1]}</strong> : <em key={m.index}>{m[2]}</em>);
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}
