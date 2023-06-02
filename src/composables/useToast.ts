import type { ToastOptions } from 'vue-toasted'
import useNuxt from './useNuxt'

const useToast = () => {
  // ========================================
  // toastへのaccessorを取得
  // ========================================
  const { nuxt } = useNuxt()
  const toast = nuxt.$toast

  // ========================================
  // successタイプのtoastを表示
  // ========================================

  const successToast = (message: string) => {
    const option: ToastOptions = {
      position: 'top-center',
      duration: 3000,
      type: 'success',
      className: 'bg-success',
    }

    return toast.show(message, option)
  }

  // ========================================
  // errorタイプのtoastを表示
  // ========================================

  const errorToast = (message: string) => {
    const option: ToastOptions = {
      position: 'top-center',
      duration: 3000,
      type: 'error',
      className: 'bg-warning',
    }

    return toast.error(message, option)
  }

  return {
    toast,
    successToast,
    errorToast,
  }
}

export default useToast
