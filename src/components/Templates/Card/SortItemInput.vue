<template>
  <VCard :class="classNames">
    <CroppingImageInput
      ref="croppingImageInput"
      :click-outside-dialog="clickOutSideDialog"
      :image-url="imageUrl"
    />
    <VCardTitle
      ><DefaultTextField
        counter="255"
        label="ソートアイテムの名前"
        :rules="rules"
        :value="value"
        :input="input"
    /></VCardTitle>
  </VCard>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api'
import { DefaultTextField } from '@/components/Parts'
import type { InputText, ClickOutsideDialog } from '@/types/event'
import { required, textLength } from '@/utils/rules'
import { NO_IMAGE_URL } from '@/utils/image'

export default defineComponent({
  components: {
    DefaultTextField,
    CroppingImageInput: () =>
      import('@/components/Templates/CroppingImageInput.vue'),
  },
  props: {
    classNames: {
      type: String,
      default: '',
      require: false,
    },
    clickOutSideDialog: {
      type: [Function, Promise] as PropType<ClickOutsideDialog>,
      default: () => {},
      require: false,
    },
    value: {
      type: String,
      default: '',
      require: true,
    },
    imageUrl: {
      type: String,
      default: NO_IMAGE_URL,
      require: true,
    },
    input: {
      type: Function as PropType<InputText>,
      default: () => {},
      require: true,
    },
  },
  setup() {
    const rules = ref([required, textLength(1, 255)])

    return {
      rules,
    }
  },
})
</script>
