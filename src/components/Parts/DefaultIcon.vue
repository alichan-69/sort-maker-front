<template>
  <VIcon :color="color" :class="classNames" :left="left">
    <slot />
  </VIcon>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    color: {
      type: String,
      default: '',
      require: false,
    },
    left: {
      type: Boolean,
      default: false,
      require: false,
    },
    classNames: {
      type: String,
      default: '',
      require: false,
    },
  },
})
</script>
