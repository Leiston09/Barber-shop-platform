<template>
  <footer
    class="w-full bg-[#050505] text-white px-6 sm:px-10 lg:px-20 py-10 border-t border-white/[0.06]"
  >
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-8">
        <!-- MARCA -->
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 border border-white/15 flex items-center justify-center"
          >
            <span class="text-[#ffb700] text-lg font-bold font-barber">A</span>
          </div>
          <div class="leading-none">
            <p
              class="text-white/75 text-[10px] uppercase tracking-[0.28em] font-medium font-barber"
            >
              El Barbero
            </p>
            <p
              class="text-white/25 text-[7px] uppercase tracking-[0.3em] mt-1.5"
            >
              Estilo · Precisión · Confianza
            </p>
          </div>
        </div>

        <!-- REDES -->
        <div class="flex items-center gap-2">
          <a
            href="#"
            aria-label="Instagram"
            class="w-8 h-8 border border-white/10 flex items-center justify-center text-white/30 hover:text-[#ffb700] hover:border-[#ffb700]/40 transition-all duration-300"
          >
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 7.537c-2.465 0-4.463 1.998-4.463 4.463 0 2.465 1.998 4.463 4.463 4.463 2.465 0 4.463-1.998 4.463-4.463 0-2.465-1.998-4.463-4.463-4.463zm0 10.057a5.594 5.594 0 110-11.188 5.594 5.594 0 010 11.188zm5.833-10.916a1.308 1.308 0 11-2.616 0 1.308 1.308 0 012.616 0z"
              />
            </svg>
          </a>
          <a
            href="#"
            aria-label="Facebook"
            class="w-8 h-8 border border-white/10 flex items-center justify-center text-white/30 hover:text-[#ffb700] hover:border-[#ffb700]/40 transition-all duration-300"
          >
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
          </a>
          <a
            href="#"
            aria-label="YouTube"
            class="w-8 h-8 border border-white/10 flex items-center justify-center text-white/30 hover:text-[#ffb700] hover:border-[#ffb700]/40 transition-all duration-300"
          >
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
          </a>
        </div>
      </div>

      <!-- COPYRIGHT -->
      <div
        class="mt-8 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <p class="text-white/20 text-[8px] uppercase tracking-[0.2em]">
          © {{ new Date().getFullYear() }} The Barber Studio
        </p>
        <p class="text-white/20 text-[8px] uppercase tracking-[0.2em]">
          Todos los derechos reservados
        </p>
        <p class="text-white/20 text-[6px] lg:text-[8px] uppercase tracking-[0.2em]">
          Hecho por:
          <a href="https://leiston-holguin.com" class="text-blue-500/50"
            >LEISTON HOLGUIN</a
          >
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped></style>
