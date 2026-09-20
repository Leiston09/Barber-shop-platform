<template>
  <section
    class="w-full bg-[#050505] text-white px-6 sm:px-10 lg:px-20 py-5"
  >
    <div class="max-w-7xl mx-auto">

      <!-- Encabezado -->
      <div class="max-w-2xl mb-14">
        <div class="flex items-center gap-3 mb-5">
          <span class="w-2 h-px bg-[#ffb700]" />
          <span
            class="text-[#ffb700] text-[9px] uppercase tracking-[0.35em] font-medium"
          >
            Estamos para ayudarte
          </span>
        </div>

        <h2
          class="font-barber text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight uppercase"
        >
          ¿Necesitas
          <span class="text-[#ffb700]">ayuda?</span>
        </h2>

        <p class="mt-5 text-white/40 text-sm sm:text-base leading-relaxed max-w-xl">
          Si tienes algún inconveniente con tu reserva, necesitas modificar una
          cita o simplemente quieres comunicarte con nosotros, puedes hacerlo
          directamente por cualquiera de nuestros canales.
        </p>
      </div>

      <!-- Contactos -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">

        <!-- Contacto principal -->
        <div
          class="lg:col-span-7 relative overflow-hidden rounded-2xl border border-[#ffb700]/20 bg-[#0b0b0b] p-7 sm:p-9"
        >
          <div
            class="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-[#ffb700]/5 blur-3xl"
          />

          <div class="relative">
            <div class="flex items-start justify-between gap-6">
              <div>
                <span
                  class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700]/70"
                >
                  Atención prioritaria
                </span>

                <h3
                  class="font-barber text-2xl sm:text-3xl uppercase tracking-wide mt-3"
                >
                  ¿Tuviste un problema?
                </h3>

                <p
                  class="text-white/40 text-sm leading-relaxed max-w-md mt-3"
                >
                  Si ocurrió algún inconveniente con tu reserva o necesitas
                  asistencia, contáctanos directamente.
                </p>
              </div>

              <div
                class="hidden sm:flex w-12 h-12 rounded-full border border-[#ffb700]/20 items-center justify-center shrink-0"
              >
                <svg
                  class="w-5 h-5 text-[#ffb700]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 9v3m0 4h.01M10.29 3.86l-8.18 14A2 2 0 003.84 21h16.32a2 2 0 001.73-3.14l-8.18-14a2 2 0 00-3.42 0z"
                  />
                </svg>
              </div>
            </div>

            <a
              href="https://wa.me/593999999999"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-3 mt-8 px-6 py-3.5 rounded-lg bg-[#ffb700] text-black text-[10px] font-barber uppercase tracking-[0.2em] hover:bg-[#e6a500] transition-all duration-300"
            >
              <svg
                class="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
                />
                <path
                  d="M20.52 3.449A11.815 11.815 0 0012.081 0C5.444 0 .04 5.4.04 12.03c0 2.12.554 4.19 1.607 6.015L.04 24l6.1-1.597a12.05 12.05 0 005.94 1.51h.005c6.636 0 12.04-5.4 12.04-12.03a11.94 11.94 0 00-3.605-8.434z"
                />
              </svg>
              Contactar por WhatsApp
            </a>
          </div>
        </div>

        <!-- WhatsApp -->
        <a
          href="https://wa.me/593999999999"
          target="_blank"
          rel="noopener noreferrer"
          class="lg:col-span-5 group rounded-2xl border border-white/8 bg-white/[0.02] p-7 sm:p-8 hover:border-[#25D366]/30 transition-all duration-300"
        >
          <div class="flex items-start justify-between">
            <div
              class="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-white/60 group-hover:text-[#25D366] transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.198-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
                />
              </svg>
            </div>

            <svg
              class="w-4 h-4 text-white/20 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M5 12h14m-6-6 6 6-6 6"
              />
            </svg>
          </div>

          <p class="text-[9px] uppercase tracking-[0.3em] text-white/30 mt-7">
            Atención directa
          </p>

          <h3 class="font-barber text-xl uppercase mt-2">
            WhatsApp
          </h3>

          <p class="text-white/35 text-sm mt-2">
            Resolvemos tus dudas de forma rápida y directa.
          </p>
        </a>

        <!-- Redes sociales -->
        <div
          class="lg:col-span-7 rounded-2xl border border-white/8 bg-white/[0.02] p-7 sm:p-8"
        >
          <div class="flex items-center justify-between mb-7">
            <div>
              <p
                class="text-[9px] uppercase tracking-[0.3em] text-white/30"
              >
                También estamos aquí
              </p>

              <h3 class="font-barber text-xl uppercase mt-2">
                Redes sociales
              </h3>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center justify-between p-4 rounded-xl border border-white/8 hover:border-white/20 transition-all duration-300"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white/50 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      width="20"
                      height="20"
                      x="2"
                      y="2"
                      rx="5"
                      ry="5"
                      stroke-width="1.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      stroke-width="1.5"
                    />
                    <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
                  </svg>
                </div>

                <div>
                  <p class="text-sm text-white/80">Instagram</p>
                  <p class="text-[11px] text-white/30 mt-1">
                    @studio.silhouette
                  </p>
                </div>
              </div>

              <svg
                class="w-4 h-4 text-white/20 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M5 12h14m-6-6 6 6-6 6"
                />
              </svg>
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center justify-between p-4 rounded-xl border border-white/8 hover:border-white/20 transition-all duration-300"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white/50 group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V4.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V11H7v3h2.8v8h3.7z"
                    />
                  </svg>
                </div>

                <div>
                  <p class="text-sm text-white/80">Facebook</p>
                  <p class="text-[11px] text-white/30 mt-1">
                    Studio Silhouette
                  </p>
                </div>
              </div>

              <svg
                class="w-4 h-4 text-white/20 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M5 12h14m-6-6 6 6-6 6"
                />
              </svg>
            </a>

          </div>
        </div>

        <!-- Información -->
        <div
          class="lg:col-span-5 rounded-2xl border border-white/8 bg-white/[0.02] p-7 sm:p-8"
        >
          <p class="text-[9px] uppercase tracking-[0.3em] text-white/30">
            Información
          </p>

          <h3 class="font-barber text-xl uppercase mt-2 mb-6">
            Encuéntranos
          </h3>

          <div class="space-y-5">

            <div class="flex gap-4">
              <div
                class="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center shrink-0"
              >
                <svg
                  class="w-4 h-4 text-[#ffb700]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
                  />
                  <circle
                    cx="12"
                    cy="9"
                    r="2.5"
                    stroke-width="1.5"
                  />
                </svg>
              </div>

              <div>
                <p class="text-xs text-white/70">Ubicación</p>
                <p class="text-xs text-white/30 mt-1">
                  Tu dirección aquí
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div
                class="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center shrink-0"
              >
                <svg
                  class="w-4 h-4 text-[#ffb700]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke-width="1.5"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-width="1.5"
                    d="M12 7v5l3 2"
                  />
                </svg>
              </div>

              <div>
                <p class="text-xs text-white/70">Horario</p>
                <p class="text-xs text-white/30 mt-1">
                  Lun — Sáb · 09:00 — 20:00
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>



    </div>
  </section>
</template>