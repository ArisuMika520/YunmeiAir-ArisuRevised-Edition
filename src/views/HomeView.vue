<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { pausableWatch, useBluetooth } from '@vueuse/core'

import Lock from '@/entity/Lock'

import { useUserDataStore } from '@/stores/userData'
import { getPwd } from '@/utils/yunmei'
const userDataStore = useUserDataStore()

const memo = ref<string>('等待开锁')
const progress = ref<number>(0)
const errorMsg = ref<string>('')

const currentLockServ = ref<string>('none')
const isUnlocking = ref<boolean>(false)

const updateLockMemo = () => {
  if (userDataStore.lockList.length === 0) {
    memo.value = '请先添加门锁'
  } else if (userDataStore.lockList.length === 1) {
    currentLockServ.value = userDataStore.lockList[0].D_SERV
    memo.value = '等待开锁'
  }
}
updateLockMemo()
watch(userDataStore.lockList, () => {
  updateLockMemo()
})

const { isConnected, requestDevice, server, error } = useBluetooth({
  filters: [{ services: [currentLockServ.value.toLowerCase()] }],
})

const update = (_progress: number, _memo: string) => {
  progress.value = _progress
  memo.value = _memo
}

async function unlock() {
  try {
    const currentLock = userDataStore.lockList.find(
      (lock: Lock) => lock.D_SERV == currentLockServ.value,
    )
    const service = await server.value.getPrimaryService(currentLockServ.value.toLowerCase())
    update(50, '查询中')
    const characteristic = await service.getCharacteristic(currentLock?.D_CHAR.toLowerCase())
    console.log(characteristic)
    update(60, '查询成功，解锁中')
    const pwd = getPwd(currentLock?.D_SEC || '')
    await characteristic.writeValue(pwd)
    update(100, '完成')
  } catch (error) {
    console.error(error)
    errorMsg.value = error as string
    update(0, '出错')
  }
  isUnlocking.value = false
}

const connect = () => {
  isUnlocking.value = true
  update(10, '连接中')
  requestDevice()
}

watch(error, (newVal) => {
  console.log(newVal)
  errorMsg.value = newVal as string
  if (newVal !== null) {
    if (newVal == 'NotFoundError: Bluetooth adapter not available.') {
      memo.value = '未找到蓝牙适配器'
    } else if (newVal == 'NotFoundError: User cancelled the requestDevice() chooser.') {
      memo.value = '您取消了选择'
    } else if (newVal == 'NetworkError: Connection Error: Connection attempt failed.') {
      memo.value = '连接失败'
    }

    isUnlocking.value = false
    progress.value = 0
  }
})

const { stop } = pausableWatch(isConnected, async (newIsConnected) => {
  console.log(newIsConnected)
  if (!newIsConnected || !server.value || !isUnlocking.value) return
  update(30, '找到设备')
  await unlock()
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
          @click="connect()"
          :disabled="currentLockServ == 'none' || isUnlocking"
        >
          <template v-if="isUnlocking">开门中...</template>
          <template v-else>开门</template>
        </button>
        <label for="modal-login" class="btn btn-ghost w-full">添加门锁</label>
      </div>

      <div class="error-msg bg-[#eecc00] text-white p-4 w-full rounded-lg" v-if="errorMsg !== ''">
        {{ errorMsg }}
      </div>
    </div>
  </div>

  <div class="fixed bottom-10 left-[50%] translate-x-[-50%]">
    <router-link :to="'/about'"> 关于 </router-link>
  </div>
</template>

<style></style>
