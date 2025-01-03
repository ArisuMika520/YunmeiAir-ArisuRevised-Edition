import md5 from 'md5'

class User {
  static CURVER = '1.1'
  ver: string
  username: string
  usernameMD5: string
  passwordMD5: string

  constructor(username: string = '', password: string = '') {
    this.ver = User.CURVER
    this.username = username
    this.usernameMD5 = md5(username)
    this.passwordMD5 = password
  }

  fromString(data: string): void {
    const [username, usernameMD5, passwordMD5] = data.split('|')
    if (username && usernameMD5 && passwordMD5) {
      this.username = username
      this.usernameMD5 = usernameMD5
      this.passwordMD5 = passwordMD5
    }
  }

  toString(): string {
    return `${this.username}|${this.usernameMD5}|${this.passwordMD5}|${this.ver}`
  }
}

export default User
