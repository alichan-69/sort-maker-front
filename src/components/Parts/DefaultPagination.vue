<template>
  <VPagination
    :length="length"
    :value="value"
    :total-visible="5"
    :class="classNames"
    color="secondary"
    @input="input"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { classoverride } from '@/utils/tailwindcss'

type InputPagination = (value: number) => void

export default defineComponent({
  props: {
    length: {
      type: Number,
      default: 1,
      require: false,
    },
    value: {
      type: Number,
      default: 1,
      require: false,
    },
    classNames: {
      type: String,
      default: '',
      require: false,
    },
    input: {
      type: Function as PropType<InputPagination>,
      default: () => {},
      require: false,
    },
  },
  setup() {
    return {
      classoverride,
    }
  },
})
</script>
