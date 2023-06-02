import { getCurrentInstance } from '@nuxtjs/composition-api'

const useRefs = () => {
  // ========================================
  // refsへのaccessorを取得
  // ========================================
  const refs = getCurrentInstance()?.proxy.$refs

  return {
    refs,
  }
}

export default useRefs
