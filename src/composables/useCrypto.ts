import { createHash } from 'crypto'
import { AES } from 'crypto-ts'
import useConfig from './useConfig'

const useCrypto = () => {
  const { config } = useConfig()

  // ========================================
  // hashを取得
  // ========================================

  const getHashedStr = (str: string) => {
    const hash = createHash('sha256')
    return hash.update(str).digest('hex')
  }

  // ========================================
  // AESで暗号化された文字列を取得
  // ========================================

  const getEncryptedStr = (str: string) => {
    const key = config.TWITTER_ENCRYPT_KEY
    const encryptedStr = AES.encrypt(str, key!).toString()

    return encryptedStr
  }

  return {
    getHashedStr,
    getEncryptedStr,
  }
}

export default useCrypto
