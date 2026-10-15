<template>
  <footer class="w-full bg-[#050505] text-white border-t border-white/10">
    <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">

      <!-- MARCA Y REDES -->
      <div class="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">

        <div class="flex items-center gap-3">
          <div class="w-11 h-11 border border-[#ffb700]/70 flex items-center justify-center">
            <span class="font-barber text-2xl text-[#ffb700]">A</span>
          </div>

          <div>
            <p class="font-barber text-sm uppercase tracking-[0.16em] text-white">
              El Barbero
            </p>
            <p class="text-[10px] text-white/40 mt-1">
              Estilo · Precisión · Confianza
            </p>
          </div>
        </div>

        <div class="flex items-center gap-5">
          <a
            href="#"
            aria-label="Instagram"
            class="text-white/50 hover:text-[#ffb700] transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"/>
            </svg>
          </a>

          <a
            href="#"
            aria-label="Facebook"
            class="text-white/50 hover:text-[#ffb700] transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.043 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.03 1.792-4.707 4.533-4.707 1.312 0 2.686.236 2.686.236v2.975H15.83c-1.491 0-1.956.93-1.956 1.886v2.273h3.328l-.532 3.49h-2.796V24C19.612 23.116 24 18.1 24 12.073z"/>
            </svg>
          </a>

          <a
            href="#"
            aria-label="YouTube"
            class="text-white/50 hover:text-[#ffb700] transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- COPYRIGHT -->
      <div class="border-t border-white/10 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p class="text-white/40 text-[11px]">
          © {{ new Date().getFullYear() }} The Barber Studio
        </p>

        <p class="text-white/40 text-[11px]">
          Todos los derechos reservados
        </p>

        <p class="text-white/40 text-[11px]">
          Hecho por:
          <a
            href="https://leiston-holguin.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white hover:text-[#ffb700] transition-colors duration-200 text-[9px]"
          >
            LEISTON HOLGUIN
          </a>
        </p>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>