<template>
  <VTextarea
    :value="value"
    :label="label"
    color="secondary"
    :class="classNames"
    :counter="counter"
    :rules="rules"
    @input="input"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { classoverride } from '@/utils/tailwindcss'
import type { InputText } from '@/types/event'

export default defineComponent({
  props: {
    label: {
      type: String,
      default: '',
      require: false,
    },
    value: {
      type: String,
      default: '',
      require: true,
    },
    input: {
      type: Function as PropType<InputText>,
      default: () => {},
      require: true,
    },
    classNames: {
      type: String,
      default: '',
      require: false,
    },
    counter: {
      type: [Boolean, Number, String],
      default: false,
      require: false,
    },
    rules: {
      type: Array,
      default: () => [],
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
