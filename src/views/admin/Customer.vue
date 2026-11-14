<template>
  <div class="min-w-0 text-white">
    <header class="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0 flex-1"><h1 class="font-barber text-2xl tracking-tight sm:text-3xl">Clientes y usuarios</h1><p class="mt-2 max-w-2xl text-sm leading-6 text-white/55">Consulta la actividad de tus clientes y administra los permisos y el acceso de cada cuenta.</p></div>
      <button type="button" :disabled="loading" @click="refresh" class="min-h-11 rounded-lg border border-white/15 px-4 text-xs text-white/65 hover:text-white focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-40">{{ loading ? "Actualizando…" : "Actualizar" }}</button>
    </header>
    <dl class="mb-6 grid grid-cols-2 gap-x-5 gap-y-4 rounded-2xl border border-white/10 bg-neutral-900/40 p-5 sm:grid-cols-4"><div v-for="item in statistics" :key="item.label"><dt class="text-xs leading-5 text-white/50">{{ item.label }}</dt><dd class="mt-1 font-barber text-2xl tabular-nums" :class="item.attention ? 'text-[#ffb700]' : 'text-white'">{{ loading || loadError ? "—" : item.value }}</dd></div></dl>
    <section aria-label="Filtrar usuarios" class="mb-5 rounded-2xl border border-white/10 bg-neutral-900/30 p-4 sm:p-5">
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div class="col-span-2 lg:col-span-1"><label for="users-search" class="mb-2 block text-xs text-white/50">Buscar cuenta</label><input id="users-search" v-model="search" type="search" placeholder="Nombre, correo o referencia" class="min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm placeholder:text-white/30 focus:border-[#ffb700] focus:outline-none" /></div>
        <div><label for="users-role" class="mb-2 block text-xs text-white/50">Rol</label><select id="users-role" v-model="role" class="min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm focus:border-[#ffb700] focus:outline-none"><option value="">Todos los roles</option><option value="client">Clientes</option><option value="barber">Barberos</option><option value="admin">Administradores</option></select></div>
        <div><label for="users-status" class="mb-2 block text-xs text-white/50">Acceso</label><select id="users-status" v-model="status" class="min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm focus:border-[#ffb700] focus:outline-none"><option value="">Todos los estados</option><option value="active">Habilitados</option><option value="pending">Correo pendiente</option><option value="blocked">Bloqueados</option></select></div>
      </div>
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label class="flex flex-wrap items-center gap-2 text-xs text-white/50">Reservas como cliente<select v-model="activity" class="min-h-10 max-w-full rounded-lg border border-white/10 bg-neutral-950 px-3 text-xs text-white/75 focus:border-[#ffb700] focus:outline-none"><option value="">Cualquier actividad</option><option value="upcoming">Con próximas citas</option><option value="history">Con reservas registradas</option><option value="none">Sin reservas</option></select></label>
        <button v-if="hasFilters" type="button" @click="clearFilters" class="min-h-10 text-xs text-[#ffb700] focus-visible:outline-2 focus-visible:outline-[#ffb700]">Restablecer filtros</button>
      </div>
    </section>
    <div v-if="loading" role="status" class="space-y-3"><span class="sr-only">Consultando usuarios</span><div v-for="n in 3" :key="n" aria-hidden="true" class="h-24 rounded-xl border border-white/10 bg-white/5 motion-safe:animate-pulse" /></div>
    <div v-else-if="loadError" role="alert" class="rounded-2xl border border-amber-400/25 p-6"><h2 class="font-barber text-xl">No pudimos consultar las cuentas</h2><p class="mt-2 text-sm leading-6 text-white/55">Vuelve a intentarlo para consultar los usuarios y su actividad.</p><button type="button" @click="refresh" class="mt-4 min-h-11 text-sm text-[#ffb700]">Volver a consultar</button></div>
    <template v-else>
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3"><p aria-live="polite" class="text-sm text-white/60">{{ filtered.length }} {{ filtered.length === 1 ? "cuenta encontrada" : "cuentas encontradas" }}</p><label class="flex items-center gap-2 text-xs text-white/50">Ordenar<select v-model="order" class="min-h-10 rounded-lg border border-white/10 bg-neutral-900 px-3 text-xs text-white/75"><option value="newest">Registro más reciente</option><option value="name">Nombre A–Z</option><option value="reservations">Más reservas</option></select></label></div>
      <div v-if="!filtered.length" class="rounded-2xl border border-white/10 p-8 text-center"><h2 class="font-barber text-xl">{{ users.length ? "No hay coincidencias" : "Todavía no hay cuentas registradas" }}</h2><p class="mt-2 text-sm leading-6 text-white/50">{{ users.length ? "Prueba otro nombre o ajusta los filtros." : "Las cuentas aparecerán aquí cuando los usuarios se registren." }}</p><button v-if="hasFilters" type="button" @click="clearFilters" class="mt-3 min-h-11 text-sm text-[#ffb700]">Ver todas las cuentas</button></div>
      <section v-else aria-label="Cuentas registradas" class="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/25">
        <div aria-hidden="true" class="hidden grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_7rem] gap-4 border-b border-white/10 px-5 py-3 text-xs text-white/40 lg:grid"><span>Cuenta</span><span>Permisos y acceso</span><span>Reservas como cliente</span><span>Registro</span><span class="text-right">Gestión</span></div>
        <article v-for="account in visible" :key="account._id" class="grid items-center gap-4 border-b border-white/10 p-4 last:border-b-0 sm:p-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_7rem]">
          <div class="flex min-w-0 items-center gap-3"><span aria-hidden="true" class="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-white/60">{{ account.name.trim().charAt(0).toUpperCase() || "?" }}</span><div class="min-w-0"><h2 class="break-words text-sm font-medium">{{ account.name }} <span v-if="account._id === actorId" class="ml-1 text-xs text-[#ffb700]">Tú</span></h2><p class="mt-1 break-all text-xs leading-5 text-white/45">{{ account.email }}</p><p v-if="account.protected" class="mt-1 text-[11px] text-[#ffb700]">Administrador principal protegido</p></div></div>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs lg:block"><p class="text-white/70">{{ roleLabel(account.role) }}</p><p class="flex items-center gap-1.5 lg:mt-2" :class="statusColor(account)"><span aria-hidden="true" class="size-1.5 rounded-full bg-current" />{{ statusLabel(account) }}</p></div>
          <div class="flex flex-wrap items-center justify-between gap-3 lg:block"><p class="text-xs text-white/65">{{ account.appointmentsCount }} {{ account.appointmentsCount === 1 ? "reserva" : "reservas" }}<span v-if="account.futureAppointmentsCount" class="ml-2 text-[#ffb700]">({{ account.futureAppointmentsCount }} próximas)</span></p><p class="text-xs text-white/40 lg:hidden"><span class="lg:hidden">Registro: </span>{{ registrationDate(account.createdAt) }}</p></div>
          <p class="hidden text-xs text-white/50 lg:block">{{ registrationDate(account.createdAt) }}</p>
          <button type="button" @click="selectedId = account._id" class="min-h-11 rounded-lg border border-[#ffb700]/30 px-3 text-sm text-[#ffb700] hover:bg-[#ffb700]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700]">Ver ficha</button>
        </article>
      </section>
      <div v-if="filtered.length" class="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50"><label class="flex items-center gap-2">Por página<select v-model.number="pageSize" class="min-h-10 rounded-lg border border-white/10 bg-neutral-900 px-3 text-white/75"><option :value="12">12</option><option :value="24">24</option><option :value="48">48</option></select></label><div class="flex items-center gap-3"><button type="button" :disabled="page <= 1" @click="page--" class="min-h-11 rounded-lg border border-white/10 px-3 disabled:opacity-30">Anterior</button><span class="tabular-nums">{{ page }} de {{ pages }}</span><button type="button" :disabled="page >= pages" @click="page++" class="min-h-11 rounded-lg border border-white/10 px-3 disabled:opacity-30">Siguiente</button></div></div>
      <p class="mt-5 text-xs leading-5 text-white/40">Las reservas registradas no acreditan asistencia ni cobro. Los cambios de permisos y acceso se realizan desde la ficha de cada cuenta.</p>
    </template>
    <AdminUserDialog v-if="selected" :user="selected" :actor-id="actorId" @close="selectedId = ''" @changed="onChanged" @refresh="refresh" />
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useAdminStore, type AdminUser } from "@/stores/admin";
import { useUserStore } from "@/stores/user";
import { useToast } from "@/lib/notifications";
import AdminUserDialog from "@/components/admin/AdminUserDialog.vue";
import { accountStatus, filterAdminUsers, registrationDate, roleLabel, statusLabel, validAdminUsers, type UserRole } from "@/helpers/adminUsers";
const adminStore = useAdminStore(), userStore = useUserStore();
const users = ref<AdminUser[]>([]), selectedId = ref(""), loading = ref(true), loadError = ref(false);
const toast = useToast();
const search = ref(""), role = ref<"" | UserRole>(""), status = ref(""), activity = ref(""), order = ref("newest");
const page = ref(1), pageSize = ref(12), actorId = computed(() => userStore.user?._id);
const selected = computed(() => users.value.find(account => account._id === selectedId.value) ?? null);
const filtered = computed(() => filterAdminUsers(users.value, { search: search.value, role: role.value, status: status.value, activity: activity.value, order: order.value }));
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)));
const visible = computed(() => filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value));
const hasFilters = computed(() => !!search.value || !!role.value || !!status.value || !!activity.value);
const statusColor = (user: AdminUser) => accountStatus(user) === "blocked" ? "text-red-300" : accountStatus(user) === "pending" ? "text-amber-300" : "text-green-400";
const statistics = computed(() => {
  const now = Date.now(), cutoff = now - 30 * 86400000;
  return [
    { label: "Clientes registrados", value: users.value.filter(user => user.role === "client").length },
    { label: "Cuentas nuevas · 30 días", value: users.value.filter(user => { const date = Date.parse(user.createdAt); return date >= cutoff && date <= now; }).length },
    { label: "Correos por confirmar", value: users.value.filter(user => !user.verified && !user.blocked).length, attention: true },
    { label: "Cuentas bloqueadas", value: users.value.filter(user => user.blocked).length },
  ];
});
let alive = true, request = 0;
async function refresh() {
  const version = ++request; loading.value = true; loadError.value = false;
  await adminStore.getAllUsers();
  if (!alive || version !== request) return;
  loadError.value = !!adminStore.usersError || !validAdminUsers(adminStore.users);
  users.value = loadError.value ? [] : adminStore.users;
  if (!loadError.value && selectedId.value && !users.value.some(user => user._id === selectedId.value)) selectedId.value = "";
  loading.value = false;
}
function clearFilters() { search.value = ""; role.value = ""; status.value = ""; activity.value = ""; }
function onChanged(message: string) { selectedId.value = ""; toast.success(message); adminStore.appointments = []; void refresh(); }
watch([search, role, status, activity, order, pageSize], () => { page.value = 1; });
watch(pages, value => { if (page.value > value) page.value = value; });
onMounted(() => { void refresh(); });
onBeforeUnmount(() => { alive = false; });
</script>
