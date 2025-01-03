<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { pausableWatch, useBluetooth } from '@vueuse/core'

import Lock from '@/entity/Lock'

import { useUserDataStore } from '@/stores/userData'
import { getPwd } from '@/utils/yunmei'
const userDataStore = useUserDataStore()

const memo = ref<string>('等待开锁')
const progress = ref<number>(0)

const currentLockServ = ref('none')
const isUnlocking = ref(false)

const { isConnected, requestDevice, server } = useBluetooth({
  acceptAllDevices: true,
  optionalServices: [currentLockServ],
})

const update = (_progress: number, _memo: string) => {
  progress.value = _progress
  memo.value = _memo
}

async function unlock() {
  isUnlocking.value = true
  try {
    const currentLock = userDataStore.lockList.find(
      (lock: Lock) => lock.D_SERV == currentLockServ.value,
    )
    // @ts-expect-error getPrimaryService
    const service = await server.getPrimaryService(currentLockServ)
    update(50, '查询中')
    const characteristic = await service.getCharacteristic(currentLock?.D_CHAR)
    update(60, '查询成功，解锁中')
    const pwd = getPwd(currentLock?.D_SEC || '')
    await characteristic.sendValue(pwd)
    update(100, '完成')
  } catch (error) {
    console.error(error)
    update(0, '出错')
  }
  isUnlocking.value = false
}

const { stop } = pausableWatch(isConnected, (newIsConnected) => {
  if (!newIsConnected || !server.value || isUnlocking.value) return
  update(30, '找到设备')
  unlock()
  stop()
})
</script>

<template>
  <div class="flex justify-center w-full h-full">
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
          <select class="select select-ghost w-full max-w-xs" v-model="currentLockServ">
            <option disabled selected value="none">选择门锁</option>
            <option v-for="lock in userDataStore.lockList" :key="lock.D_SERV" :value="lock.D_SERV">
              {{ lock.label }}
            </option>
          </select>
        </div>

        <button
          class="btn btn-primary w-full my-2"
          @click="(update(10, '连接中'), requestDevice())"
        >
          开门
        </button>
        <label for="modal-login" class="btn btn-ghost w-full">添加门锁</label>
      </div>
    </div>
  </div>

  <div class="fixed bottom-10 left-[50%] translate-x-[-50%]">
    <router-link :to="'/about'"> 关于 </router-link>
  </div>
</template>

<style></style>
