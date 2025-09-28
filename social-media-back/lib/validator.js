export default class Validator {
  static isStrongPassword (value) {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*_.-]).{8,}$/.test(value)
  }
}