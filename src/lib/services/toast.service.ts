import { Injectable, signal } from '@angular/core';

export type DsToastVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
export type DsToastAppearance = 'filled' | 'soft' | 'outlined' | 'plain';

export interface ToastOptions {
    id?: string;
    title?: string;
    message?: string;
    variant?: DsToastVariant;
    appearance?: DsToastAppearance;
    duration?: number; // ms (0 => persistent)
    closable?: boolean;
    actionLabel?: string;
    showProgress?: boolean;
    cssVars?: Record<string, string | number | null>;
    iconHtml?: string; // optional raw HTML for icon
}
export interface ActiveToast extends ToastOptions {
    id: string;
    created: number;
    remaining?: number; // remaining ms for auto-dismiss
    paused?: boolean;
}

let _toastId = 0;

@Injectable({ providedIn: 'root' })
export class ToastService {
    private _toasts = signal<ActiveToast[]>([]);
    toasts = this._toasts.asReadonly();

    add(opts: ToastOptions): string {
        const id = opts.id ?? `t_${++_toastId}`;
        const now = performance.now();
        const toast: ActiveToast = {
            variant: 'info',
            appearance: 'filled',
            duration: 5000,
            closable: true,
            showProgress: true,
            ...opts,
            id,
            created: now,
            remaining: opts.duration ?? 5000
        };
        this._toasts.update(arr => [toast, ...arr]);
        if (toast.duration && toast.duration > 0) {
            this.startTimer(id);
        }
        return id;
    }

    dismiss(id: string) { this._toasts.update(arr => arr.filter(t => t.id !== id)); }
    clear() { this._toasts.set([]); }

    pause(id: string) { this._toasts.update(arr => arr.map(t => t.id === id ? { ...t, paused: true } : t)); }
    resume(id: string) { const before = performance.now(); this._toasts.update(arr => arr.map(t => t.id === id ? { ...t, paused: false, created: before - ((t.duration || 0) - (t.remaining || 0)) } : t)); this.startTimer(id); }

    private startTimer(id: string) {
        const frame = () => {
            const now = performance.now();
            let changed = false;
            this._toasts.update(arr => arr.map(t => {
                if (t.id !== id) return t;
                if (t.paused || !t.duration || t.duration <= 0) return t;
                const elapsed = now - t.created;
                const remaining = Math.max(0, (t.duration || 0) - elapsed);
                if (remaining !== t.remaining) { changed = true; t = { ...t, remaining }; }
                return t;
            }));
            const toast = this._toasts().find(t => t.id === id);
            if (!toast) return; // dismissed
            if (toast.paused) return; // stop until resumed
            if (toast.remaining && toast.remaining > 0) {
                requestAnimationFrame(frame);
            } else if (toast.remaining === 0) {
                this.dismiss(id);
            }
        };
        requestAnimationFrame(frame);
    }
}
