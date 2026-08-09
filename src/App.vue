<template>
  <div class="flex h-screen  bg-gray-500">
    <div class="w-1/3 hidden lg:block">
      <img
        src="/img/1.jpg"
        alt="imagen login"
        class="h-screen w-full object-cover"
      />
    </div>
    <div class="w-full md:w-2/3 overflow-y-auto ">
      <div class="px-5 py-5" >
        <RouterView  />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
