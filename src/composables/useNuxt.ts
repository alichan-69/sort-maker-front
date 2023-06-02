import { wrapProperty } from '@nuxtjs/composition-api'

const useNuxt = () => {
  // ========================================
  // nuxtへのaccessorを取得
  // ========================================
  const useNuxt = wrapProperty('$nuxt', false)
  const nuxt = useNuxt()

  return {
    nuxt,
  }
}

export default useNuxt
