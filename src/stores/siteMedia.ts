import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
export interface SiteMediaItem {
  _id: string; slot: string; label: string; placement: string; allowTitle: boolean; allowDescription: boolean; title: string; description: string; alt: string; order: number;
  hasPhoto: boolean; photoUpdatedAt: string | null; version: number;
}
const base = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
export function siteMediaUrl(item?: SiteMediaItem) {
  return item?.hasPhoto ? base + "/site-media/" + encodeURIComponent(item._id) + "/photo?v=" + encodeURIComponent(item.photoUpdatedAt || "") : "";
}
export const useSiteMediaStore = defineStore("site-media", () => {
  const items = ref<SiteMediaItem[]>([]);
  const loaded = ref(false), error = ref("");
  let pending: Promise<void> | undefined;
  async function load(force = false): Promise<void> {
    if (pending) return pending;
    if (loaded.value && !force) return;
    pending = (async () => {
      try {
        const { data } = await axios.get(base + "/site-media", { timeout: 15000 });
        if (!Array.isArray(data)) throw new Error("Respuesta no válida");
        items.value = data; loaded.value = true; error.value = "";
      } catch { error.value = "No pudimos consultar las imágenes del sitio. Vuelve a intentarlo."; }
      finally { pending = undefined; }
    })();
    return pending;
  }
  function find(slot: string) { return items.value.find(item => item.slot === slot); }
  function url(slot: string) { return siteMediaUrl(find(slot)); }
  return { items, loaded, error, load, find, url };
});
