export interface Promotion {
  title: string; kind: "percentage" | "price"; value: number;
  startsAt: string; endsAt: string; enabled: boolean;
}
export function isCurrentPromotion(service: { price: number; basePrice?: number; promotion?: Promotion | null }, now = Date.now()) {
  const offer = service.promotion;
  return !!offer?.enabled && typeof service.basePrice === "number" && service.basePrice > service.price &&
    Date.parse(offer.startsAt) <= now && Date.parse(offer.endsAt) > now;
}
export function currentServicePrice(service: { price: number; basePrice?: number; promotion?: Promotion | null }, now = Date.now()) {
  return service.promotion && typeof service.basePrice === "number" && !isCurrentPromotion(service, now) ? service.basePrice : service.price;
}
export function promotionLabel(offer: Promotion) {
  return offer.kind === "percentage" ? offer.value + " % de descuento" : "Precio especial";
}
export function promotionDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "America/Guayaquil" }).format(date);
}
export function toPromotionInput(value: string | Date) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Date(date.getTime() - 5 * 3600000).toISOString().slice(0, 16);
}
export function fromPromotionInput(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(value + ":00-05:00");
  return Number.isNaN(date.getTime()) || toPromotionInput(date) !== value ? null : date.toISOString();
}
export function serviceMessage(error: any, fallback: string) {
  const message = error?.response?.data?.msg;
  const status = error?.response?.status;
  if (typeof message !== "string" || /\bid\b|cast|mongo|query|consulta|endpoint|objectid|validaci[oó]n|interno|servidor|not found|fetch|network/i.test(message)) return fallback;
  if (status === 401) return "Tu sesión terminó. Vuelve a iniciar sesión.";
  if (status === 403) return "Tu cuenta no tiene permiso para realizar este cambio.";
  return message;
}
