import useNuxt from './useNuxt'

const useConfig = () => {
  // ========================================
  // configへのaccessorを取得
  // =========================================
  const { nuxt } = useNuxt()
  const config = nuxt.$config

  return {
    config,
  }
}

export default useConfig
