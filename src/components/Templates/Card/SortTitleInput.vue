<template>
  <VCard :class="classNames">
    <CroppingImageInput
      ref="croppingImageInput"
      :image-url="imageUrl"
      :click-outside-dialog="clickOutSideDialog"
    />
    <div class="p-4">
      <DefaultTextField
        counter="255"
        label="ソートの名前"
        :rules="rules"
        :value="name"
        :input="inputName"
      />
      <DefaultTextArea
        counter="255"
        label="ソートの説明"
        :rules="rules"
        :value="description"
        :input="inputDescription"
      />
    </div>
  </VCard>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api'
import { DefaultTextField, DefaultTextArea } from '@/components/Parts'
import type { InputText, ClickOutsideDialog } from '@/types/event'
import { required, textLength } from '@/utils/rules'
import { NO_IMAGE_URL } from '@/utils/image'

export default defineComponent({
  components: {
    DefaultTextField,
    DefaultTextArea,
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
    name: {
      type: String,
      default: '',
      require: true,
    },
    description: {
      type: String,
      default: '',
      require: true,
    },
    imageUrl: {
      type: String,
      default: NO_IMAGE_URL,
      require: true,
    },
    inputName: {
      type: Function as PropType<InputText>,
      default: () => {},
      require: true,
    },
    inputDescription: {
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
