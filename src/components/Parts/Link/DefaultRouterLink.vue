<template>
  <NuxtLink :to="to" :class="classNames">
    <slot />
  </NuxtLink>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    to: {
      type: String,
      default: '',
      require: true,
    },
    classNames: {
      type: String,
      default: '',
      require: false,
    },
  },
})
</script>
