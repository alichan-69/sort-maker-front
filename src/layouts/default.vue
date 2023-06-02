<template>
  <VApp id="app" class="bg-background">
    <DefaultHeader />
    <div class="w-[800px] tablet:w-full tablet:px-5 mx-auto text-center">
      <Nuxt />
    </div>
    <DefaultLoading />
    <DefaultFooter />
  </VApp>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { DefaultHeader, DefaultLoading } from '@/components/Templates'
import { DefaultFooter } from '@/components/Parts'

export default defineComponent({
  name: 'DefaultLayout',
  components: {
    DefaultHeader,
    DefaultLoading,
    DefaultFooter,
  },
})
</script>
