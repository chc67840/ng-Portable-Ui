// Shared utility for generating underline-only filled input classes.
// Ensures consistent removal of side/top borders and standard bottom border styling.

export interface UnderlineOptions {
  base?: string; // initial class string (e.g., from theme or provided inputClass)
  ensureBg?: string; // fallback background class if none present
  focusBorder?: string; // focus border color class
  defaultBase?: string; // fallback if base missing
}

const BORDER_CLEAN_REGEXES: RegExp[] = [
  /\bborder(?!-b)[^ ]*/g, // standalone border classes except border-b
  /border-l[^ ]*/g,
  /border-r[^ ]*/g,
  /border-t[^ ]*/g,
  /rounded[^ ]*/g
];

export function computeUnderlineInputClass(opts: UnderlineOptions = {}): string {
  const defaultBase = opts.defaultBase || 'w-full bg-slate-100/70 px-2 py-2 text-sm border-b border-slate-300 focus:border-slate-500 transition-colors';
  let cls = (opts.base && opts.base.trim()) || defaultBase;
  // Strip disallowed borders / radius
  for (const rx of BORDER_CLEAN_REGEXES) {
    cls = cls.replace(rx, '');
  }
  if (!/border-b/.test(cls)) cls += ' border-b';
  if (!/border-b-\[1px\]/.test(cls)) cls += ' border-b-[1px]';
  const ensureBg = opts.ensureBg || 'bg-slate-100/70';
  if (!/bg-/.test(cls)) cls += ' ' + ensureBg;
  const focus = opts.focusBorder || 'focus:border-slate-500';
  if (!/focus:border-/.test(cls)) cls += ' ' + focus;
  if (!/focus:outline-/.test(cls)) cls += ' focus:outline-none';
  if (!/focus:ring/.test(cls)) cls += ' focus:ring-0';
  return cls.trim().replace(/\s+/g, ' ');
}
