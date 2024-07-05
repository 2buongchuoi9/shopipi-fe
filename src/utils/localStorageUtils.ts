import CryptoJS from "crypto-js"

const secretKey = import.meta.env.VITE_SECRET_KEY
const token = "token"
const id = "x-client-id"
const refreshToken = "refreshToken"

class Default {
    key: string
    constructor(key: string) {
        this.key = key
    }
    get() {
        const encryptedData = localStorage.getItem(this.key)
        if (!encryptedData) return null
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey)
        const originalData = bytes.toString(CryptoJS.enc.Utf8)
        return originalData
    }
    set(value: string) {
        const cipherText = CryptoJS.AES.encrypt(value, secretKey).toString()
        localStorage.setItem(this.key, cipherText)
    }
    remove() {
        localStorage.removeItem(this.key)
    }
}

const accessToken = new Default(token)
const refreshTokenStorage = new Default(refreshToken)
const clientId = new Default(id)

export { accessToken, refreshTokenStorage, clientId }
