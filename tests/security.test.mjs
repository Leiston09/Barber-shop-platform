import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { createPinia, setActivePinia } from "pinia";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function environment(entry, { axiosMock, api = {} } = {}) {
  const memory = new Map();
  const localStorage = { getItem: key => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value), removeItem: key => memory.delete(key) };
  const window = new EventTarget(), pushes = [];
  const ctx = vm.createContext({ console, localStorage, window, Event, Date, Intl, TextEncoder, setTimeout, clearTimeout });
  const cache = new Map();
  async function moduleFor(spec, parent) {
    let key = spec.startsWith("@/") ? path.join(root, "src", spec.slice(2))
      : spec.startsWith(".") ? path.resolve(path.dirname(parent), spec) : spec;
    if (path.isAbsolute(key) && !key.endsWith(".ts")) {
      key = [key + ".ts", path.join(key, "index.ts")].find(p => fs.existsSync(p)) ?? key;
    }
    if (cache.has(key)) return cache.get(key);
    let exports;
    if (key === "vue-router") exports = { useRouter: () => ({ push: value => pushes.push(value) }) };
    else if (key === "axios" && axiosMock) exports = { default: axiosMock };
    else if (key === path.join(root, "src/lib/axios.ts") && !axiosMock) exports = { default: api };
    else if (!path.isAbsolute(key)) exports = await import(key);
    if (exports) {
      const mod = new vm.SyntheticModule(Object.keys(exports), function () {
        for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
      }, { context: ctx });
      cache.set(key, mod); return mod;
    }
    const code = ts.transpileModule(fs.readFileSync(key, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText;
    const mod = new vm.SourceTextModule(code, { context: ctx, identifier: key, initializeImportMeta(meta) { meta.env = { VITE_API_URL: "http://test.invalid/api" }; } });
    cache.set(key, mod); return mod;
  }
  async function load(entry) {
    const mod = await moduleFor("@/" + entry, path.join(root, "src/main.ts"));
    if (mod.status === "unlinked") await mod.link((spec, parent) => moduleFor(spec, parent.identifier));
    if (mod.status === "linked") await mod.evaluate();
    return mod.namespace;
  }
  const mod = await load(entry);
  return { mod, load, localStorage, window, pushes };
}
async function interceptors() {
  const handlers = {};
  const axiosMock = { create: () => ({ interceptors: {
    request: { use: fn => { handlers.request = fn; } },
    response: { use: (ok, fail) => { handlers.ok = ok; handlers.fail = fail; } },
  } }), CanceledError: class extends Error {} };
  const env = await environment("lib/axios.ts", { axiosMock });
  return { ...env, handlers };
}

test("una respuesta 500 o un permiso denegado no destruyen la sesion", async () => {
  const env = await interceptors();
  env.localStorage.setItem("AUTH_TOKEN", "actual");
  for (const status of [500, 403]) {
    const error = { config: { url: "/appointments", headers: { Authorization: "Bearer actual" } }, response: { status } };
    await assert.rejects(env.handlers.fail(error));
    assert.equal(env.localStorage.getItem("AUTH_TOKEN"), "actual");
  }
});

test("401 o bloqueo invalidan la sesion, pero un login fallido no la invalida", async () => {
  const env = await interceptors();
  let invalidations = 0;
  env.window.addEventListener("appsalon:session-invalid", () => invalidations++);
  env.localStorage.setItem("AUTH_TOKEN", "actual");
  const config = { url: "/auth/login", headers: { Authorization: "Bearer actual" } };
  await assert.rejects(env.handlers.fail({ config, response: { status: 401 } }));
  assert.equal(invalidations, 0);
  config.url = "/appointments";
  await assert.rejects(env.handlers.fail({ config, response: { status: 401 } }));
  assert.equal(env.localStorage.getItem("AUTH_TOKEN"), null);
  assert.equal(invalidations, 1);
  env.localStorage.setItem("AUTH_TOKEN", "actual");
  await assert.rejects(env.handlers.fail({ config, response: { status: 403, data: { blocked: true } } }));
  assert.equal(invalidations, 2);
});

test("una respuesta de otra sesion se descarta antes de actualizar los stores", async () => {
  const env = await interceptors();
  env.localStorage.setItem("AUTH_TOKEN", "nueva");
  await assert.rejects(env.handlers.ok({ config: { headers: { Authorization: "Bearer anterior" } }, data: ["privado"] }));
});

test("logout limpia informacion privada de todos los stores sin romper sus importaciones", async () => {
  setActivePinia(createPinia());
  const env = await environment("stores/user.ts");
  const user = env.mod.useUserStore();
  const admin = (await env.load("stores/admin.ts")).useAdminStore();
  const barber = (await env.load("stores/barber.ts")).useBarberStore();
  const mine = (await env.load("stores/myAppointments.ts")).useMyAppointmentsStore();
  const booking = (await env.load("stores/appointmentCreator.ts")).useAppointmentBookingStore();
  user.user = { _id: "a", role: "admin" };
  admin.users = [{ _id: "private" }]; admin.clients = [{ _id: "private" }]; admin.appointments = [{ _id: "private" }];
  barber.myClients = [{ _id: "private" }]; mine.appointments = [{ _id: "private" }];
  booking.services = [{ _id: "private" }]; booking.barber = { _id: "private" };
  env.localStorage.setItem("AUTH_TOKEN", "actual");
  user.logout();
  assert.equal(user.user, null); assert.equal(env.localStorage.getItem("AUTH_TOKEN"), null);
  assert.equal(admin.users.length + admin.clients.length + admin.appointments.length + barber.myClients.length + mine.appointments.length + booking.services.length, 0);
  assert.equal(booking.barber, null); assert.equal(env.pushes.at(-1).name, "Login");
});

test("un fallo transitorio al inicializar conserva el token para reintentar", async () => {
  setActivePinia(createPinia());
  const env = await environment("stores/user.ts", { api: { get: async () => { throw { response: { status: 500 } }; } } });
  env.localStorage.setItem("AUTH_TOKEN", "actual");
  const user = env.mod.useUserStore(); await user.init();
  assert.equal(user.user, null); assert.equal(user.initialized, true);
  assert.equal(env.localStorage.getItem("AUTH_TOKEN"), "actual");
});

const settle = () => new Promise(resolve => setTimeout(resolve, 20));
async function bookingEnvironment(overrides = {}) {
  setActivePinia(createPinia());
  const id = "aaaaaaaaaaaaaaaaaaaaaaaa", other = "bbbbbbbbbbbbbbbbbbbbbbbb", date = "2099-01-01";
  const schedule = { schedule: [{ day: new Date(date + "T12:00:00").getDay(), isWorking: true, startTime: "09:00", endTime: "12:00", breaks: [] }], blockedDates: [] };
  const env = await environment("stores/appointmentCreator.ts", { api: {
    get: async (url, config) => ({ data: url === "/settings" ? { maxServicesPerAppointment: 2, version: -1 } : url === "/appointments/availability" ? { date: config.params.date, slots: [{ time: "09:00", endTime: "10:00", barbers: [{ _id: id, name: "Uno" }] }] } : url.startsWith("/barbers/") ? schedule : [] }),
    ...overrides,
  } });
  return { ...env, booking: env.mod.useAppointmentBookingStore(), id, other, date };
}
test("reserva conserva fecha y hora al elegir un barbero y limita los servicios a dos", async () => {
  const { booking, id, other, date } = await bookingEnvironment();
  await booking.loadGlobalAvailability(date);
  assert.equal(booking.selectSlot("09:00"), true);
  assert.equal(booking.selectBarber(other), false);
  assert.equal(booking.selectBarber(id), true);
  await settle();
  assert.equal(booking.date, date); assert.equal(booking.time, "09:00");
  for (const service of [id, other, "c"]) booking.onServiceSelect({ _id: service, name: service, price: 10 });
  assert.equal(booking.services.length, 2); assert.equal(booking.validateReservation, true, JSON.stringify({hours:booking.hours,error:booking.availabilityError,schedule:booking.barberSchedule,loadingHours:booking.loadingHours,loadingSchedule:booking.loadingSchedule,date:booking.date,time:booking.time,occupied:booking.appointmentsByDate}));
  assert.equal(booking.availableBarbers.length, 1);
});
test("disponibilidad descarta respuestas antiguas y falla de forma cerrada", async () => {
  let resolveOld;
  const { booking } = await bookingEnvironment({ get: (url, config) => config.params.date === "2099-01-01" ? new Promise(resolve => { resolveOld = resolve; }) : Promise.reject(new Error("offline")) });
  const first = booking.loadGlobalAvailability("2099-01-01");
  await booking.loadGlobalAvailability("2099-01-02");
  resolveOld({ data: { slots: [{ time: "09:00", barbers: [{ _id: "a" }] }] } }); await first;
  assert.equal(booking.globalSlots.length, 0); assert.ok(booking.globalError);
  assert.equal(booking.selectSlot("09:00"), false);
});
test("confirmacion evita envios dobles y conserva servicios cuando recibe un conflicto", async () => {
  let rejectPost, calls = 0;
  const { booking, id, date } = await bookingEnvironment({ post: () => { calls++; return new Promise((resolve, reject) => { rejectPost = reject; }); } });
  await booking.loadGlobalAvailability(date); booking.selectSlot("09:00"); booking.selectBarber(id);
  booking.onServiceSelect({ _id: id, name: "Corte", price: 10 }); await settle();
  const toast = { open() {} };
  const first = booking.saveAppointment(toast); await booking.saveAppointment(toast); await settle();
  assert.equal(calls, 1); assert.equal(booking.saving, true);
  rejectPost({ response: { status: 409, data: { msg: "Ocupado" } } }); await first;
  assert.equal(booking.saving, false); assert.equal(booking.time, "");
  assert.equal(booking.services.length, 1); assert.match(booking.saveError, /Tus servicios se conservan/);
});

test("reconsultar una hora ocupada conserva los servicios y solicita una nueva hora", async () => {
  let occupied = false;
  const date = "2099-01-01", id = "aaaaaaaaaaaaaaaaaaaaaaaa";
  const schedule = { schedule: [{ day: new Date(date + "T12:00:00").getDay(), isWorking: true, startTime: "09:00", endTime: "12:00", breaks: [] }], blockedDates: [] };
  const { booking } = await bookingEnvironment({ get: async url => ({ data: url.startsWith("/barbers/") ? schedule : url.startsWith("/appointments?") ? occupied ? [{ _id: "busy", time: "09:00" }] : [] : { slots: [{ time: "09:00", endTime: "10:00", barbers: [{ _id: id, name: "Uno" }] }] } }) });
  await booking.loadGlobalAvailability(date); booking.selectSlot("09:00"); booking.selectBarber(id);
  booking.onServiceSelect({ _id: id, name: "Corte", price: 10 }); await settle();
  assert.equal(booking.validateReservation, true);
  occupied = true; await booking.loadHoursByDate(date); await settle();
  assert.equal(booking.time, ""); assert.equal(booking.services.length, 1);
  assert.equal(booking.validateReservation, false); assert.match(booking.saveError, /ya no/);
});

test("resumen administrativo respeta rangos inclusivos y el dia de Ecuador, sin sumar reservas futuras", async () => {
  const { mod } = await environment("helpers/adminDashboard.ts");
  const u1 = { _id: "a", name: "Cliente 1" }, u2 = { _id: "b", name: "Cliente 2" };
  const b1 = { _id: "c", name: "Carlos" }, b2 = { _id: "d", name: "Miguel" };
  const sa = { _id: "s1", name: "Corte", price: 999 }, sb = { _id: "s2", name: "Barba", price: 999 };
  const appointment = (id, date, time, amount, user, barber, services) =>
    ({ _id: id, date: date + "T00:00:00.000Z", time, totalAmount: amount, user, barber, services });
  const data = [
    appointment("previous", "2026-10-12", "10:00", 100, u1, b1, [sa]),
    appointment("first", "2026-10-13", "09:00", 10.1, u1, b1, [sa]),
    appointment("yesterday", "2026-11-10", "10:00", 20.2, u1, b1, [sa, sb]),
    appointment("past-today", "2026-11-11", "19:00", 30.3, u2, b2, [sb]),
    appointment("next", "2026-11-11", "22:00", 40.4, u2, b2, [sa, sa]),
    appointment("future", "2026-11-12", "10:00", 99, u2, b2, [sb]),
    appointment("invalid", "2026-02-30", "10:00", 900, u1, b1, [sa]),
  ];
  const now = new Date("2026-11-12T02:00:00Z");
  const summary = mod.buildDashboardSummary(data, 30, now);
  assert.equal(summary.today, "2026-11-11"); assert.equal(summary.start, "2026-10-13");
  assert.equal(summary.count, 4); assert.equal(summary.previousCount, 1); assert.equal(summary.countChange, 3);
  assert.equal(summary.amount, 101); assert.equal(summary.average, 25.25); assert.equal(summary.clients, 2);
  assert.equal(summary.todayCount, 2); assert.equal(summary.todayUpcoming, 1); assert.equal(summary.nextAppointment._id, "next");
  assert.equal(summary.services.find(item => item.id === "s1").count, 3);
  assert.equal(summary.services.find(item => item.id === "s2").count, 2);
  assert.equal(summary.buckets.reduce((sum, item) => sum + item.count, 0), summary.count);
  assert.ok(Math.abs(summary.buckets.reduce((sum, item) => sum + item.amount, 0) - summary.amount) < 1e-9);
  const week = mod.buildDashboardSummary(data, 7, now);
  assert.equal(week.start, "2026-11-05"); assert.equal(week.count, 3); assert.equal(week.groupSize, 1);
  const quarter = mod.buildDashboardSummary(data, 90, now);
  assert.equal(quarter.buckets.length, 13); assert.equal(quarter.buckets.at(-1).end, quarter.today);
  assert.equal(quarter.buckets.reduce((sum, item) => sum + item.count, 0), quarter.count);
});

test("resumen administrativo vacio y referencias eliminadas no generan cifras ficticias ni NaN", async () => {
  const { mod } = await environment("helpers/adminDashboard.ts");
  const now = new Date("2026-11-11T17:00:00Z");
  const empty = mod.buildDashboardSummary([], 7, now);
  assert.equal(empty.count, 0); assert.equal(empty.amount, 0); assert.equal(empty.average, 0);
  assert.equal(empty.nextAppointment, null); assert.equal(empty.buckets.length, 7);
  assert.ok(empty.buckets.every(bucket => bucket.count === 0 && bucket.amount === 0));
  const missing = mod.buildDashboardSummary([{ _id: "x", date: "2026-11-11", time: "15:00", totalAmount: 0,
    user: null, barber: null, services: [null] }], 7, now);
  assert.equal(missing.clients, 0); assert.equal(missing.services.length, 0);
  assert.equal(missing.professionals[0].name, "Profesional no disponible");
  assert.equal(missing.count, 1); assert.equal(missing.amount, 0);
});

test("resumen suma importes historicos de las citas con precision de centavos y no precios actuales", async () => {
  const { mod } = await environment("helpers/adminDashboard.ts");
  const data = [0.1, 0.2].map((totalAmount, index) => ({ _id: String(index), date: "2026-11-11", time: "15:00",
    totalAmount, user: null, barber: null, services: [{ _id: "service", name: "Corte", price: 1000 }] }));
  const result = mod.buildDashboardSummary(data, 7, new Date("2026-11-11T17:00:00Z"));
  assert.equal(result.amount, 0.3); assert.equal(result.average, 0.15);
  assert.equal(result.services[0].count, 2);
});

test("agenda administrativa conserva el dia UTC y distingue el horario actual sin afirmar asistencia", async () => {
  const { mod } = await environment("helpers/adminAgenda.ts");
  const clock = mod.agendaClock(new Date("2026-11-12T02:00:00Z"));
  assert.equal(clock.date, "2026-11-11"); assert.equal(clock.time, "21:00");
  assert.equal(mod.appointmentDay("2026-11-11T00:00:00.000Z"), "2026-11-11");
  assert.equal(mod.appointmentDay("2026-02-30"), "");
  const item = { date: "2026-11-11T00:00:00.000Z", time: "20:00" };
  assert.equal(mod.appointmentTiming(item, { date: "2026-11-11", time: "20:59" }), "current");
  assert.equal(mod.appointmentTiming(item, clock), "past");
  assert.equal(mod.appointmentTiming({ ...item, time: "21:00" }, clock), "current");
  assert.equal(mod.appointmentTiming({ ...item, time: "22:00" }, clock), "upcoming");
  assert.equal(mod.appointmentTiming({ ...item, date: "2026-11-12" }, clock), "upcoming");
  assert.equal(mod.appointmentTiming({ ...item, time: "24:00" }, clock), "unknown");
});

test("agenda filtra cliente, servicio, profesional y referencia ignorando acentos sin modificar los datos", async () => {
  const { mod } = await environment("helpers/adminAgenda.ts");
  const first = { _id: "abc123", date: "2026-11-11T00:00:00.000Z", time: "15:00", totalAmount: 25,
    user: { _id: "a", name: "José Álvarez", email: "jose@example.test" },
    barber: { _id: "b", name: "Andrés Pérez" }, services: [{ _id: "s", name: "Afeitado clásico" }] };
  const data = [first, { ...first, _id: "other", date: "2026-11-12", user: null, barber: null, services: [null] }];
  const now = { date: "2026-11-11", time: "12:00" };
  const filters = { search: "", date: "", barber: "", view: "all", order: "asc" };
  for (const text of ["jose alvarez", "JOSE@", "andres", "afeitado clasico", "ABC123"]) {
    const result = mod.filterAdminAppointments(data, { ...filters, search: text }, now);
    assert.equal(result.length, 1); assert.equal(result[0]._id, "abc123");
  }
  assert.equal(mod.filterAdminAppointments(data, { ...filters, barber: "b" }, now).length, 1);
  assert.equal(mod.filterAdminAppointments(data, { ...filters, date: "2026-11-12", view: "past" }, now)[0]._id, "other");
  assert.equal(mod.filterAdminAppointments(data, { ...filters, order: "desc" }, now)[0]._id, "other");
  assert.deepEqual(data.map(item => item._id), ["abc123", "other"]);
});

test("agenda de hoy y proximas usa la hora de Ecuador y excluye horas ya comenzadas de proximas", async () => {
  const { mod } = await environment("helpers/adminAgenda.ts");
  const make = (id, date, time) => ({ _id: id, date, time, totalAmount: 0, user: null, barber: null, services: [] });
  const data = [make("old", "2026-11-10", "10:00"), make("past", "2026-11-11", "10:00"),
    make("current", "2026-11-11", "12:00"), make("next", "2026-11-11", "13:00"), make("future", "2026-11-12", "10:00")];
  const now = { date: "2026-11-11", time: "12:30" };
  const filters = { search: "", date: "", barber: "", view: "today", order: "asc" };
  assert.deepEqual(Array.from(mod.filterAdminAppointments(data, filters, now), item => item._id), ["past", "current", "next"]);
  assert.deepEqual(Array.from(mod.filterAdminAppointments(data, { ...filters, view: "upcoming" }, now), item => item._id), ["next", "future"]);
  assert.deepEqual(Array.from(mod.filterAdminAppointments(data, { ...filters, view: "past", order: "desc" }, now), item => item._id), ["past", "old"]);
});

test("editor de jornada valida pausas, turnos completos y fechas imposibles sin modificar referencias", async () => {
  const { mod } = await environment("helpers/barberSchedule.ts");
  const days = mod.blankSchedule();
  assert.equal(days.length, 7); assert.equal(days.some(day => day.isWorking), false);
  const day = days[0]; day.isWorking = true; day.startTime = "09:00"; day.endTime = "13:00"; day.breaks = [{ startTime: "10:30", endTime: "11:30" }];
  assert.deepEqual(Array.from(mod.dailySlots(day)), ["09:00", "12:00"]);
  assert.equal(Object.keys(mod.scheduleErrors(days, [])).length, 0);
  day.breaks.push({ startTime: "11:00", endTime: "12:00" });
  assert.ok(mod.scheduleErrors(days, [])["day-1"]);
  day.breaks = []; day.endTime = "09:30";
  assert.ok(mod.scheduleErrors(days, [])["day-1"]);
  const blocks = [{ date: "2026-02-30", partial: false, reason: "", startTime: "09:00", endTime: "10:00" }];
  assert.ok(mod.scheduleErrors([], blocks)["block-0"]);
  blocks[0].date = "2026-11-11"; blocks[0].partial = true; blocks[0].endTime = "08:00";
  assert.ok(mod.scheduleErrors([], blocks)["block-0"]);
  const original = { schedule: [{ day: 1, isWorking: true, startTime: "09:00", endTime: "18:00", breaks: [{ startTime: "13:00", endTime: "14:00" }] }], blockedDates: [] };
  const copied = mod.blankSchedule(original); copied[0].breaks[0].startTime = "12:00";
  assert.equal(original.schedule[0].breaks[0].startTime, "13:00");
});

test("foto del profesional usa una ruta API por identidad y nunca rutas de public", async () => {
  const { mod } = await environment("helpers/barberPhoto.ts");
  assert.equal(mod.barberPhotoUrl("../../file"), "");
  assert.equal(mod.barberPhotoUrl("a".repeat(24), "2026-11-11T12:00:00Z"), "http://test.invalid/api/barbers/" + "a".repeat(24) + "/photo?v=2026-11-11T12%3A00%3A00Z");
});

test("directorio de cuentas filtra acentos, rol, actividad y acceso confirmado sin alterar la lista", async () => {
  const { mod } = await environment("helpers/adminUsers.ts");
  const base = { _id: "a".repeat(24), name: "José Pérez", email: "jose@example.com", role: "client", verified: true, blocked: false, protected: false, createdAt: "2026-11-11", appointmentsCount: 2, futureAppointmentsCount: 1, totalSpent: 25 };
  const users = [base, { ...base, _id: "b".repeat(24), name: "Ana", verified: false, appointmentsCount: 0, futureAppointmentsCount: 0 }, { ...base, _id: "c".repeat(24), name: "Barbero", role: "barber", blocked: true }];
  const filters = { search: "jose", role: "client", status: "active", activity: "upcoming", order: "name" };
  assert.deepEqual(Array.from(mod.filterAdminUsers(users, filters), user => user._id), [base._id]);
  assert.equal(mod.filterAdminUsers(users, { ...filters, search: "", activity: "" }).length, 1);
  assert.equal(mod.filterAdminUsers(users, { ...filters, search: "", status: "pending", activity: "none" })[0].name, "Ana");
  assert.equal(users[0].name, "José Pérez");
  assert.equal(mod.validAdminUsers(users), true);
  assert.equal(mod.validAdminUsers([{ ...base, totalSpent: NaN }]), false);
});

test("cuentas propias y protegidas no se gestionan y el historial impide eliminar sin duplicar reservas propias", async () => {
  const { mod } = await environment("helpers/adminUsers.ts");
  const account = { _id: "a".repeat(24), protected: false, appointmentsCount: 1, futureAppointmentsCount: 2, assignedAppointmentsCount: 2, assignedFutureAppointmentsCount: 2, selfFutureAppointmentsCount: 1 };
  assert.equal(mod.canManageAccount(account, account._id), false);
  assert.equal(mod.canManageAccount({ ...account, protected: true }, "b".repeat(24)), false);
  assert.equal(mod.canManageAccount(account, undefined), false);
  assert.equal(mod.canDeleteAccount(account, "b".repeat(24)), false);
  assert.equal(mod.canDeleteAccount({ ...account, appointmentsCount: 0, assignedAppointmentsCount: 0 }, "b".repeat(24)), true);
  assert.equal(mod.affectedReservations(account), 3);
});

test("agenda filtra por identificador de cliente aunque dos personas tengan el mismo nombre", async () => {
  const { mod } = await environment("helpers/adminAgenda.ts");
  const a = { _id: "1", date: "2026-11-11", time: "15:00", user: { _id: "a", name: "Ana" }, barber: null, services: [] };
  const b = { ...a, _id: "2", user: { _id: "b", name: "Ana" } };
  const results = mod.filterAdminAppointments([a, b], { client: "b", search: "", date: "", barber: "", view: "all", order: "asc" }, { date: "2026-11-11", time: "10:00" });
  assert.deepEqual(Array.from(results, item => item._id), ["2"]);
});

test("precios de servicio aceptan coma y cero sin coerciones ambiguas ni más de dos decimales", async () => {
  const { mod } = await environment("helpers/adminServices.ts");
  assert.equal(mod.parseServicePrice("12,50"), 12.5); assert.equal(mod.parseServicePrice("0"), 0);
  for (const value of ["", "-1", "NaN", "Infinity", "1e3", "1.234", "1,2,3", "1000000.01"]) assert.equal(mod.parseServicePrice(value), null);
  assert.equal(Object.keys(mod.serviceDraftErrors({ name: "Corte", price: "12.50", description: "", active: true })).length, 0);
  assert.ok(mod.serviceDraftErrors({ name: " ", price: "", description: "a".repeat(301), active: false }).name);
  assert.ok(mod.serviceDraftErrors({ name: "Corte", price: "", description: "a".repeat(301), active: false }).description);
});

test("catalogo distingue servicios heredados publicados y pausados, busca descripciones y no modifica los datos", async () => {
  const { mod } = await environment("helpers/adminServices.ts");
  const base = { _id: "a".repeat(24), name: "Corte clásico", price: 15, description: "Acabado con tijera", appointmentsCount: 2, futureAppointmentsCount: 1 };
  const items = [base, { ...base, _id: "b".repeat(24), name: "Barba", price: 10, active: false }];
  assert.deepEqual(Array.from(mod.filterCatalog(items, "clasico tijera", "published", "name"), item => item._id), [base._id]);
  assert.equal(mod.filterCatalog(items, "", "paused", "name")[0].name, "Barba");
  assert.deepEqual(Array.from(mod.filterCatalog(items, "", "all", "price-low"), item => item.price), [10, 15]);
  assert.equal(items[0].name, "Corte clásico"); assert.equal(mod.validCatalog(items), true);
});

test("catalogo administrativo rechaza importes y datos de uso inválidos en vez de mostrar ceros ficticios", async () => {
  const { mod } = await environment("helpers/adminServices.ts");
  const item = { _id: "a".repeat(24), name: "Corte", price: 10, appointmentsCount: 1, futureAppointmentsCount: 0 };
  assert.equal(mod.validCatalog([item]), true);
  assert.equal(mod.validCatalog([{ ...item, price: NaN }]), false);
  assert.equal(mod.validCatalog([{ ...item, appointmentsCount: -1 }]), false);
  assert.equal(mod.validCatalog([{ ...item, active: "false" }]), false);
});

test("servicio pausado al confirmar conserva el horario y muestra el error del catalogo", async () => {
  const { booking, id, date } = await bookingEnvironment({ post: async () => { throw { response: { status: 400, data: { msg: "El servicio fue pausado. Revisa tu selección." } } }; } });
  await booking.loadGlobalAvailability(date); booking.selectSlot("09:00"); booking.selectBarber(id);
  booking.onServiceSelect({ _id: id, name: "Corte", price: 10 }); await settle();
  await booking.saveAppointment({ open() {} });
  assert.equal(booking.time, "09:00"); assert.equal(booking.barber._id, id);
  assert.equal(booking.services.length, 1); assert.match(booking.saveError, /pausado/);
});

test("promociones del cliente desaparecen al vencer y recuperan el precio normal", async () => {
  const { mod } = await environment("helpers/promotions.ts");
  const offer = { title: "Oferta", kind: "percentage", value: 20, startsAt: "2099-01-01T05:00:00Z", endsAt: "2099-01-02T05:00:00Z", enabled: true };
  const service = { price: 12, basePrice: 15, promotion: offer };
  assert.equal(mod.isCurrentPromotion(service, Date.parse(offer.startsAt)), true);
  assert.equal(mod.isCurrentPromotion(service, Date.parse(offer.endsAt)), false);
  assert.equal(mod.currentServicePrice(service, Date.parse(offer.endsAt)), 15);
  assert.equal(mod.currentServicePrice({ price: 15 }, Date.parse(offer.startsAt)), 15);
});

test("formulario de promociones conserva la hora de Ecuador y rechaza fechas imposibles", async () => {
  const { mod } = await environment("helpers/promotions.ts");
  assert.equal(mod.fromPromotionInput("2099-01-01T10:30"), "2099-01-01T15:30:00.000Z");
  assert.equal(mod.toPromotionInput("2099-01-01T15:30:00Z"), "2099-01-01T10:30");
  assert.equal(mod.fromPromotionInput("2099-02-30T10:30"), null);
  assert.equal(mod.fromPromotionInput("texto"), null);
});

test("mensajes del catalogo no muestran identificadores ni errores internos", async () => {
  const { mod } = await environment("helpers/promotions.ts");
  for (const msg of ["ID no válido", "CastError: ObjectId", "Error interno del servidor", "Error de consulta"]) {
    assert.equal(mod.serviceMessage({ response: { status: 400, data: { msg } } }, "No pudimos cargar los servicios."), "No pudimos cargar los servicios.");
  }
  assert.equal(mod.serviceMessage({ response: { status: 400, data: { msg: "El precio especial debe ser menor que el precio normal." } } }, "Error"), "El precio especial debe ser menor que el precio normal.");
});

test("cambio de precio conserva horario y obliga a revisar el importe actualizado", async () => {
  const { booking, id, date, env } = await bookingEnvironment({ post: async () => { throw { response: { status: 400, data: { code: "PRICE_CHANGED", msg: "El precio cambió. Revisa el importe." } } }; } });
  await booking.loadGlobalAvailability(date); booking.selectSlot("09:00"); booking.selectBarber(id);
  booking.onServiceSelect({ _id: id, name: "Corte", price: 10 }); await settle();
  await booking.saveAppointment({ open() {} });
  assert.equal(booking.time, "09:00"); assert.match(booking.saveError, /precio/); assert.equal(booking.saving, false);
});

test("notificaciones limitan la pila y mantienen la cola y los cierres sin duplicar callbacks", async () => {
  const { mod } = await environment("lib/notifications.ts");
  let dismissed = 0;
  const handles = Array.from({ length: 5 }, (_, index) => mod.toast.open({ message: "Mensaje " + index, duration: 0, onDismiss: () => { dismissed++; } }));
  assert.equal(mod.notifications.length, 3);
  assert.equal(mod.notifications[0].message, "Mensaje 0");
  handles[0].dismiss(); handles[0].dismiss();
  assert.equal(dismissed, 1);
  assert.deepEqual(Array.from(mod.notifications, item => item.message), ["Mensaje 1", "Mensaje 2", "Mensaje 3"]);
  mod.toast.clear(); assert.equal(mod.notifications.length, 0); assert.equal(dismissed, 5);
});

test("notificaciones agrupan repetidos, descartan mensajes vacios y no interpretan HTML", async () => {
  const { mod } = await environment("lib/notifications.ts");
  mod.toast.open({ message: null }); mod.toast.open(" ");
  assert.equal(mod.notifications.length, 0);
  mod.toast.open({ message: " Guardado ", type: "success", duration: 0 });
  mod.toast.open({ message: "Guardado", type: "success", duration: 0 });
  assert.equal(mod.notifications.length, 1);
  mod.toast.open({ message: "<img src=x onerror=alert(1)>", duration: 0, dismissible: false });
  assert.equal(mod.notifications[1].message, "<img src=x onerror=alert(1)>");
  assert.equal(mod.notifications[1].dismissible, true);
  mod.toast.open({ message: "CastError: ObjectId ID no valido", type: "error", duration: 0 });
  assert.match(mod.notifications[2].message, /Actualiza la página/);
  mod.toast.clear();
});

test("notificacion pausa el cierre mientras el cursor o el foco siguen dentro", async () => {
  const { mod } = await environment("lib/notifications.ts");
  const handle = mod.toast.open({ message: "Lee este mensaje", duration: 500 });
  const id = mod.notifications[0].id;
  mod.pauseNotice(id, "pointer"); mod.pauseNotice(id, "focus");
  await new Promise(resolve => setTimeout(resolve, 650));
  assert.equal(mod.notifications.length, 1);
  mod.resumeNotice(id, "pointer");
  await new Promise(resolve => setTimeout(resolve, 100));
  assert.equal(mod.notifications.length, 1);
  mod.resumeNotice(id, "focus");
  await new Promise(resolve => setTimeout(resolve, 650));
  assert.equal(mod.notifications.length, 0);
  handle.dismiss(); mod.toast.clear();
});

test("notificaciones no consumen su tiempo mientras la pagina esta oculta", async () => {
  const { mod } = await environment("lib/notifications.ts");
  mod.toast.open({ message: "Sigue aquí al volver", duration: 200 });
  mod.pauseNotifications("test-hidden", true);
  await new Promise(resolve => setTimeout(resolve, 300));
  assert.equal(mod.notifications.length, 1); assert.equal(mod.notifications[0].remaining, 200);
  mod.pauseNotifications("test-hidden", false);
  await new Promise(resolve => setTimeout(resolve, 350));
  assert.equal(mod.notifications.length, 0); mod.toast.clear();
});

test("asistencia provisional se marca visualmente sin convertirla en un resultado guardado", async () => {
  const { mod } = await environment("helpers/barberPanel.ts");
  const rows = [
    { _id: "a", attendance: "pending", canRecord: true },
    { _id: "b", attendance: "no_show", canRecord: true },
    { _id: "c", attendance: "attended", canRecord: true },
    { _id: "d", attendance: "pending", canRecord: false },
  ];
  const draft = mod.attendanceDraft(rows);
  assert.deepEqual(JSON.parse(JSON.stringify(draft)), { a: true, b: false, c: true, d: true });
  draft.a = false;
  assert.deepEqual(JSON.parse(JSON.stringify(mod.attendancePayload(rows, draft))), [
    { appointment: "a", attended: false }, { appointment: "b", attended: false }, { appointment: "c", attended: true },
  ]);
  assert.equal(rows[0].attendance, "pending"); assert.equal(rows[3].attendance, "pending");
});
test("graficos incluyen todos los dias con ceros y avanzar de mes no salta febrero", async () => {
  const { mod } = await environment("helpers/barberPanel.ts");
  const result = mod.chartDays({ from: "2026-11-09", to: "2026-11-15", series: [{ date: "2026-11-12", attended: 2, noShows: 1, revenue: 25 }] });
  assert.equal(result.length, 7); assert.equal(result[0].revenue, 0); assert.equal(result[3].revenue, 25);
  assert.equal(mod.movePeriod("2026-01-31", "month", 1), "2026-02-01");
  assert.equal(mod.movePeriod("2026-12-31", "month", 1), "2027-01-01");
  assert.equal(mod.movePeriod("2026-11-12", "week", -1), "2026-11-05");
});

test("barbero primero consulta solo su agenda y conserva profesional al cambiar fecha y hora", async () => {
  const { booking, id, other, date } = await bookingEnvironment();
  booking.setBookingMode("barber");
  await booking.loadGlobalAvailability(date);
  assert.match(booking.globalError, /Elige primero/); assert.equal(booking.selectSlot("09:00"), false);
  booking.selectPreferredBarber({ _id: id, name: "Uno" });
  await booking.loadGlobalAvailability(date);
  assert.equal(booking.selectSlot("09:00"), true); await settle();
  assert.equal(booking.barber._id, id); assert.equal(booking.date, date);
  booking.onServiceSelect({ _id: id, name: "Corte", price: 10 });
  assert.equal(booking.validateReservation, true);
  booking.selectPreferredBarber({ _id: other, name: "Dos" });
  assert.equal(booking.time, ""); assert.equal(booking.date, ""); assert.equal(booking.services.length, 1);
  await booking.loadGlobalAvailability(date);
  assert.equal(booking.selectSlot("09:00"), false); assert.equal(booking.barber._id, other);
});
test("cambiar modalidad invalida respuestas anteriores y conserva los servicios", async () => {
  let resolve;
  const { booking, id, date } = await bookingEnvironment({ get: () => new Promise(r => { resolve = r; }) });
  booking.onServiceSelect({ _id: id, name: "Corte", price: 10 });
  const request = booking.loadGlobalAvailability(date);
  booking.setBookingMode("barber");
  resolve({ data: { slots: [{ time: "09:00", barbers: [{ _id: id }] }] } }); await request;
  assert.equal(booking.globalSlots.length, 0); assert.equal(booking.barber, null); assert.equal(booking.time, "");
  assert.equal(booking.services.length, 1);
  booking.clearAppointmentData(); assert.equal(booking.bookingMode, "time"); assert.equal(booking.services.length, 0);
});
test("disponibilidad de barbero primero envia su filtro y horario primero consulta el conjunto", async () => {
  const calls = [], id = "aaaaaaaaaaaaaaaaaaaaaaaa", date = "2099-01-01";
  const { booking } = await bookingEnvironment({ get: async (url, config) => {
    if (url === "/appointments/availability") { calls.push(config.params); return { data: { slots: [{ time: "09:00", barbers: [{ _id: id, name: "Uno" }] }] } }; }
    return { data: { schedule: [], blockedDates: [] } };
  } });
  booking.setBookingMode("barber"); booking.selectPreferredBarber({ _id: id, name: "Uno" });
  await booking.loadGlobalAvailability(date); assert.equal(calls.at(-1).barber, id);
  booking.setBookingMode("time"); await booking.loadGlobalAvailability(date); assert.equal(calls.at(-1).barber, undefined);
});

test("resumen separa ingresos atendidos e incluye profesionales habilitados sin reservas", async () => {
  const { mod } = await environment("helpers/adminDashboard.ts");
  const rows = ["attended", "no_show", "pending"].map((attendance, index) => ({ _id: String(index), date: "2026-11-10", time: "09:00", totalAmount: 10, attendance, user: { _id: "client" }, barber: { _id: "active", name: "Activo" }, services: [] }));
  const summary = mod.buildDashboardSummary(rows, 7, new Date("2026-11-11T17:00:00Z"), [{ _id: "zero", name: "Sin reservas" }, { _id: "active", name: "Activo" }]);
  assert.equal(summary.count, 3); assert.equal(summary.amount, 30); assert.equal(summary.revenue, 10);
  assert.equal(summary.attended, 1); assert.equal(summary.noShows, 1); assert.equal(summary.pendingAttendance, 1);
  assert.equal(summary.professionals.length, 2); assert.equal(summary.professionals[0].count, 3); assert.equal(summary.professionals[1].count, 0);
  assert.equal(summary.buckets.reduce((sum, bucket) => sum + bucket.revenue, 0), 10);
});

test("limite configurable actualiza la seleccion sin truncar servicios ya elegidos", async () => {
  const env = await environment("stores/appointmentCreator.ts");
  const booking = env.mod.useAppointmentBookingStore();
  const settings = (await env.load("stores/settings.ts")).useSettingsStore();
  booking.onServiceSelect({ _id: "a", name: "A", price: 1 });
  booking.onServiceSelect({ _id: "b", name: "B", price: 1 });
  settings.maxServicesPerAppointment = 1;
  booking.onServiceSelect({ _id: "c", name: "C", price: 1 });
  assert.equal(booking.services.length, 2);
  booking.deleteService("b"); booking.deleteService("a");
  booking.onServiceSelect({ _id: "c", name: "C", price: 1 });
  booking.onServiceSelect({ _id: "d", name: "D", price: 1 });
  assert.equal(booking.services.length, 1);
});

test("formularios propios validan campos, telefono opcional y confirmacion sin alterar contrasenas",async()=>{
 const {mod}=await environment("helpers/authForm.ts");
 assert.match(mod.authFormError("email","incorrecto",{},true),/correo válido/);
 assert.equal(mod.authFormError("phone","",{},false),"");
 assert.equal(mod.authFormError("phone","   ",{},false),"");
 assert.match(mod.authFormError("phone","abc",{},false),/teléfono/);
 assert.match(mod.authFormError("password","corta",{},true),/8 caracteres/);
 assert.match(mod.authFormError("password","é".repeat(37),{},true),/72 bytes/);
 assert.equal(mod.authFormError("password","contraseña segura",{},true),"");
 assert.match(mod.authFormError("password_confirm","distinta",{password:"original"},true),/coinciden/);
 assert.equal(mod.authFormError("password_confirm","original",{password:"original"},true),"");
});
