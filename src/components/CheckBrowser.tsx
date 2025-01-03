import { useSupported } from '@vueuse/core'
import { isTauri } from '@/utils/tauri'

const isSupported = useSupported(() => navigator && 'bluetooth' in navigator)
const CheckBrowser = () => {
  if (!isSupported && !isTauri()) {
    return (
      <div class="fixed top-0 left-0 right-0 bg-[#ffcc00] text-white font-[14px] text-center p-2 z-50 shadow">
        此浏览器不支持蓝牙，请更换新版 Chrome/Edge/Bluefy 等浏览器。
      </div>
    )
  }

  return <></>
}
export default CheckBrowser
