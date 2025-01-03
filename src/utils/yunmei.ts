export function getPwd(secret: string): ArrayBuffer {
  const buffer = new ArrayBuffer(1024)
  const view = new DataView(buffer)
  let offset = 0
  const pw = Math.floor(Math.random() * 1000000)

  view.setUint8(offset++, 208)
  const len = secret.length + 2 + 2 + 10
  view.setUint8(offset++, len)

  // 填充 secret 字符串
  for (let i = 0; i < secret.length; i++) {
    view.setUint8(offset++, secret.charCodeAt(i))
  }

  // 添加随机密码
  view.setUint8(offset++, 165)
  let tempPw = pw
  for (let i = 0; i < 6; i++) {
    view.setUint8(offset++, tempPw % 10)
    tempPw = Math.floor(tempPw / 10)
  }

  // 固定尾部字节
  view.setUint8(offset++, 73)
  view.setUint8(offset++, 68)
  view.setUint8(offset++, 48)
  view.setUint8(offset++, 49)
  view.setUint8(offset++, 167)

  return buffer.slice(0, offset)
}
