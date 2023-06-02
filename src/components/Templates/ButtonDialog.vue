<template>
  <VDialog width="500">
    <template #activator="{ on, attrs }">
      <DefaultButton
        :block="block"
        :class-names="buttonClassNames"
        :v-bind="attrs"
        :v-on="on"
      >
        <slot name="button" />
      </DefaultButton>
    </template>
    <slot name="dialog" />
  </VDialog>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { DefaultButton } from '@/components/Parts'

export default defineComponent({
  components: {
    DefaultButton,
  },
  props: {
    block: {
      type: Boolean,
      default: false,
      require: false,
    },
    buttonClassNames: {
      type: String,
      default: '',
      require: false,
    },
  },
  setup() {},
})
</script>
