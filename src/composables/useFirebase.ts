import { wrapProperty } from '@nuxtjs/composition-api'
import '@nuxtjs/firebase'
import { NO_IMAGE_URL } from '@/utils/image'

const useFirebase = () => {
  // ========================================
  // freModuleへのaccessorを取得
  // ========================================
  const useTFireModule = wrapProperty('$fireModule', false)
  const fireModule = useTFireModule()

  // =====================================
  // firebasecloudstorageからの画像URL取得
  // =====================================
  const getDownloadURL = async (path: string) => {
    const storageRef = fireModule.storage().ref()

    return await storageRef
      .child(path)
      .getDownloadURL()
      .then((url) => {
        return url
      })
      .catch(() => {
        return NO_IMAGE_URL
      })
  }

  return {
    fireModule,
    getDownloadURL,
  }
}

export default useFirebase
