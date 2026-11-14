import { reactive, readonly } from "vue";

export type NoticeType = "success" | "error" | "warning" | "info";
export interface NoticeOptions {
  message: unknown;
  type?: NoticeType | "default";
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
}
export interface Notice {
  id: number; message: string; type: NoticeType; title: string;
  duration: number; remaining: number; dismissible: boolean;
}
const titles: Record<NoticeType, string> = {
  success: "Listo", error: "No se pudo completar", warning: "Ten en cuenta", info: "Información",
};
const durations: Record<NoticeType, number> = { success: 4500, error: 7500, warning: 6500, info: 5000 };
const items = reactive<Notice[]>([]);
const pending: Notice[] = [];
const pauses = new Map<number, Set<string>>();
const callbacks = new Map<number, () => void>();
const globalPauses = new Set<string>();
let serial = 0, timer: ReturnType<typeof setTimeout> | undefined, previous = 0;
export const notifications = readonly(items);
export const announcements = reactive({ polite: "", urgent: "" });

function announce(item: Notice) {
  if (item.type === "error") announcements.urgent = item.title + ". " + item.message;
  else announcements.polite = item.title + ". " + item.message;
}
function promote() {
  while (items.length < 3 && pending.length) {
    const item = pending.shift()!;
    items.push(item); announce(item);
  }
  schedule();
}
function schedule() {
  if (timer || !items.some(item => item.duration > 0 && !pauses.get(item.id)?.size) || globalPauses.size) return;
  previous = Date.now();
  timer = setTimeout(tick, 50);
}
function tick() {
  timer = undefined;
  const now = Date.now(), elapsed = Math.max(0, now - previous);
  previous = now;
  if (!globalPauses.size) {
    const expired: number[] = [];
    for (const item of items) {
      if (item.duration <= 0 || pauses.get(item.id)?.size) continue;
      item.remaining = Math.max(0, item.remaining - elapsed);
      if (!item.remaining) expired.push(item.id);
    }
    for (const id of expired) dismiss(id);
  }
  schedule();
}
export function dismiss(id: number) {
  const index = items.findIndex(item => item.id === id);
  const queued = pending.findIndex(item => item.id === id);
  if (index < 0 && queued < 0) return;
  if (index >= 0) items.splice(index, 1);
  else pending.splice(queued, 1);
  pauses.delete(id);
  const callback = callbacks.get(id); callbacks.delete(id);
  promote();
  if (!items.length) {
    if (timer) clearTimeout(timer); timer = undefined;
    announcements.polite = ""; announcements.urgent = "";
  }
  // A notification callback must not interrupt the notification queue.
  if (callback) { try { callback(); } catch { /* The action already finished. */ } }
}
export function pauseNotice(id: number, reason: "pointer" | "focus") {
  if (!pauses.has(id)) pauses.set(id, new Set());
  pauses.get(id)!.add(reason);
}
export function resumeNotice(id: number, reason: "pointer" | "focus") {
  pauses.get(id)?.delete(reason);
  schedule();
}
export function pauseNotifications(reason: string, paused: boolean) {
  if (paused) globalPauses.add(reason); else globalPauses.delete(reason);
  if (globalPauses.size && timer) { clearTimeout(timer); timer = undefined; }
  else schedule();
}
function clear() {
  if (timer) clearTimeout(timer);
  timer = undefined;
  const handlers = [...callbacks.values()];
  items.splice(0); pending.splice(0); pauses.clear(); callbacks.clear();
  announcements.polite = ""; announcements.urgent = "";
  for (const handler of handlers) { try { handler(); } catch { /* Keep other notifications usable. */ } }
}
function open(value: NoticeOptions | string) {
  const options = typeof value === "string" ? { message: value } : value;
  if (!options || typeof options.message !== "string" || !options.message.trim()) return { dismiss() {} };
  let message = options.message.trim();
  const type: NoticeType = options.type && ["success", "error", "warning", "info"].includes(options.type) ? options.type as NoticeType : "info";
  if (/\b(?:ObjectId|CastError|MongoError|ID)\b|stack trace|ECONNREFUSED/i.test(message)) {
    message = "No pudimos completar la acción. Actualiza la página e inténtalo de nuevo.";
  }
  const duration = typeof options.duration === "number" && Number.isFinite(options.duration) && options.duration >= 0
    ? Math.min(options.duration, 120000) : durations[type];
  const duplicate = [...items, ...pending].find(item => item.type === type && item.message === message);
  if (duplicate) {
    duplicate.duration = duration; duplicate.remaining = duration; schedule();
    return { dismiss: () => dismiss(duplicate.id) };
  }
  const item: Notice = { id: ++serial, type, title: titles[type], message, duration, remaining: duration, dismissible: options.dismissible !== false || duration === 0 };
  if (options.onDismiss) callbacks.set(item.id, options.onDismiss);
  if (items.length < 3) { items.push(item); announce(item); schedule(); }
  else {
    if (pending.length >= 20) dismiss(pending[0]!.id);
    pending.push(item);
  }
  return { dismiss: () => dismiss(item.id) };
}
export const toast = {
  open, clear,
  success: (message: string) => open({ message, type: "success" }),
  error: (message: string) => open({ message, type: "error" }),
  warning: (message: string) => open({ message, type: "warning" }),
  info: (message: string) => open({ message, type: "info" }),
};
export function useToast() { return toast; }
