<!-- src/views/admin/Barbers.vue -->

<template>
  <div>
    <!-- HEADER -->
    <div class="mb-10">
      <p
        class="text-[9px] uppercase tracking-[0.35em] text-[#ffb700] font-medium mb-2"
      >
        Gestión
      </p>

      <div
        class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
      >
        <div>
          <h1
            class="text-3xl sm:text-4xl font-barber uppercase tracking-wide text-white"
          >
            Barberos
          </h1>

          <p class="text-white/35 text-sm mt-2">
            Administra el equipo, sus horarios y disponibilidad.
          </p>
        </div>

        <p class="text-white/25 text-[10px] uppercase tracking-[0.25em]">
          {{ filteredBarbers.length }} de {{ barberStore.barbers.length }}
          profesionales
        </p>
      </div>
    </div>

    <!-- LOADING -->
    <div
      v-if="barberStore.loading || adminStore.loading || loadingSchedules"
      class="flex items-center justify-center py-20"
    >
      <div
        class="w-7 h-7 rounded-full border-2 border-white/10 border-t-[#ffb700] animate-spin"
      ></div>
    </div>

    <!-- ERROR -->
    <div
      v-else-if="barberStore.error"
      class="py-12 text-center border border-dashed border-red-500/20 rounded-2xl"
    >
      <p class="text-red-400/70 text-sm">{{ barberStore.error }}</p>
      <button
        type="button"
        @click="reload"
        class="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-[#ffb700] transition"
      >
        Reintentar
      </button>
    </div>

    <template v-else>
      <!-- STATS -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div
          v-for="stat in statistics"
          :key="stat.label"
          class="bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-[#ffb700]/25 transition-all duration-300"
        >
          <p class="text-[9px] uppercase tracking-[0.25em] text-white/30 mb-3">
            {{ stat.label }}
          </p>

          <p class="text-2xl sm:text-3xl font-barber text-white">
            {{ stat.value }}
          </p>

          <p v-if="stat.detail" class="text-[10px] text-white/25 mt-2">
            {{ stat.detail }}
          </p>
        </div>
      </section>

      <!-- FILTROS -->
      <section
        class="bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 mb-8"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="md:col-span-2">
            <label
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 block mb-2"
            >
              Buscar
            </label>
            <input
              v-model="search"
              type="text"
              placeholder="Nombre o correo del barbero"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#ffb700]/50 transition"
            />
          </div>

          <div>
            <label
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 block mb-2"
            >
              Estado del horario
            </label>
            <select
              v-model="filterSchedule"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ffb700]/50 transition"
            >
              <option value="">Todos</option>
              <option value="with">Con horario</option>
              <option value="without">Sin horario</option>
            </select>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-white/5"
        >
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in quickOptions"
              :key="option.value"
              type="button"
              @click="quickFilter = option.value"
              :class="[
                'px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] rounded-full border transition-all duration-200',
                quickFilter === option.value
                  ? 'bg-[#ffb700]/10 border-[#ffb700]/40 text-[#ffb700]'
                  : 'border-white/10 text-white/40 hover:text-white hover:border-white/20',
              ]"
            >
              {{ option.label }}
            </button>
          </div>

          <button
            type="button"
            @click="clearFilters"
            class="text-[10px] uppercase tracking-[0.2em] text-white/35 hover:text-[#ffb700] transition self-start sm:self-auto"
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      <!-- LISTA -->
      <section>
        <!-- Sin barberos en la DB -->
        <div
          v-if="barberStore.barbers.length === 0"
          class="py-16 text-center border border-dashed border-white/10 rounded-2xl"
        >
          <p class="text-white/40 text-sm">
            No hay barberos registrados todavía.
          </p>
          <p class="text-white/20 text-xs mt-2">
            Los usuarios con rol "barber" aparecerán aquí.
          </p>
        </div>

        <!-- Sin resultados por filtros -->
        <div
          v-else-if="filteredBarbers.length === 0"
          class="py-16 text-center border border-dashed border-white/10 rounded-2xl"
        >
          <p class="text-white/25 text-sm">
            No hay barberos que coincidan con los filtros.
          </p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <article
            v-for="(barber, index) in filteredBarbers"
            :key="barber._id"
            class="group bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-[#ffb700]/25 transition-all duration-300"
          >
            <!-- IMAGEN -->
            <div class="relative aspect-[4/3] overflow-hidden">
              <img
                :src="`/img/barbers/barber${(index % 4) + 1}.jpg`"
                :alt="barber.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div
                class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
              ></div>

              <!-- BADGE HORARIO -->
              <div class="absolute top-3 left-3">
                <span
                  :class="[
                    'text-[8px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border backdrop-blur-sm',
                    hasSchedule(barber._id)
                      ? 'bg-[#ffb700]/15 border-[#ffb700]/40 text-[#ffb700]'
                      : 'bg-white/5 border-white/10 text-white/50',
                  ]"
                >
                  {{
                    hasSchedule(barber._id) ? "Horario activo" : "Sin horario"
                  }}
                </span>
              </div>

              <!-- NOMBRE ENCIMA -->
              <div class="absolute inset-x-0 bottom-0 p-4">
                <p
                  class="text-[8px] uppercase tracking-[0.3em] text-[#ffb700] mb-1"
                >
                  Profesional
                </p>
                <h3
                  class="font-barber text-lg text-white leading-tight truncate"
                >
                  {{ barber.name }}
                </h3>
                <p class="text-white/40 text-[10px] truncate mt-0.5">
                  {{ barber.email }}
                </p>
              </div>
            </div>

            <!-- INFO -->
            <div class="p-4 space-y-3">
              <div class="grid grid-cols-2 gap-3 py-3 border-y border-white/5">
                <div>
                  <p
                    class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
                  >
                    Días laborables
                  </p>
                  <p class="text-white/75 text-xs">
                    {{ workingDaysOf(barber._id) }} de 7
                  </p>
                </div>

                <div>
                  <p
                    class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
                  >
                    Citas próximas
                  </p>
                  <p class="text-[#ffb700] text-xs font-medium">
                    {{ upcomingCountOf(barber._id) }}
                  </p>
                </div>
              </div>

              <!-- ACCIONES -->
              <div class="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  @click="openModal('detail', barber)"
                  class="flex-1 px-3 py-2 text-[9px] uppercase tracking-[0.2em] border border-white/10 text-white/55 hover:text-white hover:border-white/25 rounded-lg transition-all duration-200"
                >
                  Ver
                </button>

                <button
                  type="button"
                  @click="openModal('schedule', barber)"
                  class="flex-1 px-3 py-2 text-[9px] uppercase tracking-[0.2em] border border-[#ffb700]/20 text-[#ffb700]/80 hover:text-[#ffb700] hover:border-[#ffb700]/50 hover:bg-[#ffb700]/5 rounded-lg transition-all duration-200"
                >
                  Horario
                </button>

                <button
                  type="button"
                  @click="notImplemented('Editar datos')"
                  class="px-3 py-2 text-[9px] uppercase tracking-[0.2em] border border-white/10 text-white/55 hover:text-white hover:border-white/25 rounded-lg transition-all duration-200"
                >
                  ✎
                </button>

                <button
                  type="button"
                  @click="notImplemented('Quitar de barberos')"
                  class="px-3 py-2 text-[9px] uppercase tracking-[0.2em] border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/5 rounded-lg transition-all duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </template>

    <!-- ============ MODAL DETALLE ============ -->
    <div
      v-if="activeModal === 'detail' && selectedBarber"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-lg bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-start justify-between mb-6">
          <div>
            <p
              class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
            >
              Perfil del barbero
            </p>
            <h2 class="text-xl font-barber uppercase text-white">
              {{ selectedBarber.name }}
            </h2>
          </div>

          <button
            type="button"
            @click="closeModal"
            class="text-white/35 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4 text-sm">
          <div class="flex justify-between border-b border-white/5 pb-3">
            <span class="text-white/35 text-xs">Correo</span>
            <span class="text-white/80">{{ selectedBarber.email }}</span>
          </div>

          <div class="flex justify-between border-b border-white/5 pb-3">
            <span class="text-white/35 text-xs">Rol</span>
            <span class="text-white/80">Barbero</span>
          </div>

          <div class="flex justify-between border-b border-white/5 pb-3">
            <span class="text-white/35 text-xs">Estado del horario</span>
            <span
              :class="
                hasSchedule(selectedBarber._id)
                  ? 'text-[#ffb700]'
                  : 'text-white/50'
              "
            >
              {{
                hasSchedule(selectedBarber._id)
                  ? "Configurado"
                  : "Sin configurar"
              }}
            </span>
          </div>

          <div class="flex justify-between border-b border-white/5 pb-3">
            <span class="text-white/35 text-xs">Citas próximas</span>
            <span class="text-white/80">
              {{ upcomingCountOf(selectedBarber._id) }}
            </span>
          </div>

          <div class="pt-2">
            <p class="text-white/35 text-xs mb-3">Días laborables</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="day in weekDays"
                :key="day.value"
                :class="[
                  'text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border',
                  workingDayIndexesOf(selectedBarber._id).includes(day.value)
                    ? 'bg-[#ffb700]/10 border-[#ffb700]/30 text-[#ffb700]'
                    : 'bg-white/[0.02] border-white/5 text-white/25 line-through',
                ]"
              >
                {{ day.short }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-white/10 text-white/60 hover:text-white hover:border-white/25 text-[10px] uppercase tracking-[0.2em] rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- ============ MODAL HORARIO ============ -->
    <div
      v-if="activeModal === 'schedule' && selectedBarber"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-3xl bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-start justify-between mb-6">
          <div>
            <p
              class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
            >
              Horario semanal
            </p>
            <h2 class="text-xl font-barber uppercase text-white">
              {{ selectedBarber.name }}
            </h2>
            <p class="text-white/30 text-[10px] mt-1">
              Define días laborables, horas y pausas.
            </p>
          </div>

          <button
            type="button"
            @click="closeModal"
            class="text-white/35 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <!-- LOADING DEL SCHEDULE -->
        <div
          v-if="loadingScheduleModal"
          class="py-12 flex flex-col items-center justify-center"
        >
          <div
            class="w-7 h-7 border-2 border-white/10 border-t-[#ffb700] rounded-full animate-spin"
          ></div>
          <p class="text-white/30 text-[9px] uppercase tracking-[0.3em] mt-4">
            Cargando horario...
          </p>
        </div>

        <template v-else>
          <!-- DÍAS -->
          <div class="space-y-3 mb-6">
            <div
              v-for="(day, idx) in editSchedule"
              :key="day.day"
              class="bg-white/[0.02] border border-white/5 rounded-xl p-4"
            >
              <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <div class="flex items-center gap-3 sm:w-40 shrink-0">
                  <button
                    type="button"
                    @click="day.isWorking = !day.isWorking"
                    :class="[
                      'relative  w-10 h-5 rounded-full transition-colors duration-200 shrink-0',
                      day.isWorking ? 'bg-[#ffb700]' : 'bg-white/10',
                    ]"
                  >
                    <span
                      :class="[
                        'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200',
                        day.isWorking ? 'translate-x-0.5' : '-translate-x-4.5',
                      ]"
                    ></span>
                  </button>

                  <span
                    class="text-xs uppercase tracking-[0.15em] font-medium"
                    :class="day.isWorking ? 'text-white/80' : 'text-white/30'"
                  >
                    {{ weekDays[idx]?.long }}
                  </span>
                </div>

                <div
                  v-if="day.isWorking"
                  class="flex-1 flex flex-wrap items-center gap-3"
                >
                  <div class="flex items-center gap-2">
                    <label class="text-[8px] uppercase text-white/30">De</label>
                    <input
                      v-model="day.startTime"
                      type="time"
                      class="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#ffb700]/50"
                    />
                  </div>

                  <div class="flex items-center gap-2">
                    <label class="text-[8px] uppercase text-white/30">a</label>
                    <input
                      v-model="day.endTime"
                      type="time"
                      class="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#ffb700]/50"
                    />
                  </div>
                </div>

                <span
                  v-else
                  class="flex-1 text-white/20 text-[10px] uppercase tracking-[0.2em]"
                >
                  Día libre
                </span>
              </div>

              <!-- PAUSAS -->
              <div
                v-if="day.isWorking"
                class="mt-3 pt-3 border-t border-white/5 pl-0 sm:pl-[172px]"
              >
                <div class="flex items-center justify-between mb-2">
                  <p
                    class="text-[8px] uppercase tracking-[0.25em] text-white/30"
                  >
                    Pausas ({{ day.breaks.length }})
                  </p>

                  <button
                    type="button"
                    @click="addBreak(day)"
                    class="text-[9px] uppercase tracking-[0.2em] text-[#ffb700]/80 hover:text-[#ffb700] transition"
                  >
                    + Añadir
                  </button>
                </div>

                <div v-if="day.breaks.length" class="space-y-2">
                  <div
                    v-for="(pause, bIdx) in day.breaks"
                    :key="bIdx"
                    class="flex flex-wrap items-center gap-2 bg-black/30 border border-white/5 rounded-lg px-3 py-2"
                  >
                    <input
                      v-model="pause.startTime"
                      type="time"
                      class="bg-transparent border-0 text-xs text-white/80 focus:outline-none"
                    />
                    <span class="text-white/30 text-[10px]">a</span>
                    <input
                      v-model="pause.endTime"
                      type="time"
                      class="bg-transparent border-0 text-xs text-white/80 focus:outline-none"
                    />
                    <button
                      type="button"
                      @click="day.breaks.splice(bIdx, 1)"
                      class="ml-auto text-red-400/60 hover:text-red-400 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <p v-else class="text-white/20 text-[10px]">
                  Sin pausas configuradas.
                </p>
              </div>
            </div>
          </div>

          <!-- DÍAS BLOQUEADOS -->
          <div class="border-t border-white/5 pt-5">
            <div class="flex items-center justify-between mb-3">
              <div>
                <p
                  class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium"
                >
                  Días bloqueados
                </p>
                <p class="text-white/30 text-[10px] mt-1">
                  Fechas puntuales donde el barbero no trabaja.
                </p>
              </div>

              <button
                type="button"
                @click="addBlockedDate"
                class="text-[9px] uppercase tracking-[0.2em] text-[#ffb700]/80 hover:text-[#ffb700] transition"
              >
                + Añadir
              </button>
            </div>

            <div v-if="editBlockedDates.length" class="space-y-3">
              <div
                v-for="(block, idx) in editBlockedDates"
                :key="idx"
                class="bg-black/30 border border-white/5 rounded-lg px-3 py-3 space-y-2"
              >
                <div class="flex flex-wrap items-center gap-3">
                  <input
                    v-model="block.date"
                    type="date"
                    class="bg-transparent border-0 text-xs text-white/80 focus:outline-none"
                  />

                  <input
                    v-model="block.reason"
                    type="text"
                    placeholder="Motivo (opcional)"
                    class="flex-1 min-w-[150px] bg-transparent border-0 text-xs text-white/60 placeholder:text-white/25 focus:outline-none"
                  />

                  <button
                    type="button"
                    @click="editBlockedDates.splice(idx, 1)"
                    class="text-red-400/60 hover:text-red-400 text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div class="flex flex-wrap items-center gap-3 pl-0 sm:pl-2">
                  <label
                    class="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/35 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      v-model="block.partial"
                      class="accent-[#ffb700]"
                    />
                    Bloquear solo unas horas
                  </label>

                  <template v-if="block.partial">
                    <input
                      v-model="block.startTime"
                      type="time"
                      class="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#ffb700]/50"
                    />
                    <span class="text-white/30 text-[10px]">a</span>
                    <input
                      v-model="block.endTime"
                      type="time"
                      class="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#ffb700]/50"
                    />
                  </template>
                </div>
              </div>
            </div>

            <p v-else class="text-white/20 text-[10px]">Sin días bloqueados.</p>
          </div>
        </template>

        <!-- ACCIONES -->
        <div
          class="flex flex-col sm:flex-row justify-end gap-2 mt-6 pt-5 border-t border-white/5"
        >
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-white/10 text-white/55 hover:text-white hover:border-white/25 text-[10px] uppercase tracking-[0.2em] rounded-lg transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            :disabled="savingSchedule"
            @click="handleSaveSchedule"
            class="px-4 py-2 bg-[#ffb700] text-black text-[10px] uppercase tracking-[0.2em] font-medium rounded-lg hover:bg-[#ffb700]/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {{ savingSchedule ? "Guardando..." : "Guardar horario" }}
          </button>
        </div>
      </div>
    </div>

    <!-- ============ MODAL CITAS AFECTADAS ============ -->
    <div
      v-if="activeModal === 'affected'"
      class="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
      @click.self="closeAffectedModal"
    >
      <div
        class="w-full max-w-xl bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-start justify-between mb-6">
          <div>
            <p
              class="text-[9px] uppercase tracking-[0.3em] text-amber-400/80 font-medium mb-1"
            >
              Aviso
            </p>
            <h2 class="text-xl font-barber uppercase text-white">
              Citas afectadas por el cambio
            </h2>
            <p class="text-white/40 text-xs mt-2 leading-relaxed">
              El nuevo horario deja
              <span class="text-amber-400">
                {{ affectedAppointments.length }}
                {{ affectedAppointments.length === 1 ? "cita" : "citas" }}
              </span>
              fuera del horario laboral.
            </p>
          </div>

          <button
            type="button"
            @click="closeAffectedModal"
            class="text-white/35 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <!-- LISTA -->
        <div class="space-y-2 mb-6 max-h-64 overflow-y-auto pr-1">
          <div
            v-for="cita in affectedAppointments"
            :key="cita._id"
            class="bg-white/[0.02] border border-white/5 rounded-lg px-4 py-3"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-white/85 text-xs truncate">
                  {{ cita.user?.name || "Cliente" }}
                </p>
                <p class="text-white/35 text-[10px] truncate mt-0.5">
                  {{ cita.user?.email || "" }}
                </p>
              </div>

              <div class="text-right shrink-0">
                <p class="text-[#ffb700] text-xs">{{ cita.time }}</p>
                <p class="text-white/35 text-[10px] mt-0.5">
                  {{ formatDateShort(cita.date) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p class="text-white/30 text-[11px] leading-relaxed mb-6">
          Puedes mantener las citas ya reservadas (no se notificará a nadie) o
          cancelarlas todas. Si las cancelas, los clientes y el barbero
          recibirán un correo de cancelación.
        </p>

        <div
          class="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-white/5"
        >
          <button
            type="button"
            @click="confirmSaveSchedule(true)"
            :disabled="savingSchedule"
            class="px-4 py-2 border border-white/10 text-white/70 hover:text-white hover:border-white/25 text-[10px] uppercase tracking-[0.2em] rounded-lg transition disabled:opacity-40"
          >
            Mantener citas
          </button>

          <button
            type="button"
            @click="confirmSaveSchedule(false)"
            :disabled="savingSchedule"
            class="px-4 py-2 bg-red-500/90 text-white text-[10px] uppercase tracking-[0.2em] font-medium rounded-lg hover:bg-red-500 transition disabled:opacity-40"
          >
            {{ savingSchedule ? "Procesando..." : "Cancelar citas y guardar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { useBarberStore } from "@/stores/barber";
import { useAdminStore } from "@/stores/admin";
import BarberAPI from "@/api/barberAPI";

import type { Barber } from "@/stores/barber";
import { useToast } from "vue-toast-notification";

const barberStore = useBarberStore();
const adminStore = useAdminStore();

const toast = useToast();

/* =========================================================
   DÍAS DE LA SEMANA
   ========================================================= */
const weekDays = [
  { value: 1, short: "Lun", long: "Lunes" },
  { value: 2, short: "Mar", long: "Martes" },
  { value: 3, short: "Mié", long: "Miércoles" },
  { value: 4, short: "Jue", long: "Jueves" },
  { value: 5, short: "Vie", long: "Viernes" },
  { value: 6, short: "Sáb", long: "Sábado" },
  { value: 0, short: "Dom", long: "Domingo" },
];

/* =========================================================
   TIPOS LOCALES
   ========================================================= */
interface LocalBreak {
  startTime: string;
  endTime: string;
}

interface LocalScheduleDay {
  day: number;
  isWorking: boolean;
  startTime: string;
  endTime: string;
  breaks: LocalBreak[];
}

interface LocalBlockedDate {
  date: string;
  reason: string;
  partial: boolean;
  startTime: string;
  endTime: string;
}

interface PendingSchedulePayload {
  barberId: string;
  payload: any;
  wasUpdate: boolean;
}

/* =========================================================
   HELPERS DE FECHA / TIEMPO
   ========================================================= */
const toKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const timeToMinutes = (t: string): number => {
  const parts = t.split(":").map(Number);
  const h = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  return h * 60 + m;
};

const formatDateShort = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const todayKey = toKey(new Date());

const getAppointmentDateKey = (date: string) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return toKey(parsed);
};

/* =========================================================
   SCHEDULES (mapa local)
   ========================================================= */
const schedulesMap = ref<Record<string, any | null>>({});
const loadingSchedules = ref(false);

const hasSchedule = (barberId: string) => Boolean(schedulesMap.value[barberId]);

const workingDayIndexesOf = (barberId: string): number[] => {
  const schedule = schedulesMap.value[barberId];
  if (!schedule?.schedule) return [];
  return schedule.schedule
    .filter((d: any) => d.isWorking)
    .map((d: any) => d.day);
};

const workingDaysOf = (barberId: string) =>
  workingDayIndexesOf(barberId).length;

/* =========================================================
   CITAS PRÓXIMAS POR BARBERO
   ========================================================= */
const upcomingCountOf = (barberId: string) => {
  return adminStore.appointments.filter((a) => {
    if (a.barber?._id !== barberId) return false;
    const key = getAppointmentDateKey(a.date);
    return key >= todayKey;
  }).length;
};

/* =========================================================
   FILTROS
   ========================================================= */
const search = ref("");
const filterSchedule = ref<"" | "with" | "without">("");
const quickFilter = ref<"todos" | "con" | "sin">("todos");

const quickOptions = [
  { value: "todos" as const, label: "Todos" },
  { value: "con" as const, label: "Con horario" },
  { value: "sin" as const, label: "Sin horario" },
];

const clearFilters = () => {
  search.value = "";
  filterSchedule.value = "";
  quickFilter.value = "todos";
};

/* =========================================================
   COMPUTED
   ========================================================= */
const filteredBarbers = computed(() => {
  const text = search.value.trim().toLowerCase();

  return barberStore.barbers.filter((barber) => {
    if (text) {
      const name = barber.name.toLowerCase();
      const email = barber.email.toLowerCase();
      if (!name.includes(text) && !email.includes(text)) return false;
    }

    const has = hasSchedule(barber._id);

    if (filterSchedule.value === "with" && !has) return false;
    if (filterSchedule.value === "without" && has) return false;

    if (quickFilter.value === "con" && !has) return false;
    if (quickFilter.value === "sin" && has) return false;

    return true;
  });
});

const statistics = computed(() => {
  const total = barberStore.barbers.length;
  const conHorario = barberStore.barbers.filter((b) =>
    hasSchedule(b._id),
  ).length;
  const sinHorario = total - conHorario;
  const citasTotales = barberStore.barbers.reduce(
    (sum, b) => sum + upcomingCountOf(b._id),
    0,
  );

  return [
    { label: "Total", value: total, detail: "Barberos registrados" },
    { label: "Con horario", value: conHorario, detail: "Configurados" },
    { label: "Sin horario", value: sinHorario, detail: "Pendientes" },
    { label: "Citas", value: citasTotales, detail: "Próximas asignadas" },
  ];
});

/* =========================================================
   MODALES
   ========================================================= */
const activeModal = ref<null | "detail" | "schedule" | "affected">(null);
const selectedBarber = ref<Barber | null>(null);

const editSchedule = ref<LocalScheduleDay[]>([]);
const editBlockedDates = ref<LocalBlockedDate[]>([]);

const loadingScheduleModal = ref(false);
const savingSchedule = ref(false);

/* =========================================================
   CITAS AFECTADAS
   ========================================================= */
const affectedAppointments = ref<any[]>([]);
let pendingSave: PendingSchedulePayload | null = null;

const isAppointmentAffected = (
  appointment: any,
  newSchedule: LocalScheduleDay[],
  newBlockedDates: LocalBlockedDate[],
): boolean => {
  const date = new Date(appointment.date);
  if (Number.isNaN(date.getTime())) return false;

  const dayIndex = date.getDay();
  const dayKey = toKey(date);

  const proposedDay = newSchedule.find((d) => d.day === dayIndex);

  // 1) Día no laborable en el nuevo horario
  if (!proposedDay || !proposedDay.isWorking) return true;

  // 2) Hora fuera del rango
  const timeMin = timeToMinutes(appointment.time);
  const startMin = timeToMinutes(proposedDay.startTime || "00:00");
  const endMin = timeToMinutes(proposedDay.endTime || "00:00");

  if (timeMin < startMin || timeMin >= endMin) return true;

  // 3) Hora dentro de una pausa
  for (const b of proposedDay.breaks) {
    const bs = timeToMinutes(b.startTime);
    const be = timeToMinutes(b.endTime);
    if (timeMin >= bs && timeMin < be) return true;
  }

  // 4) Fecha bloqueada
  for (const b of newBlockedDates) {
    if (!b.date) continue;
    if (b.date !== dayKey) continue;

    if (!b.partial) return true;

    if (b.startTime && b.endTime) {
      const bs = timeToMinutes(b.startTime);
      const be = timeToMinutes(b.endTime);
      if (timeMin >= bs && timeMin < be) return true;
    }
  }

  return false;
};

/* =========================================================
   MODALES: ABRIR / CERRAR
   ========================================================= */
const openModal = async (modal: "detail" | "schedule", barber: Barber) => {
  selectedBarber.value = barber;
  activeModal.value = modal;

  if (modal === "schedule") {
    await loadScheduleIntoForm(barber._id);
  }
};

const closeModal = () => {
  activeModal.value = null;
  selectedBarber.value = null;
  editSchedule.value = [];
  editBlockedDates.value = [];
  affectedAppointments.value = [];
  pendingSave = null;
};

/* =========================================================
   CARGAR HORARIO EN EL FORMULARIO
   ========================================================= */
const loadScheduleIntoForm = async (barberId: string) => {
  loadingScheduleModal.value = true;

  let schedule = schedulesMap.value[barberId];

  if (schedule === undefined) {
    try {
      const { data } = await BarberAPI.getSchedule(barberId);
      schedule = data;
      schedulesMap.value[barberId] = data;
    } catch {
      schedule = null;
      schedulesMap.value[barberId] = null;
    }
  }

  const baseSchedule: LocalScheduleDay[] = weekDays.map((d) => {
    const existing = schedule?.schedule?.find((s: any) => s.day === d.value);

    return {
      day: d.value,
      isWorking: existing?.isWorking ?? false,
      startTime: existing?.startTime || "09:00",
      endTime: existing?.endTime || "19:00",
      breaks:
        existing?.breaks?.map((b: any) => ({
          startTime: b.startTime || "13:00",
          endTime: b.endTime || "14:00",
        })) ?? [],
    };
  });

  editSchedule.value = baseSchedule;

  editBlockedDates.value = (schedule?.blockedDates || []).map((b: any) => {
    const raw = b.date;
    const isoDate =
      typeof raw === "string"
        ? raw.slice(0, 10)
        : !Number.isNaN(new Date(raw).getTime())
          ? toKey(new Date(raw))
          : "";
    const hasHours = Boolean(b.startTime || b.endTime);

    return {
      date: isoDate,
      reason: b.reason || "",
      partial: hasHours,
      startTime: b.startTime || "09:00",
      endTime: b.endTime || "13:00",
    };
  });

  loadingScheduleModal.value = false;
};

/* =========================================================
   GUARDAR HORARIO (con modal de citas afectadas)
   ========================================================= */
const handleSaveSchedule = async () => {
  if (!selectedBarber.value) return;

  // Validar días laborables
  for (const day of editSchedule.value) {
    if (day.isWorking && (!day.startTime || !day.endTime)) {
      toast.open({
        message: "Completa las horas de los días laborables",
        type: "warning",
      });
      return;
    }
  }

  // Construir payload
  const payload = {
    schedule: editSchedule.value.map((d) => ({
      day: d.day,
      isWorking: d.isWorking,
      ...(d.isWorking
        ? {
            startTime: d.startTime,
            endTime: d.endTime,
            breaks: d.breaks.map((b) => ({
              startTime: b.startTime,
              endTime: b.endTime,
            })),
          }
        : { breaks: [] }),
    })),
    blockedDates: editBlockedDates.value
      .filter((b) => b.date)
      .map((b) => ({
        date: b.date,
        reason: b.reason || undefined,
        ...(b.partial ? { startTime: b.startTime, endTime: b.endTime } : {}),
      })),
  };

  // Calcular citas afectadas
  const barberId = selectedBarber.value._id;
  const barberAppointments = adminStore.appointments.filter(
    (a) => a.barber?._id === barberId,
  );

  const affected = barberAppointments.filter((a) =>
    isAppointmentAffected(a, editSchedule.value, editBlockedDates.value),
  );

  pendingSave = {
    barberId,
    payload,
    wasUpdate: hasSchedule(barberId),
  };

  // Si no hay afectadas, guardar directo
  if (affected.length === 0) {
    await persistSchedule(false);
    return;
  }

  // Si hay afectadas, mostrar modal
  affectedAppointments.value = affected;
  activeModal.value = "affected";
};

/* =========================================================
   PERSISTIR HORARIO
   ========================================================= */
const persistSchedule = async (cancelAffected: boolean) => {
  if (!pendingSave) return;

  savingSchedule.value = true;

  try {
    // 1. Guardar o crear horario
    if (pendingSave.wasUpdate) {
      await BarberAPI.updateSchedule(pendingSave.barberId, pendingSave.payload);
    } else {
      await BarberAPI.createSchedule(pendingSave.barberId, {
        barber: pendingSave.barberId,
        ...pendingSave.payload,
      });
    }

    // 2. Cancelar citas afectadas si el admin lo pidió
    if (cancelAffected) {
      for (const cita of affectedAppointments.value) {
        await adminStore.deleteAppointment(cita._id, toast);
      }
    }

    // 3. Refrescar schedule local
    const fresh = await BarberAPI.getSchedule(pendingSave.barberId);
    schedulesMap.value[pendingSave.barberId] = fresh.data;

    toast.open({
      message: pendingSave.wasUpdate
        ? "Horario actualizado correctamente"
        : "Horario creado correctamente",
      type: "success",
    });

    // 4. Limpiar
    affectedAppointments.value = [];
    pendingSave = null;
    activeModal.value = null;
    selectedBarber.value = null;
    editSchedule.value = [];
    editBlockedDates.value = [];
  } catch (err: any) {
    toast.open({
      message: err?.response?.data?.msg || "Error al guardar el horario",
      type: "error",
    });
  } finally {
    savingSchedule.value = false;
  }
};

const confirmSaveSchedule = async (keepAppointments: boolean) => {
  await persistSchedule(!keepAppointments);
};

const closeAffectedModal = () => {
  affectedAppointments.value = [];
  pendingSave = null;
  // Volver al modal de horario para que el admin pueda ajustar
  activeModal.value = "schedule";
};

/* =========================================================
   HELPERS DEL FORMULARIO
   ========================================================= */
const addBreak = (day: LocalScheduleDay) => {
  day.breaks.push({ startTime: "13:00", endTime: "14:00" });
};

const addBlockedDate = () => {
  editBlockedDates.value.push({
    date: "",
    reason: "",
    partial: false,
    startTime: "09:00",
    endTime: "13:00",
  });
};

/* =========================================================
   NO IMPLEMENTADO (requiere backend)
   ========================================================= */
const notImplemented = (name: string) => {
  toast.open({
    message: `${name}: requiere endpoint en el backend.`,
    type: "info",
  });
};

/* =========================================================
   CARGA INICIAL
   ========================================================= */
const loadSchedules = async () => {
  if (barberStore.barbers.length === 0) return;

  loadingSchedules.value = true;

  try {
    const results = await Promise.all(
      barberStore.barbers.map(async (b) => {
        try {
          const { data } = await BarberAPI.getSchedule(b._id);
          return { id: b._id, schedule: data };
        } catch {
          return { id: b._id, schedule: null };
        }
      }),
    );

    const map: Record<string, any | null> = {};
    for (const r of results) {
      map[r.id] = r.schedule;
    }
    schedulesMap.value = map;
  } finally {
    loadingSchedules.value = false;
  }
};

const reload = async () => {
  await barberStore.getBarbers();
  await adminStore.getAllAppointments();
  await loadSchedules();
};

onMounted(async () => {
  await Promise.all([
    barberStore.barbers.length ? Promise.resolve() : barberStore.getBarbers(),
    adminStore.appointments.length
      ? Promise.resolve()
      : adminStore.getAllAppointments(),
  ]);

  await loadSchedules();
});
</script>

<style scoped></style>
