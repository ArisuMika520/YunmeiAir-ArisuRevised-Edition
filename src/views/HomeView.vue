<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const memo = ref<string>('等待开锁')
const progress = ref<number>(0)
</script>

<template>
  <div class="flex justify-center py-10 w-full h-full">
    <div class="flex flex-col items-center gap-10 w-full">
      <div
        class="radial-progress bg-primary text-primary-content border-4 border-primary rotate-180"
        style="--size: 12em"
        :style="{
          '--value': progress,
        }"
      >
        <span class="rotate-180"> {{ memo }} </span>
      </div>

      <div class="lock-actions w-40">
        <div class="lock-selector">
          <select class="select select-ghost w-full max-w-xs">
            <option disabled selected>选择门锁</option>
            <option>Svelte</option>
            <option>Vue</option>
            <option>React</option>
          </select>
        </div>

        <button class="btn btn-primary w-full my-2">开门</button>
        <button class="btn btn-ghost w-full">添加门锁</button>
      </div>
    </div>
  </div>

  <div class="fixed bottom-10 left-[50%] translate-x-[-50%]">
    <router-link :to="'/about'"> 关于 </router-link>
  </div>
</template>

<style></style>
