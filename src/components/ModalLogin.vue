<template>
  <input type="checkbox" id="modal-login" class="modal-toggle" />
  <div class="modal modal-bottom sm:modal-middle">
    <div class="modal-box sm:w-11/12 sm:max-w-[500px]" ref="target">
      <label for="modal-login" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
      <h3 class="font-bold text-lg">登录</h3>
      <p class="py-4">
        使用云莓智能登录以添加门锁。你的账号信息将会发送到我们的服务进行处理，在此过程中我们不会存储你的信息，请放心使用。
        <span class="font-bold">(详见关于)</span>
      </p>
      <form class="flex flex-col gap-4 py-4" @submit="login">
        <div class="form-control">
          <input
            type="text"
            placeholder="输入手机号..."
            class="input input-bordered input-md w-full"
            v-model="username"
          />
        </div>
        <div class="form-control">
          <input
            type="password"
            placeholder="输入密码..."
            class="input input-bordered input-md w-full"
            v-model="password"
          />
        </div>
        <button class="btn w-full" :disabled="isLoading">
          <template v-if="isLoading">登录中...</template>
          <template v-else>登录</template>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useAxios } from '@vueuse/integrations/useAxios'
import md5 from 'md5'
import Lock from '@/entity/Lock'
import { useUserDataStore } from '@/stores/userData'

const userDataStore = useUserDataStore()

const target = ref(null)

const closeModal = () => {
  const modalLogin = document.getElementById('modal-login') as HTMLInputElement
  if (modalLogin) {
    modalLogin.checked = false
  }
}

onClickOutside(target, () => closeModal())

const username = ref<string>('')
const password = ref<string>('')

const { execute, isLoading } = useAxios()

const login = async (e: Event) => {
  e.preventDefault()
  const url = `https://api.fosky.top/api/yunmei/login?username=${username.value}&password=${password.value}`

  execute(url)
    .then((response) => {
      console.log(response)
      if (response.data.value.code == 500) {
        window.alert('登录出错了。' + response.data.value.msg)
        return
      }

      const lockRes = response.data.value.data
      const currentLock = new Lock()
      currentLock.label = `${lockRes.buildName}-${lockRes.dormNo}`
      currentLock.D_SEC = lockRes.lockSecret
      currentLock.D_CHAR = lockRes.lockCharacterUuid
      currentLock.D_SERV = lockRes.lockServiceUuid
      currentLock.D_Mac = lockRes.lockNo
      currentLock.lockNo = lockRes.lockNo
      currentLock.schoolNo = lockRes.schoolNo
      currentLock.username = md5(username.value)

      userDataStore.addLock(currentLock)

      window.alert('登录成功，成功获取到门锁并添加。')

      username.value = ''
      password.value = ''
      closeModal()
    })
    .catch((error) => {
      window.alert('登录出错了。' + error)
    })
}
</script>
