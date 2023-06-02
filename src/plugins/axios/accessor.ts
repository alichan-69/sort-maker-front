import type { Plugin } from '@nuxt/types'
import { initializeAxios } from '@/utils/api/axios'

export const accessor: Plugin = ({ $axios }): void => {
  initializeAxios($axios)
}

export default accessor
