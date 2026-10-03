<template>
  <div class="min-h-screen text-white">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10">
        <p
          class="text-[9px] uppercase tracking-[0.35em] text-[#ffb700] font-medium mb-2"
        >
          Administración
        </p>

        <div
          class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 "
        >
          <div> 
            <div class="flex items-center justify-between gap-3">
              <h1
                class="text-3xl sm:text-4xl font-barber uppercase tracking-wide text-white"
              >
                Panel general
              </h1>

              <!-- BOTÓN DE GUÍA (icono + texto) -->
              <button
                type="button"
                @click="showGuide = true"
                class="group flex items-center gap-2.5 px-3 py-2 rounded-full border border-white/15 hover:border-[#ffb700]/60 transition-all duration-300 hover:bg-[#ffb700]/10"
                aria-label="Ver guía de administración"
              >
                <span
                  class="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                >
                  <svg
                    class="w-4 h-4 text-white/40 group-hover:text-[#ffb700] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    viewBox="0 0 24 24"
                  >
                    <!-- Icono bombilla -->
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </span>

                <span
                  class="text-[10px] uppercase tracking-[0.2em] text-white/50 group-hover:text-[#ffb700] transition-colors font-medium hidden sm:block"
                >
                  ¿Qué puedo hacer como admin?
                </span>
              </button>
            </div>

            <p class="text-white/35 text-sm mt-2">
              Información general y actividad actual del salón.
            </p>
          </div>

          <p v-if="userStore.user" class="text-white/40 text-xs">
            {{ userStore.user.name }}
          </p>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div
          class="w-7 h-7 rounded-full border-2 border-white/10 border-t-[#ffb700] animate-spin"
        ></div>
      </div>

      <template v-else>
        <!-- ... todo el contenido igual ... -->
        <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div
            v-for="stat in statistics"
            :key="stat.label"
            class="bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-[#ffb700]/25 transition-all duration-300"
          >
            <p
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 mb-3"
            >
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

        <section
          class="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-5 mb-8"
        >
          <div
            class="bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6"
          >
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <p
                  class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
                >
                  Agenda
                </p>

                <h2 class="text-xl font-barber uppercase text-white">
                  Próximas reservas
                </h2>
              </div>

              <span class="text-[10px] text-white/25">
                {{ upcomingAppointments.length }}
                {{ upcomingAppointments.length === 1 ? "reserva" : "reservas" }}
              </span>
            </div>

            <div
              v-if="upcomingAppointments.length"
              class="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div
                v-for="appointment in upcomingAppointments"
                :key="appointment._id"
                class="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all duration-300"
              >
                <div
                  class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <div
                      class="w-9 h-9 rounded-full bg-[#ffb700]/10 border border-[#ffb700]/20 flex items-center justify-center shrink-0"
                    >
                      <span class="text-[#ffb700] text-xs font-medium">
                        {{ getClientInitial(appointment) }}
                      </span>
                    </div>

                    <div class="min-w-0">
                      <p class="text-white/80 text-sm font-barber truncate">
                        {{ appointment.user?.name || "Cliente" }}
                      </p>

                      <p class="text-white/30 text-[10px] truncate">
                        {{ appointment.user?.email || "Sin correo" }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-5 sm:justify-end">
                    <div>
                      <p
                        class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
                      >
                        Fecha
                      </p>

                      <p class="text-white/60 text-xs">
                        {{ displayDate(appointment.date) }}
                      </p>
                    </div>

                    <div>
                      <p
                        class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
                      >
                        Hora
                      </p>

                      <p class="text-[#ffb700] text-xs font-medium">
                        {{ appointment.time }}
                      </p>
                    </div>

                    <div v-if="appointment.barber" class="hidden sm:block">
                      <p
                        class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
                      >
                        Barbero
                      </p>

                      <p class="text-white/60 text-xs">
                        {{ appointment.barber.name }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-white/5"
                >
                  <p class="text-[10px] text-white/30 truncate">
                    {{
                      appointment.services?.length
                        ? appointment.services
                            .map((service) => service.name)
                            .join(", ")
                        : "Sin servicios"
                    }}
                  </p>

                  <p class="text-[#ffb700] text-xs font-barber shrink-0">
                    {{ formatCurrency(appointment.totalAmount) }}
                  </p>
                </div>
              </div>
            </div>

            <div
              v-else
              class="py-12 text-center border border-dashed border-white/5 rounded-xl"
            >
              <p class="text-white/25 text-sm">No hay reservas próximas.</p>
            </div>
          </div>

          <div
            class="bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6"
          >
            <div class="mb-6">
              <p
                class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
              >
                Hoy
              </p>

              <h2 class="text-xl font-barber uppercase text-white">
                Resumen del día
              </h2>
            </div>

            <div class="space-y-4">
              <div
                class="flex items-center justify-between py-3 border-b border-white/5"
              >
                <span class="text-white/40 text-xs"> Reservas </span>

                <span class="text-white text-sm font-barber">
                  {{ todayAppointments }}
                </span>
              </div>

              <div
                class="flex items-center justify-between py-3 border-b border-white/5"
              >
                <span class="text-white/40 text-xs"> Barberos activos </span>

                <span class="text-white text-sm font-barber">
                  {{ totalBarbers }}
                </span>
              </div>

              <div
                class="flex items-center justify-between py-3 border-b border-white/5"
              >
                <span class="text-white/40 text-xs">
                  Clientes registrados
                </span>

                <span class="text-white text-sm font-barber">
                  {{ totalClients }}
                </span>
              </div>

              <div class="flex items-center justify-between pt-3">
                <span class="text-white/40 text-xs"> Ingresos estimados </span>

                <span class="text-[#ffb700] text-sm font-barber">
                  {{ formatCurrency(estimatedIncome) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <div class="mb-5">
            <p
              class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
            >
              Gestión
            </p>

            <h2 class="text-xl font-barber uppercase text-white">
              Administración del salón
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <router-link
              v-for="section in managementSections"
              :key="section.title"
              :to="section.to"
              custom
              v-slot="{ navigate }"
            >
              <div
                @click="navigate"
                role="link"
                class="group relative h-52 rounded-2xl overflow-hidden border border-white/10 text-left cursor-pointer"
              >
                <img
                  :src="section.image"
                  :alt="section.title"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div
                  class="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/10"
                ></div>

                <div class="absolute inset-x-0 bottom-0 p-5">
                  <p
                    class="text-[8px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
                  >
                    {{ section.category }}
                  </p>

                  <h3 class="text-lg font-barber uppercase text-white mb-1">
                    {{ section.title }}
                  </h3>

                  <p
                    class="text-white/45 text-[10px] leading-relaxed max-w-[230px]"
                  >
                    {{ section.description }}
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </section>

        <section
          v-if="barberStore.barbers.length"
          class="bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6"
        >
          <div class="flex items-end justify-between gap-4 mb-6">
            <div>
              <p
                class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
              >
                Equipo
              </p>

              <h2 class="text-xl font-barber uppercase text-white">Barberos</h2>
            </div>

            <span class="text-[10px] text-white/25">
              {{ totalBarbers }}
              {{ totalBarbers === 1 ? "profesional" : "profesionales" }}
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div
              v-for="(barber, index) in barberStore.barbers"
              :key="barber._id"
              class="group overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]"
            >
              <div class="aspect-[4/3] overflow-hidden">
                <img
                  :src="`/img/barbers/barber${index + 1}.jpg`"
                  :alt="barber.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div class="p-3">
                <p class="text-white/80 text-xs font-barber truncate">
                  {{ barber.name }}
                </p>

                <p class="text-white/25 text-[10px] truncate mt-1">
                  {{ barber.email }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- ============================================================= -->
    <!-- MODAL: GUÍA DEL ADMINISTRADOR                                  -->
    <!-- ============================================================= -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showGuide"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <!-- Fondo oscuro -->
          <div
            class="absolute inset-0 bg-black/80 backdrop-blur-sm"
            @click="showGuide = false"
          />

          <!-- Panel -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="showGuide"
              class="relative w-full max-w-3xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <!-- Línea decorativa dorada superior -->
              <div
                class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb700] to-transparent"
              />

              <!-- Header -->
              <div
                class="flex items-start justify-between gap-4 p-6 border-b border-white/10 shrink-0"
              >
                <div>
                  <p
                    class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
                  >
                    Guía rápida
                  </p>

                  <h2
                    class="text-2xl font-barber uppercase text-white tracking-wide"
                  >
                    ¿Qué puedes hacer como admin?
                  </h2>

                  <p class="text-white/40 text-xs mt-2 max-w-lg">
                    Toda la información y herramientas para gestionar el salón
                    en un solo lugar.
                  </p>
                </div>

                <button
                  type="button"
                  @click="showGuide = false"
                  class="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center shrink-0 transition-colors"
                  aria-label="Cerrar guía"
                >
                  <svg
                    class="w-4 h-4 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Contenido scrolleable -->
              <div class="p-6 overflow-y-auto space-y-6">
                <!-- SECCIÓN 1: Panel general -->
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div
                      class="w-9 h-9 rounded-lg bg-[#ffb700]/10 border border-[#ffb700]/20 flex items-center justify-center shrink-0"
                    >
                      <svg
                        class="w-4 h-4 text-[#ffb700]"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>

                    <h3
                      class="font-barber uppercase text-white text-sm tracking-wide"
                    >
                      Panel general
                    </h3>
                  </div>

                  <p class="text-white/50 text-xs leading-relaxed pl-12">
                    Aquí ves en tiempo real el estado del salón: cantidad de
                    reservas, clientes registrados, barberos activos e ingresos
                    del día. También puedes consultar las
                    <span class="text-white/80">próximas reservas</span>
                    ordenadas por fecha y hora.
                  </p>
                </div>

                <!-- SECCIÓN 2: Citas -->
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div
                      class="w-9 h-9 rounded-lg bg-[#ffb700]/10 border border-[#ffb700]/20 flex items-center justify-center shrink-0"
                    >
                      <svg
                        class="w-4 h-4 text-[#ffb700]"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    <h3
                      class="font-barber uppercase text-white text-sm tracking-wide"
                    >
                      Gestión de citas
                    </h3>
                  </div>

                  <p class="text-white/50 text-xs leading-relaxed pl-12">
                    Consulta, edita o elimina las reservas existentes. Verás los
                    datos completos de cada cita: cliente, barbero, servicio,
                    fecha y hora. Se indica si la cita es
                    <span class="text-white/80">pasada, de hoy o futura</span>.
                    <br />
                    <span class="text-white/40 italic text-[11px]">
                      Recomendación: evita modificar o eliminar citas, ya que
                      pertenecen al cliente. Solo hazlo si es estrictamente
                      necesario.
                    </span>
                  </p>
                </div>

                <!-- SECCIÓN 3: Barberos -->
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div
                      class="w-9 h-9 rounded-lg bg-[#ffb700]/10 border border-[#ffb700]/20 flex items-center justify-center shrink-0"
                    >
                      <svg
                        class="w-4 h-4 text-[#ffb700]"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>

                    <h3
                      class="font-barber uppercase text-white text-sm tracking-wide"
                    >
                      Barberos
                    </h3>
                  </div>

                  <p class="text-white/50 text-xs leading-relaxed pl-12 mb-3">
                    Consulta los datos de cada barbero: correo, rol, citas
                    próximas y días laborales. Como admin,
                    <span class="text-white/80">tú configuras el horario</span>
                    de cada profesional:
                  </p>

                  <ul
                    class="text-white/50 text-xs leading-relaxed pl-12 space-y-1.5"
                  >
                    <li class="flex gap-2">
                      <span class="text-[#ffb700]">•</span>
                      Selecciona los
                      <span class="text-white/80">7 días de la semana</span>
                      según su disponibilidad.
                    </li>
                    <li class="flex gap-2">
                      <span class="text-[#ffb700]">•</span>
                      Define rangos horarios por día (ej. de 12:00 a 13:00 para
                      comer, o un turno completo).
                    </li>
                    <li class="flex gap-2">
                      <span class="text-[#ffb700]">•</span>
                      <span class="text-white/80"
                        >Bloquea un día específico</span
                      >
                      del mes sin afectar los demás (ej. un feriado o día libre
                      puntual).
                    </li>
                    <li class="flex gap-2">
                      <span class="text-[#ffb700]">•</span>
                      Bloquea
                      <span class="text-white/80">horas específicas</span>
                      dentro de un día.
                    </li>
                  </ul>

                  <div
                    class="mt-3 ml-12 p-3 bg-[#ffb700]/5 border border-[#ffb700]/20 rounded-lg"
                  >
                    <p class="text-[#ffb700]/80 text-[11px] leading-relaxed">
                      <span class="font-medium">Importante:</span> el barbero
                      debe tener su horario configurado. Si no lo tiene, el
                      cliente
                      <span class="text-white/80">no podrá seleccionarlo</span>
                      ni completar su reserva.
                    </p>
                  </div>
                </div>

                <!-- SECCIÓN 4: Clientes -->
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div
                      class="w-9 h-9 rounded-lg bg-[#ffb700]/10 border border-[#ffb700]/20 flex items-center justify-center shrink-0"
                    >
                      <svg
                        class="w-4 h-4 text-[#ffb700]"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>

                    <h3
                      class="font-barber uppercase text-white text-sm tracking-wide"
                    >
                      Clientes
                    </h3>
                  </div>

                  <p class="text-white/50 text-xs leading-relaxed pl-12 mb-3">
                    Administra todas las cuentas registradas. Puedes:
                  </p>

                  <ul
                    class="text-white/50 text-xs leading-relaxed pl-12 space-y-1.5"
                  >
                    <li class="flex gap-2">
                      <span class="text-[#ffb700]">•</span>
                      Eliminar
                      <span class="text-white/80">cuentas no verificadas</span>
                      (usuarios fantasma).
                    </li>
                    <li class="flex gap-2">
                      <span class="text-[#ffb700]">•</span>
                      <span class="text-white/80">Bloquear cuentas</span> para
                      que no puedan ingresar a la web.
                    </li>
                    <li class="flex gap-2">
                      <span class="text-[#ffb700]">•</span>
                      <span class="text-white/80">Cambiar el rol</span> de un
                      usuario: cliente → barbero → admin.
                    </li>
                    <li class="flex gap-2">
                      <span class="text-[#ffb700]">•</span>
                      Ver el <span class="text-white/80">historial</span> de
                      cada cliente: correo, nombre, rol, cantidad de citas,
                      total gastado y su última reserva.
                    </li>
                  </ul>

                  <div
                    class="mt-3 ml-12 p-3 bg-white/[0.02] border border-white/10 rounded-lg"
                  >
                    <p class="text-white/50 text-[11px] leading-relaxed">
                      <span class="text-white/80"
                        >Verificación por correo:</span
                      >
                      cada usuario debe confirmar su cuenta con un correo real
                      antes de poder reservar. Esto evita cuentas falsas.
                    </p>
                  </div>
                </div>

                <!-- SECCIÓN 5: Servicios -->
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div
                      class="w-9 h-9 rounded-lg bg-[#ffb700]/10 border border-[#ffb700]/20 flex items-center justify-center shrink-0"
                    >
                      <svg
                        class="w-4 h-4 text-[#ffb700]"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                    </div>

                    <h3
                      class="font-barber uppercase text-white text-sm tracking-wide"
                    >
                      Servicios
                    </h3>
                  </div>

                  <p class="text-white/50 text-xs leading-relaxed pl-12">
                    Desde aquí creas los servicios que el cliente podrá
                    seleccionar al reservar. Puedes
                    <span class="text-white/80">crear</span>,
                    <span class="text-white/80">editar</span> (nombre y precio)
                    o <span class="text-white/80">eliminar</span> servicios.
                    Cada uno muestra su fecha de creación y última
                    actualización.
                  </p>
                </div>

                <!-- SECCIÓN 6: Flujo de reserva del cliente -->
                <div class="pt-2 border-t border-white/10">
                  <div class="flex items-center gap-3 mb-3">
                    <div
                      class="w-9 h-9 rounded-lg bg-[#ffb700]/10 border border-[#ffb700]/20 flex items-center justify-center shrink-0"
                    >
                      <svg
                        class="w-4 h-4 text-[#ffb700]"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>

                    <h3
                      class="font-barber uppercase text-white text-sm tracking-wide"
                    >
                      Flujo de reserva del cliente
                    </h3>
                  </div>

                  <p class="text-white/50 text-xs leading-relaxed pl-12 mb-3">
                    Para que un cliente pueda completar una reserva, deben
                    cumplirse las siguientes condiciones:
                  </p>

                  <ul
                    class="text-white/50 text-xs leading-relaxed pl-12 space-y-2"
                  >
                    <li class="flex gap-2">
                      <span class="text-[#ffb700] font-medium">1.</span>
                      <span>
                        Debe existir al menos
                        <span class="text-white/80">un barbero activo</span>. Si
                        no hay, el cliente verá:
                        <span
                          class="block text-white/40 italic text-[11px] mt-1"
                        >
                          "No hay barberos disponibles. Por el momento no hay
                          profesionales activos. Vuelve a intentarlo más tarde."
                        </span>
                      </span>
                    </li>
                    <li class="flex gap-2">
                      <span class="text-[#ffb700] font-medium">2.</span>
                      <span>
                        Debe existir al menos
                        <span class="text-white/80">un servicio creado</span>.
                        Si no hay, el cliente no podrá avanzar.
                      </span>
                    </li>
                    <li class="flex gap-2">
                      <span class="text-[#ffb700] font-medium">3.</span>
                      <span>
                        El barbero elegido debe tener su
                        <span class="text-white/80">horario configurado</span>.
                        Si no lo tiene, el cliente no podrá seleccionar día ni
                        hora.
                      </span>
                    </li>
                    <li class="flex gap-2">
                      <span class="text-[#ffb700] font-medium">4.</span>
                      <span>
                        Si todo está correcto, el cliente elige barbero +
                        servicio + día + hora, y la cita se confirma.
                      </span>
                    </li>
                  </ul>

                  <div
                    class="mt-3 ml-12 p-3 bg-[#ffb700]/5 border border-[#ffb700]/20 rounded-lg"
                  >
                    <p class="text-[#ffb700]/80 text-[11px] leading-relaxed">
                      <span class="font-medium">Al confirmar la reserva</span>,
                      se envía un correo automático al cliente y al barbero
                      seleccionado con los detalles de la cita.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div
                class="p-4 border-t border-white/10 bg-white/[0.02] shrink-0"
              >
                <p class="text-white/30 text-[10px] text-center">
                  Si algo no funciona como esperabas, revisa esta guía o
                  contacta al desarrollador.
                  <a href="https://leiston-holguin.com" class="text-blue-500/50"
                    >LEISTON HOLGUIN</a
                  >
                </p>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { displayDate } from "@/helpers/date";

import { formatCurrency } from "@/helpers";

import { useUserStore } from "@/stores/user";

import { useAdminStore } from "@/stores/admin";

import { useBarberStore } from "@/stores/barber";

const userStore = useUserStore();
const adminStore = useAdminStore();
const barberStore = useBarberStore();

// ✅ Estado del modal de guía
const showGuide = ref(false);

const loading = computed(
  () => adminStore.loading || adminStore.loadingClients || barberStore.loading,
);

const appointments = computed(() => adminStore.appointments);

const totalAppointments = computed(() => appointments.value.length);

const totalBarbers = computed(() => barberStore.barbers.length);

const totalClients = computed(() => adminStore.clients.length);

const getLocalDateKey = (date: Date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const todayKey = computed(() => getLocalDateKey(new Date()));

const getAppointmentDateKey = (date: string) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return getLocalDateKey(parsed);
};

const todayAppointments = computed(
  () =>
    appointments.value.filter(
      (appointment) =>
        getAppointmentDateKey(appointment.date) === todayKey.value,
    ).length,
);

const estimatedIncome = computed(() =>
  appointments.value
    .filter(
      (appointment) =>
        getAppointmentDateKey(appointment.date) === todayKey.value,
    )
    .reduce(
      (total, appointment) => total + Number(appointment.totalAmount || 0),
      0,
    ),
);

const upcomingAppointments = computed(() =>
  [...appointments.value].sort((a, b) => {
    const dateA = new Date(a.date);

    const dateB = new Date(b.date);

    const [hoursA = "0", minutesA = "0"] = a.time.split(":");

    const [hoursB = "0", minutesB = "0"] = b.time.split(":");

    dateA.setHours(Number(hoursA), Number(minutesA), 0, 0);

    dateB.setHours(Number(hoursB), Number(minutesB), 0, 0);

    return dateA.getTime() - dateB.getTime();
  }),
);

const statistics = computed(() => [
  {
    label: "Reservas",
    value: totalAppointments.value,
    detail: "Total registradas",
  },
  {
    label: "Hoy",
    value: todayAppointments.value,
    detail: "Reservas del día",
  },
  {
    label: "Clientes",
    value: totalClients.value,
    detail: "Usuarios registrados",
  },
  {
    label: "Barberos",
    value: totalBarbers.value,
    detail: "Profesionales activos",
  },
]);

const managementSections = computed(() => [
  {
    category: "Reservas",
    title: "Citas",
    description: "Consulta y administra las reservas del salón.",
    image: "/img/admin/gestion/citas.png",
    to: { name: "Admin-Appointments" },
  },
  {
    category: "Equipo",
    title: "Barberos",
    description: "Gestiona profesionales y horarios.",
    image: "/img/admin/gestion/barbers.png",
    to: { name: "Admin-Barbers" },
  },
  {
    category: "Usuarios",
    title: "Clientes",
    description: "Consulta y administra los clientes.",
    image: "/img/admin/gestion/clientes.png",
    to: { name: "Admin-Customer" },
  },
  {
    category: "Catálogo",
    title: "Servicios",
    description: "Administra servicios y precios.",
    image: "/img/admin/gestion/services.png",
    to: { name: "Admin-Services" },
  },
]);

const getClientInitial = (appointment: (typeof appointments.value)[number]) =>
  appointment.user?.name?.trim().charAt(0).toUpperCase() || "C";

onMounted(async () => {
  await Promise.all([
    adminStore.getAllAppointments(),
    adminStore.getClients(),
    barberStore.getBarbers(),
  ]);
});
</script>

<style scoped></style>
