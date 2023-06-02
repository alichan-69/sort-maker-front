<template>
  <VBtn
    :block="block"
    :class="classoverride(classNames, 'bg-secondary text-white')"
    :href="href"
    v-bind="vBind"
    v-on="vOn"
    @click="click"
  >
    <slot />
  </VBtn>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { classoverride } from '@/utils/tailwindcss'
import type { Click } from '@/types/event'

export default defineComponent({
  props: {
    block: {
      type: Boolean,
      default: false,
      require: false,
    },
    href: {
      type: String,
      default: '',
      require: false,
    },
    classNames: {
      type: String,
      default: '',
      require: false,
    },
    click: {
      type: Function as PropType<Click>,
      default: () => {},
      require: true,
    },
    vBind: {
      type: Object,
      default: () => ({}),
      require: false,
    },
    vOn: {
      type: Object,
      default: () => ({}),
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
