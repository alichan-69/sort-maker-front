<template>
  <img
    :src="src"
    :alt="alt"
    :class="classNames"
    v-bind="vBind"
    v-on="vOn"
    @click="click"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import type { Click } from '@/types/event'

export default defineComponent({
  props: {
    src: {
      type: String,
      default: '',
      require: true,
    },
    alt: {
      type: String,
      default: '',
      require: true,
    },
    classNames: {
      type: String,
      default: '',
      require: false,
    },
    vBind: {
      type: Object,
      default: () => {},
      require: false,
    },
    vOn: {
      type: Object,
      default: () => {},
      require: false,
    },
    click: {
      type: Function as PropType<Click>,
      default: () => {},
      require: true,
    },
  },
})
</script>
