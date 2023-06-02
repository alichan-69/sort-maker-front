import { resolve } from 'path'

export default {
  ssr: false,
  target: 'static',
  head: {
    titleTemplate: '%s | ソートメーカー',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', href: '/favicon.ico' }],
  },
  plugins: [
    '@/plugins/axios/accessor.ts',
    '@/plugins/persistedState.client.ts',
    '@/plugins/vueCropperJs.ts',
  ],
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api/module',
    '@vueuse/nuxt',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/toast',
    '@nuxtjs/firebase',
  ],
  axios: {
    baseURL: process.env.API_URL,
  },
  vuetify: {
    customVariables: ['@/assets/scss/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: '#e73d1d',
          secondary: '#fec81a',
          warning: '#e30065',
          success: '#4184c7',
          twitter: '#1d9bf0',
        },
      },
    },
  },
  firebase: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
    services: {
      auth: true,
      storage: true,
    },
  },
  srcDir: 'src/',
  alias: {
    '@/*': resolve(__dirname, '/src/*'),
  },
  css: ['@/assets/scss/global.scss'],
  server: {
    port: process.env.PORT || 3001,
  },
  publicRuntimeConfig: {
    APP_URL: process.env.APP_URL || 'http://localhost:3001',
    API_URL: process.env.API_URL || 'http://localhost:3000',
    TWITTER_ENCRYPT_KEY: process.env.TWITTER_ENCRYPT_KEY,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
}
