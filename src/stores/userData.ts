import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import Lock from '@/entity/Lock'
import type User from '@/entity/User'

export const useUserDataStore = defineStore('userData', () => {
  const lockList = useStorage<Lock[]>('lockList', [])
  const userList = useStorage<User[]>('userList', [])
  const unlockOnEntry = useStorage<boolean>('unlockOnEntry', false)

  // 添加锁
  function addLock(lock: Lock) {
    lockList.value.push(lock)
  }

  // 添加用户
  function addUser(user: User) {
    userList.value.push(user)
  }

  // 移除锁
  function removeLock(lock: Lock) {
    const index = lockList.value.findIndex((existingLock) => existingLock.D_SERV === lock.D_SERV)
    if (index !== -1) {
      lockList.value.splice(index, 1)
    }
  }

  return {
    lockList,
    userList,
    unlockOnEntry,
    addLock,
    addUser,
    removeLock,
  }
})
