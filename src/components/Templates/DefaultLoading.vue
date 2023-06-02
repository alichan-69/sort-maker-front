<template>
  <VOverlay :value="loading">
    <VProgressCircular indeterminate color="secondary" />
  </VOverlay>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { UiStore } from '@/store'

export default defineComponent({
  setup() {
    const loading = computed(() => UiStore.getLoading)

    return {
      loading,
    }
  },
})
</script>
