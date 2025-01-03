<script setup lang="ts">
import { RouterView } from 'vue-router'
import router from '@/router'
import CheckBrowser from '@/components/CheckBrowser'
import ModalLogin from './components/ModalLogin.vue'
</script>

<template>
  <div class="absolute top-4 left-4" v-if="router.currentRoute.value.path != '/'">
    <button class="btn btn-primary" @click="router.push('/')">返回</button>
  </div>
  <div class="container mx-auto px-4 py-12 h-full">
    <CheckBrowser />
    <ModalLogin />
    <RouterView />
  </div>
</template>

<style scoped></style>
