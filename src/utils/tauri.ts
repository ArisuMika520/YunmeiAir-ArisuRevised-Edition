import { type BleDevice, startScan, send, connect, disconnect } from '@mnlphlp/plugin-blec'

export const isTauri = () => {
  return Boolean(
    typeof window !== 'undefined' &&
      window !== undefined &&
      // @ts-expect-error window
      window.__TAURI_INTERNALS__ !== undefined,
  )
}

export class TauriBLE {
  devices: BleDevice[] = []

  constructor() {
    startScan((dev: BleDevice[]) => ((this.devices = dev), console.log(dev)), 10000)
  }

  getDevice(serviceUuid: string): BleDevice | boolean {
    const device = this.devices.find(
      (device: BleDevice) =>
        device.services.findIndex((service: string) => service === serviceUuid) > -1,
    )
    if (!device) return false
    return device
  }

  connectDevice(device: BleDevice): Promise<void> {
    return connect(device.address, () => console.log)
  }

  writeValue(characteristicUuid: string, data: Uint8Array): Promise<void> {
    return send(characteristicUuid, data)
  }

  disconnect() {
    disconnect()
  }
}
