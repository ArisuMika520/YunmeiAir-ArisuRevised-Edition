<script setup lang="ts">
import { RouterView } from 'vue-router'

import CheckBrowser from '@/components/CheckBrowser'
</script>

<template>
  <div class="container mx-auto px-4 h-full">
    <CheckBrowser />
    <RouterView />
  </div>
</template>

<style scoped></style>
