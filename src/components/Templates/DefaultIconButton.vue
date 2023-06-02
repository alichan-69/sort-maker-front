<template>
  <VBtn :class="classNames" :color="color" icon @click="click">
    <DefaultIcon><slot /></DefaultIcon>
  </VBtn>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { DefaultIcon } from '@/components/Parts'
import type { ClickIconButton } from '@/types/event'

export default defineComponent({
  components: {
    DefaultIcon,
  },
  props: {
    color: {
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
      type: [Function, Promise] as PropType<ClickIconButton>,
      default: () => {},
      require: true,
    },
  },
})
</script>
