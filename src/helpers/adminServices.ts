import type { Service } from "@/stores/service";
import { normalizeAgendaSearch } from "./adminAgenda";
export interface CatalogService extends Service {
  active?: boolean; description?: string; __v?: number;
  appointmentsCount: number; futureAppointmentsCount: number;
}
export interface ServiceDraft { name: string; price: string; description: string; active: boolean }
export function parseServicePrice(value: string): number | null {
  const text = value.trim();
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(text)) return null;
  const price = Number(text.replace(",", "."));
  return Number.isFinite(price) && price <= 1000000 ? price : null;
}
export function serviceDraftErrors(draft: ServiceDraft) {
  const errors: Record<string, string> = {};
  if (!draft.name.trim() || draft.name.trim().length > 120) errors.name = "Escribe un nombre de entre 1 y 120 caracteres.";
  if (parseServicePrice(draft.price) === null) errors.price = "Usa un precio entre 0 y 1.000.000 USD, con un máximo de dos decimales.";
  if (draft.description.trim().length > 300) errors.description = "La descripción admite hasta 300 caracteres.";
  return errors;
}
export function filterCatalog(services: readonly CatalogService[], search: string, state: string, order: string) {
  const words = normalizeAgendaSearch(search.trim()).split(/\s+/).filter(Boolean);
  return services.filter(service => (state === "all" || (state === "published" ? service.active !== false : service.active === false)) &&
    words.every(word => normalizeAgendaSearch(service.name + " " + (service.description ?? "")).includes(word)))
    .sort((a, b) => order === "price-low" ? a.price - b.price || a.name.localeCompare(b.name, "es") :
      order === "price-high" ? b.price - a.price || a.name.localeCompare(b.name, "es") : a.name.localeCompare(b.name, "es"));
}
export function validCatalog(data: unknown): data is CatalogService[] {
  return Array.isArray(data) && data.every(service => service && typeof service._id === "string" &&
    /^[a-f\d]{24}$/i.test(service._id) && typeof service.name === "string" &&
    typeof service.price === "number" && Number.isFinite(service.price) && service.price >= 0 &&
    (service.description === undefined || typeof service.description === "string") &&
    (service.active === undefined || typeof service.active === "boolean") &&
    [service.appointmentsCount, service.futureAppointmentsCount].every(value => Number.isInteger(value) && value >= 0));
}
