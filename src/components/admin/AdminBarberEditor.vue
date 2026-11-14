<template>
  <dialog
    ref="dialog"
    aria-labelledby="barber-editor-title"
    @cancel.prevent="requestClose"
    @click.self="requestClose"
    class="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#101010] p-0 text-white shadow-2xl backdrop:bg-black/80"
  >
    <div class="flex max-h-[calc(92dvh-2px)] flex-col">
      <header
        class="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6"
      >
        <div class="min-w-0">
          <p class="mb-1 text-xs text-white/45">
            {{ selfService ? "Mi disponibilidad" : "Gestión del profesional" }}
          </p>
          <h2
            id="barber-editor-title"
            class="break-words font-barber text-xl sm:text-2xl"
          >
            {{ savedName }}
          </h2>
        </div>
        <button
          type="button"
          :disabled="busy"
          @click="requestClose"
          aria-label="Cerrar ficha del barbero"
          class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-xl text-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-40"
        >
          ×
        </button>
      </header>
      <nav
        aria-label="Configuración del barbero"
        :class="selfService ? 'grid-cols-2' : 'grid-cols-4'"
        class="grid shrink-0 gap-1 border-b border-white/10 px-3 py-2 sm:px-5"
      >
        <button
          v-for="item in editorTabs"
          :key="item.id"
          type="button"
          :disabled="busy"
          :aria-current="tab === item.id ? 'page' : undefined"
          @click="
            tab = item.id;
            discard = false;
          "
          class="min-h-11 rounded-lg px-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-[#ffb700] sm:text-sm"
          :class="
            tab === item.id
              ? 'bg-[#ffb700]/10 text-[#ffb700]'
              : 'text-white/50 hover:text-white'
          "
        >
          {{ item.label }}
        </button>
      </nav>

      <div
        data-editor-body
        class="min-h-0 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6"
      >
        <p
          v-if="error"
          role="alert"
          class="mb-4 rounded-lg border border-red-400/25 bg-red-400/5 p-3 text-sm leading-6 text-red-200"
        >
          {{ error }}
        </p>
        <button
          v-if="stale"
          type="button"
          :disabled="busy"
          @click="reloadStale"
          class="mb-4 min-h-11 rounded-lg border border-[#ffb700]/35 px-4 text-sm text-[#ffb700]"
        >
          Consultar horario actualizado
        </button>
        <div
          v-if="conflicts.length"
          class="mb-3 rounded-lg border border-amber-400/30 p-3"
        >
          <p class="text-sm font-medium text-amber-200">
            {{ conflicts.length }}
            {{
              conflicts.length === 1
                ? "reserva requiere revisión"
                : "reservas requieren revisión"
            }}
          </p>
          <ul
            class="mt-2 max-h-24 space-y-1 overflow-y-auto text-xs leading-5 text-white/65"
          >
            <li v-for="item in conflicts" :key="item._id">
              {{ shortDate(item.date) }} · {{ item.time }} · {{ item.client }}
            </li>
          </ul>
          <p class="mt-2 text-xs leading-5 text-white/50">
            {{
              selfService
                ? "Revisa las citas afectadas y contacta con Administración si necesitas reprogramarlas. Puedes conservarlas como excepción; guardar no cancela citas ni envía avisos."
                : "Puedes reprogramarlas desde la agenda o conservarlas como excepción. Guardar aquí no cancela citas ni envía avisos."
            }}
          </p>
          <div class="mt-2 flex flex-wrap items-center gap-3">
            <RouterLink
              v-if="!selfService"
              :to="{
                name: 'Admin-Appointments',
                query: { barber: barber._id, view: 'upcoming' },
              }"
              class="inline-flex min-h-10 items-center text-xs text-[#ffb700]"
              target="_blank"
              rel="noopener"
              >Revisar agenda en otra pestaña</RouterLink
            >
          </div>
        </div>
        <div
          v-if="confirmNoWork && !conflicts.length"
          class="mb-3 rounded-lg border border-amber-400/25 p-3 text-xs leading-5 text-amber-200"
        >
          Todos los días están desactivados. No recibirá nuevas reservas. Pulsa
          «Guardar sin días habilitados» para confirmarlo.
        </div>
        <section
          v-if="!selfService"
          v-show="tab === 'overview'"
          aria-label="Resumen del profesional"
        >
          <div class="flex items-center gap-4">
            <BarberPortrait
              :id="barber._id"
              :name="savedName"
              :revision="revision"
              compact
              class="h-24! w-24 shrink-0 rounded-xl border border-white/10 sm:h-24!"
            />
            <div class="min-w-0">
              <p class="break-all text-sm text-white/65">{{ barber.email }}</p>
              <p class="mt-2 text-xs leading-5 text-white/45">
                Cuenta confirmada y habilitada. La foto pertenece exclusivamente
                a este perfil.
              </p>
              <button
                type="button"
                @click="tab = 'profile'"
                class="mt-2 min-h-10 text-xs text-[#ffb700]"
              >
                Editar nombre o fotografía
              </button>
            </div>
          </div>
          <p v-if="appointmentsError" class="mt-5 text-sm text-amber-200">
            No pudimos consultar las reservas de este profesional. Vuelve a
            actualizar el equipo.
          </p>
          <dl
            class="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-white/10 p-4 sm:grid-cols-3"
          >
            <div>
              <dt class="text-xs text-white/45">Próximas citas</dt>
              <dd class="mt-2 text-xl tabular-nums">
                {{ appointmentsError ? "—" : future.length }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-white/45">Reservas de este mes</dt>
              <dd class="mt-2 text-xl tabular-nums">
                {{ appointmentsError ? "—" : monthStats.count }}
              </dd>
            </div>
            <div class="col-span-2 sm:col-span-1">
              <dt class="text-xs text-white/45">Importe reservado del mes</dt>
              <dd class="mt-2 text-xl tabular-nums text-[#ffb700]">
                {{ appointmentsError ? "—" : money(monthStats.amount) }}
              </dd>
            </div>
          </dl>
          <p class="mt-2 text-xs leading-5 text-white/40">
            Reservas registradas del mes actual; el importe no acredita cobros
            ni asistencia.
          </p>
          <div
            v-if="current"
            class="mt-5 rounded-lg border border-[#ffb700]/25 p-4 text-sm"
          >
            <span class="text-[#ffb700]">Turno en curso según el horario:</span>
            {{ current.time }} · {{ current.user?.name || "Cliente" }}
          </div>
          <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
            <h3 class="text-sm font-medium">Próximas reservas</h3>
            <RouterLink
              :to="{
                name: 'Admin-Appointments',
                query: { barber: barber._id, view: 'upcoming' },
              }"
              class="inline-flex min-h-10 items-center text-xs text-[#ffb700]"
              >Abrir agenda del barbero</RouterLink
            >
          </div>
          <ul
            v-if="!appointmentsError && future.length"
            class="divide-y divide-white/10"
          >
            <li
              v-for="item in future.slice(0, 4)"
              :key="item._id"
              class="flex items-center justify-between gap-3 py-3"
            >
              <div class="min-w-0">
                <p class="truncate text-sm">
                  {{ item.user?.name || "Cliente" }}
                </p>
                <p class="mt-1 text-xs text-white/45">
                  {{
                    item.services
                      .filter(Boolean)
                      .map((service) => service.name)
                      .join(", ")
                  }}
                </p>
              </div>
              <p class="shrink-0 text-right text-xs leading-5 text-white/65">
                {{ shortDate(item.date) }}<br /><span class="text-[#ffb700]">{{
                  item.time
                }}</span>
              </p>
            </li>
          </ul>
          <p
            v-else-if="!appointmentsError"
            class="mt-3 rounded-lg border border-white/10 p-4 text-sm text-white/45"
          >
            No tiene próximas reservas.
          </p>
        </section>

        <template v-if="tab === 'week' || tab === 'blocks'">
          <p
            v-if="loading"
            role="status"
            class="py-10 text-center text-sm text-white/55"
          >
            Consultando el horario actual…
          </p>
          <div
            v-else-if="scheduleError"
            role="alert"
            class="rounded-xl border border-amber-400/25 p-5"
          >
            <p class="text-sm leading-6 text-amber-200">{{ scheduleError }}</p>
            <button
              type="button"
              @click="loadSchedule"
              class="mt-3 min-h-11 text-sm text-[#ffb700]"
            >
              Volver a consultar
            </button>
          </div>
          <fieldset
            v-else
            :disabled="busy"
            class="min-w-0 disabled:opacity-60"
            @input="clearFeedback"
          >
            <section v-show="tab === 'week'">
              <h3 class="text-base font-medium">Jornada semanal</h3>
              <p class="mt-2 text-sm leading-6 text-white/50">
                {{
                  selfService
                    ? "Selecciona un día y ajusta tu horario y tus pausas."
                    : editingWeek ? "Selecciona un día para ajustar su jornada y sus pausas." : "Consulta sus días de trabajo y pausas. Pulsa Editar horario para hacer cambios."
                }}
                Cada reserva ocupa 60 minutos.
              </p>
              <p v-if="!exists" class="mt-3 text-xs leading-5 text-[#ffb700]">
                {{
                  selfService
                    ? "Todavía no tienes jornada. Habilita tus días de trabajo y guarda para permitir nuevas reservas."
                    : "Todavía no tiene jornada. Habilita los días que trabajará y guarda para permitir nuevas reservas."
                }}
              </p>
              <template v-if="!selfService && !editingWeek">
                <WorkWeekSummary :days="days" />
                <button type="button" @click="editingWeek = true" class="mt-5 min-h-11 w-full rounded-lg bg-[#ffb700] px-4 text-sm font-semibold text-black">{{ exists ? 'Editar horario' : 'Configurar horario' }}</button>
              </template>
              <WorkWeekEditor v-else v-model:days="days" :errors="errors" :disabled="busy" @change="clearFeedback" />
            </section>
            <section v-show="tab === 'blocks'">
              <h3 class="text-base font-medium">Ausencias y bloqueos</h3>
              <p class="mt-2 text-sm leading-6 text-white/50">
                Bloquea vacaciones, permisos o unas horas puntuales. La jornada
                semanal se conserva para el resto de fechas.
              </p>
              <button
                type="button"
                @click="addBlock"
                class="my-5 min-h-11 rounded-lg border border-[#ffb700]/35 px-4 text-sm text-[#ffb700]"
              >
                Añadir ausencia
              </button>
              <p
                v-if="!blocks.length"
                class="rounded-xl border border-white/10 p-5 text-sm leading-6 text-white/45"
              >
                No hay ausencias registradas. Puedes bloquear un día completo o
                solo unas horas.
              </p>
              <div class="space-y-4">
                <div
                  v-for="(block, index) in blocks"
                  :key="index"
                  class="rounded-xl border p-4"
                  :class="
                    errors['block-' + index]
                      ? 'border-red-400/40'
                      : 'border-white/10'
                  "
                >
                  <div class="flex items-start justify-between gap-3">
                    <label class="min-w-0 flex-1 text-xs text-white/50"
                      >Fecha<input
                        v-model="block.date"
                        type="date"
                        :aria-invalid="!!errors['block-' + index]"
                        class="mt-2 min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm text-white" /></label
                    ><button
                      type="button"
                      :disabled="busy || loading"
                      @click="removeAbsence(index)"
                      class="mt-5 inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-red-400/25 px-3 text-xs text-red-300 hover:bg-red-400/10 focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-40"
                    >
                      Eliminar
                    </button>
                  </div>
                  <label class="mt-4 block text-xs text-white/50"
                    >Motivo (opcional)<input
                      v-model="block.reason"
                      type="text"
                      maxlength="200"
                      placeholder="Vacaciones, permiso…"
                      class="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm text-white placeholder:text-white/25"
                  /></label>
                  <label
                    class="mt-4 flex min-h-11 items-center gap-3 text-sm text-white/70"
                    ><input
                      v-model="block.partial"
                      type="checkbox"
                      class="size-4 accent-[#ffb700]"
                    />Bloquear solo unas horas</label
                  >
                  <div v-if="block.partial" class="mt-2 grid grid-cols-2 gap-3">
                    <label class="text-xs text-white/50"
                      >Desde<HourSelect
                        v-model="block.startTime"
                        
                        :aria-invalid="!!errors['block-' + index]"
                        class="mt-2 w-full min-w-0" /></label
                    ><label class="text-xs text-white/50"
                      >Hasta<HourSelect
                        v-model="block.endTime"
                        
                        :aria-invalid="!!errors['block-' + index]"
                        class="mt-2 w-full min-w-0"
                    /></label>
                  </div>
                  <p v-else class="mt-1 text-xs text-white/40">
                    No se ofrecerán turnos durante todo el día.
                  </p>
                  <p
                    v-if="block.date && block.date < now.date"
                    class="mt-3 text-xs text-white/40"
                  >
                    Fecha pasada: se conserva como referencia; no afecta nuevas
                    reservas.
                  </p>
                  <p
                    v-if="errors['block-' + index]"
                    class="mt-3 text-xs leading-5 text-red-300"
                  >
                    {{ errors["block-" + index] }}
                  </p>
                </div>
              </div>
            </section>
          </fieldset>
        </template>

        <section v-if="!selfService" v-show="tab === 'profile'">
          <h3 class="text-base font-medium">Perfil del profesional</h3>
          <p class="mt-2 text-sm leading-6 text-white/50">
            El nombre y la fotografía se muestran a los clientes al elegir
            barbero.
          </p>
          <fieldset :disabled="busy" class="mt-5 min-w-0 disabled:opacity-60">
            <label for="barber-profile-name" class="block text-xs text-white/50"
              >Nombre visible</label
            ><input
              id="barber-profile-name"
              v-model="name"
              type="text"
              maxlength="120"
              autocomplete="name"
              class="mt-2 min-h-11 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm text-white focus:border-[#ffb700] focus:outline-none"
            />
            <button
              type="button"
              :disabled="name.trim() === savedName"
              @click="saveProfile"
              class="mt-3 min-h-11 rounded-lg border border-[#ffb700]/30 px-4 text-sm text-[#ffb700] disabled:opacity-35"
            >
              Guardar nombre
            </button>
            <div class="mt-7 border-t border-white/10 pt-5">
              <h4 class="text-sm">Fotografía del perfil</h4>
              <div
                class="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
              >
                <div
                  class="size-32 shrink-0 overflow-hidden rounded-xl border border-white/10"
                >
                  <img
                    v-if="photo"
                    :src="'data:image/jpeg;base64,' + photo"
                    alt="Vista previa de la nueva fotografía"
                    class="size-full object-cover"
                  /><BarberPortrait
                    v-else
                    :id="barber._id"
                    :name="savedName"
                    :revision="revision"
                    compact
                    class="h-full! w-full sm:h-full!"
                  />
                </div>
                <div class="min-w-0">
                  <label
                    class="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-white/20 focus-within:outline-2 focus-within:outline-[#ffb700] px-4 text-sm text-white/80 hover:border-white/40"
                    :class="{ 'pointer-events-none opacity-40': busy }"
                    >Elegir fotografía<input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      :disabled="busy"
                      @change="selectPhoto"
                      class="sr-only"
                  /></label>
                  <p class="mt-3 max-w-sm text-xs leading-5 text-white/45">
                    JPG, PNG o WebP, hasta 8 MB. Se recorta al centro en formato
                    cuadrado. Usa una foto donde el rostro quede centrado.
                  </p>
                </div>
              </div>
              <div v-if="photo" class="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  @click="savePhoto"
                  class="min-h-11 rounded-lg bg-[#ffb700] px-4 text-sm font-medium text-black"
                >
                  Guardar fotografía</button
                ><button
                  type="button"
                  @click="photo = ''"
                  class="min-h-11 px-2 text-sm text-white/55"
                >
                  Descartar fotografía
                </button>
              </div>
              <button
                v-else-if="revision && !removePhotoConfirm"
                type="button"
                @click="removePhotoConfirm = true"
                class="mt-3 min-h-11 text-xs text-red-300"
              >
                Retirar fotografía actual
              </button>
              <div
                v-if="removePhotoConfirm"
                class="mt-4 rounded-lg border border-red-400/25 p-4"
              >
                <p class="text-sm leading-6 text-white/65">
                  Se retirará la foto de este perfil y se mostrará el espacio
                  sin imagen.
                </p>
                <div class="mt-2 flex flex-wrap gap-4">
                  <button
                    type="button"
                    @click="removePhoto"
                    class="min-h-11 text-sm text-red-300"
                  >
                    Confirmar retirada</button
                  ><button
                    type="button"
                    @click="removePhotoConfirm = false"
                    class="min-h-11 text-sm text-white/60"
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </fieldset>
        </section>
      </div>

      <footer
        class="shrink-0 border-t border-white/10 bg-[#101010] px-4 py-4 sm:px-6"
      >
        <div
          v-if="discard"
          role="alert"
          class="mb-3 rounded-lg border border-amber-400/25 p-3"
        >
          <p class="text-sm leading-5 text-amber-200">
            Hay cambios sin guardar. ¿Quieres descartarlos y cerrar?
          </p>
          <div class="mt-2 flex flex-wrap gap-4">
            <button
              type="button"
              @click="emit('close')"
              class="min-h-10 text-sm text-red-300"
            >
              Descartar y cerrar</button
            ><button
              type="button"
              @click="discard = false"
              class="min-h-10 text-sm text-white/70"
            >
              Seguir editando
            </button>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="text-xs leading-5 text-white/40">
            {{
              busy
                ? "Procesando, espera un momento…"
                : (tab === "week" || tab === "blocks") &&
                    !loading &&
                    !scheduleError
                  ? workingDays.length +
                    " días habilitados · " +
                    weeklySlots +
                    " turnos semanales antes de reservas y ausencias"
                  : "Gestiona su perfil y su disponibilidad."
            }}
          </p>
          <div class="flex w-full gap-2 sm:w-auto">
            <button
              type="button"
              :disabled="busy"
              @click="requestClose"
              class="min-h-11 flex-1 rounded-lg border border-white/15 px-4 text-sm text-white/65 disabled:opacity-40 sm:flex-none"
            >
              Cerrar</button
            ><button
              v-if="tab === 'blocks' || tab === 'week' && (selfService || editingWeek)"
              type="button"
              :disabled="
                busy || loading || !!scheduleError || stale || !scheduleDirty
              "
              @click="saveSchedule(!!conflicts.length)"
              class="min-h-11 flex-1 rounded-lg bg-[#ffb700] px-4 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              {{
                busy
                  ? "Guardando…"
                  : conflicts.length
                    ? "Conservar citas y guardar"
                    : confirmNoWork
                      ? "Guardar sin días habilitados"
                      : "Guardar horario"
              }}
            </button>
          </div>
        </div>
      </footer>
    </div>
  </dialog>
</template>
<script setup lang="ts">
import { confirmDialog } from "@/lib/confirmDialog";
import HourSelect from "@/components/UI/HourSelect.vue";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import type { Barber } from "@/stores/barber";
import type { AdminAppointment } from "@/stores/admin";
import { useToast } from "@/lib/notifications";
import BarberAPI from "@/api/barberAPI";
import BarberPortrait from "@/components/UI/BarberPortrait.vue";
import WorkWeekSummary from "@/components/barber/WorkWeekSummary.vue";
import WorkWeekEditor from "@/components/barber/WorkWeekEditor.vue";
import { prepareBarberPhoto } from "@/helpers/barberPhoto";
import {
  blankSchedule,
  dailySlots,
  scheduleErrors,
  weekDays,
  isBarberSchedule,
  type BarberSchedule,
  type BlockedDay,
  type ScheduleDay,
} from "@/helpers/barberSchedule";
import {
  agendaClock,
  agendaDateLabel,
  appointmentDay,
  appointmentTiming,
} from "@/helpers/adminAgenda";
const toast = useToast();
const props = defineProps<{
  barber: Barber;
  appointments: AdminAppointment[];
  appointmentsError: boolean;
  selfService?: boolean;
}>();
const editorTabs = computed(() =>
  props.selfService
    ? [
        { id: "week", label: "Mi jornada" },
        { id: "blocks", label: "Mis ausencias" },
      ]
    : [
        { id: "overview", label: "Resumen" },
        { id: "week", label: "Jornada" },
        { id: "blocks", label: "Ausencias" },
        { id: "profile", label: "Perfil y foto" },
      ],
);
const emit = defineEmits<{ close: []; updated: [profile?: Partial<Barber>] }>();
const dialog = ref<HTMLDialogElement>(),
  tab = ref(props.selfService ? "week" : "overview"),
  loading = ref(false),
  busy = ref(false);
const error = ref(""),
  scheduleError = ref(""),
  discard = ref(false);
const original = ref<BarberSchedule | null>(null),
  exists = ref(false),
  baseline = ref("");
const days = ref<ScheduleDay[]>(blankSchedule()),
  blocks = ref<BlockedDay[]>([]);
const editingWeek = ref(false);
const errors = ref<Record<string, string>>({});
const stale = ref(false);
const name = ref(props.barber.name),
  savedName = ref(props.barber.name);
const photo = ref(""),
  revision = ref(props.barber.photoUpdatedAt),
  removePhotoConfirm = ref(false);
const conflicts = ref<
  { _id: string; date: string; time: string; client: string }[]
>([]);
const confirmNoWork = ref(false),
  tick = ref(Date.now());
let timer: ReturnType<typeof setInterval> | undefined,
  alive = true;
const now = computed(() => agendaClock(new Date(tick.value)));
const snapshot = () =>
  JSON.stringify({ days: days.value, blocks: blocks.value });
const scheduleDirty = computed(
  () => !!baseline.value && baseline.value !== snapshot(),
);
const dirty = computed(
  () =>
    scheduleDirty.value ||
    name.value.trim() !== savedName.value ||
    !!photo.value,
);
const workingDays = computed(() => days.value.filter((day) => day.isWorking));
const weeklySlots = computed(() =>
  days.value.reduce((sum, day) => sum + dailySlots(day).length, 0),
);
const ownAppointments = computed(() =>
  props.appointments.filter((item) => item.barber?._id === props.barber._id),
);
const future = computed(() =>
  ownAppointments.value
    .filter((item) => appointmentTiming(item, now.value) === "upcoming")
    .sort((a, b) =>
      (appointmentDay(a.date) + a.time).localeCompare(
        appointmentDay(b.date) + b.time,
      ),
    ),
);
const current = computed(() =>
  ownAppointments.value.find(
    (item) => appointmentTiming(item, now.value) === "current",
  ),
);
const monthStats = computed(() => {
  const items = ownAppointments.value.filter(
    (item) =>
      appointmentDay(item.date).slice(0, 7) === now.value.date.slice(0, 7),
  );
  return {
    count: items.length,
    amount: items.reduce(
      (sum, item) =>
        sum +
        (Number.isFinite(Number(item.totalAmount))
          ? Number(item.totalAmount)
          : 0),
      0,
    ),
  };
});
const money = (amount: number) =>
  new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(
    amount,
  );
const shortDate = (date: string) =>
  new Intl.DateTimeFormat("es-EC", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(appointmentDay(date) + "T12:00:00Z"));
const upcomingBlocks = computed(() =>
  blocks.value
    .filter((block) => block.date >= now.value.date)
    .sort((a, b) => a.date.localeCompare(b.date)),
);
function requestClose() {
  if (busy.value) return;
  if (dirty.value) {
    discard.value = true;
    return;
  }
  emit("close");
}
function clearFeedback() {
  error.value = "";
  conflicts.value = [];
  confirmNoWork.value = false;
}
async function loadSchedule() {
  if (busy.value || loading.value) return;
  loading.value = true;
  scheduleError.value = "";
  error.value = "";
  conflicts.value = [];
  try {
    let data: BarberSchedule | null;
    try {
      const response = await BarberAPI.getSchedule(props.barber._id);
      data = response.data;
      if (!isBarberSchedule(data)) throw new Error("Horario no válido");
    } catch (err: any) {
      if (err?.response?.status === 404) data = null;
      else throw err;
    }
    if (!alive) return;
    original.value = data;
    exists.value = !!data;
    days.value = blankSchedule(data);
    blocks.value = (data?.blockedDates ?? []).map((block) => ({
      date: String(block.date).slice(0, 10),
      reason: block.reason || "",
      partial: !!(block.startTime || block.endTime),
      startTime: block.startTime || "09:00",
      endTime: block.endTime || "13:00",
    }));
    baseline.value = snapshot();
    errors.value = {};
    stale.value = false;
  } catch (err: any) {
    if (alive)
      scheduleError.value =
        err?.response?.data?.msg ||
        "No pudimos consultar el horario. Reintenta antes de editar.";
  } finally {
    if (alive) loading.value = false;
  }
}
async function reloadStale() {
  if (
    await confirmDialog(
      "Se descartarán los cambios de jornada para cargar el horario actual. ¿Continuar?",
    )
  )
    void loadSchedule();
}
async function removeAbsence(index: number) {
  if (busy.value || loading.value || !blocks.value[index]) return;
  const item = blocks.value[index];
  const registered = original.value?.blockedDates.some(block =>
    String(block.date).slice(0, 10) === item.date &&
    (block.startTime || "") === (item.partial ? item.startTime : "") &&
    (block.endTime || "") === (item.partial ? item.endTime : ""));
  if (registered && !await confirmDialog("Se eliminará esta ausencia y se guardarán los cambios de disponibilidad pendientes. Las citas existentes se conservarán. ¿Continuar?")) return;
  blocks.value.splice(index, 1); clearFeedback();
  if (registered) await saveSchedule();
}
function addBlock() {
  clearFeedback();
  blocks.value.push({
    date: now.value.date,
    reason: "",
    partial: false,
    startTime: "09:00",
    endTime: "13:00",
  });
}
async function saveSchedule(keep = false) {
  if (busy.value || loading.value || scheduleError.value || stale.value) return;
  error.value = "";
  errors.value = scheduleErrors(days.value, blocks.value);
  if (Object.keys(errors.value).length) {
    conflicts.value = [];
    error.value = "Revisa los campos señalados antes de guardar.";
    tab.value = Object.keys(errors.value)[0]?.startsWith("day-")
      ? "week"
      : "blocks";
    await nextTick();
    dialog.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }
  if (!workingDays.value.length && !confirmNoWork.value) {
    confirmNoWork.value = true;
    return;
  }
  const payload = {
    schedule: days.value.map((day) => ({
      day: day.day,
      isWorking: day.isWorking,
      ...(day.isWorking
        ? { startTime: day.startTime, endTime: day.endTime, breaks: day.breaks }
        : { breaks: [] }),
    })),
    blockedDates: blocks.value.map((block) => ({
      date: block.date,
      reason: block.reason.trim() || undefined,
      ...(block.partial
        ? { startTime: block.startTime, endTime: block.endTime }
        : {}),
    })),
    ...(exists.value
      ? { version: original.value?.__v }
      : { barber: props.barber._id }),
    ...(keep
      ? {
          conflictPolicy: "keep",
          confirmConflicts: conflicts.value.map((item) => item._id),
        }
      : {}),
  };
  busy.value = true;
  try {
    const { data } = exists.value
      ? await BarberAPI.updateSchedule(props.barber._id, payload)
      : await BarberAPI.createSchedule(props.barber._id, payload);
    original.value = exists.value ? data.schedule : data;
    exists.value = true;
    editingWeek.value = false;
    baseline.value = snapshot();
    conflicts.value = [];
    confirmNoWork.value = false;
    toast.success(
      "Horario guardado. Las nuevas reservas utilizarán esta disponibilidad.",
    );
    emit("updated");
  } catch (err: any) {
    if (
      err?.response?.data?.code === "SCHEDULE_CONFLICT" &&
      Array.isArray(err.response.data.conflicts)
    ) {
      conflicts.value = err.response.data.conflicts;
      error.value =
        "Hay reservas que quedan fuera del nuevo horario. Revísalas antes de continuar.";
      await nextTick();
      dialog.value?.querySelector("[data-editor-body]")?.scrollTo({ top: 0 });
    } else {
      stale.value = err?.response?.data?.code === "STALE_SCHEDULE";
      error.value =
        err?.response?.data?.msg ||
        "No se pudo guardar el horario. Tus cambios siguen aquí.";
    }
  } finally {
    busy.value = false;
  }
}
async function selectPhoto(event: Event) {
  const input = event.target as HTMLInputElement,
    file = input.files?.[0];
  input.value = "";
  if (!file || busy.value) return;
  clearFeedback();
  busy.value = true;
  try {
    photo.value = await prepareBarberPhoto(file);
  } catch (err: any) {
    error.value = err.message || "No pudimos preparar la fotografía.";
  } finally {
    busy.value = false;
  }
}
async function savePhoto() {
  if (busy.value || !photo.value) return;
  busy.value = true;
  clearFeedback();
  try {
    const { data } = await BarberAPI.uploadPhoto(props.barber._id, photo.value);
    revision.value = data.photoUpdatedAt;
    photo.value = "";
    toast.success(
      "Fotografía actualizada en el perfil y en la selección de barberos.",
    );
    emit("updated", { photoUpdatedAt: data.photoUpdatedAt });
  } catch (err: any) {
    error.value =
      err?.response?.data?.msg ||
      "No pudimos guardar la fotografía. Puedes volver a intentarlo.";
  } finally {
    busy.value = false;
  }
}
async function removePhoto() {
  if (busy.value) return;
  busy.value = true;
  clearFeedback();
  try {
    await BarberAPI.removePhoto(props.barber._id);
    revision.value = undefined;
    photo.value = "";
    removePhotoConfirm.value = false;
    emit("updated", { photoUpdatedAt: undefined });
    toast.success("Fotografía retirada.");
  } catch (err: any) {
    error.value =
      err?.response?.data?.msg || "No pudimos retirar la fotografía.";
  } finally {
    busy.value = false;
  }
}
async function saveProfile() {
  if (busy.value) return;
  clearFeedback();
  if (!name.value.trim() || name.value.trim().length > 120) {
    error.value = "Escribe un nombre de entre 1 y 120 caracteres.";
    return;
  }
  busy.value = true;
  try {
    const { data } = await BarberAPI.updateProfile(
      props.barber._id,
      name.value.trim(),
    );
    name.value = savedName.value = data.name;
    emit("updated", { name: data.name });
    toast.success("Nombre actualizado.");
  } catch (err: any) {
    error.value =
      err?.response?.data?.msg || "No pudimos actualizar el nombre.";
  } finally {
    busy.value = false;
  }
}
onBeforeRouteLeave(
  async () =>
    !busy.value &&
    (!dirty.value ||
      await confirmDialog(
        "Hay cambios sin guardar en la ficha. ¿Quieres descartarlos y salir?",
      )),
);
onMounted(async () => {
  await nextTick();
  dialog.value?.showModal();
  void loadSchedule();
  timer = setInterval(() => {
    tick.value = Date.now();
  }, 30000);
});
onBeforeUnmount(() => {
  alive = false;
  if (timer) clearInterval(timer);
  dialog.value?.close();
});
</script>
