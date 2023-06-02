import type { NuxtAxiosInstance } from '@nuxtjs/axios'

// eslint-disable-next-line import/no-mutable-exports
let $axios: NuxtAxiosInstance

export const initializeAxios = (axiosInstance: NuxtAxiosInstance): void => {
  $axios = axiosInstance
}

export { $axios }
