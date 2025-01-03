import { Base64 } from 'js-base64'

const DATA_VER = '1.2'

class Lock {
  label = '未添加门锁'
  D_Mac = ''
  D_CHAR = ''
  D_SERV = ''
  D_SEC = ''
  username = ''
  schoolNo = ''
  lockNo = ''

  constructor(
    label?: string,
    d_mac?: string,
    d_serv?: string,
    d_lock?: string,
    d_sec?: string,
    _username?: string,
    _schoolNo?: string,
    _lockNo?: string,
  ) {
    if (label) this.label = label
    if (d_mac) this.D_Mac = d_mac
    if (d_serv) this.D_CHAR = d_serv
    if (d_lock) this.D_SERV = d_lock
    if (d_sec) this.D_SEC = d_sec
    if (_username) this.username = _username
    if (_schoolNo) this.schoolNo = _schoolNo
    if (_lockNo) this.lockNo = _lockNo
  }

  removeSec(): void {
    this.D_SEC = this.username = this.lockNo = this.schoolNo = ''
  }

  toString(headless = false): string {
    const body = [
      this.label,
      this.D_Mac,
      this.D_CHAR,
      this.D_SERV,
      this.D_SEC,
      this.username,
      this.schoolNo,
      this.lockNo,
      DATA_VER,
    ].join('|')

    const baseUrl = (headless ? '' : `${this.D_SEC ? 'lock_info' : 'lock_id'}`) + '/'
    return baseUrl + Base64.encode(body)
  }

  static fromUrl(url: string): Lock {
    const match = /(?:addlock\/|lock_id\/|lock_info\/|lockInfo\/)(.*)/.exec(url)
    if (!match) return new Lock() // Invalid URL format, return default lock

    const decodedUrl = Base64.decode(match[1])
    const us = decodedUrl.split('|')

    if (us.length === 4) us.unshift('account')

    const lock = new Lock()
    if (us.length >= 5) {
      ;[lock.label, lock.D_Mac, lock.D_CHAR, lock.D_SERV, lock.D_SEC] = us.slice(0, 5)
    }

    if (us.length >= 8) {
      ;[lock.username, lock.schoolNo, lock.lockNo] = us.slice(5, 8)
    }

    return lock
  }
}

export default Lock
