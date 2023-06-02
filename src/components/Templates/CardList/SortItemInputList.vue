<template>
  <div class="children:mb-10">
    <VForm ref="itemForm" :value="itemValid" @input="inputItemValid">
      <SortItemInput
        ref="sortItemInput"
        class-names="mx-auto w-[300px]"
        :value="itemName"
        :input="inputItemName"
        :image-url="itemUrl"
        :click-out-side-dialog="clickOutSideItemDialog"
      />
    </VForm>
    <DefaultButton :block="true" :click="addSortItem">追加</DefaultButton>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(item, i) in items"
        :key="`${name}-sort-item-input-input-${i}`"
        class="relative w-[calc(25%-6px)] sm:w-[calc(50%-6px)]"
      >
        <DefaultIconButton
          class-names="absolute top-1 left-1 z-10"
          color="secondary"
          :click="removeSortItem(i)"
          >mdi-minus-circle</DefaultIconButton
        >
        <SortItemInput
          ref="sortItemsInput"
          :value="item.name"
          :image-url="item.url"
          :input="inputItemsName(i)"
          :click-out-side-dialog="clickOutSideItemsDialog(i)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import type { InputText, Click, ClickOutsideDialog } from '@/types/event'
import { DefaultButton } from '@/components/Parts'
import { SortItemInput } from '@/components/Templates'
import type { Items } from '@/types/sort'
import { NO_IMAGE_URL } from '@/utils/image'

type InputItemsName = (index: number) => (value: string) => void
type InputItemValid = (value: boolean) => void
type RemoveSortItems = (index: number) => void
type ClickOutSideItemsDialog = (index: number) => Promise<void>

export default defineComponent({
  components: {
    SortItemInput,
    DefaultButton,
    DefaultIconButton: () =>
      import('@/components/Templates/DefaultIconButton.vue'),
  },
  props: {
    name: {
      type: String,
      default: '',
      require: true,
    },
    itemName: {
      type: String,
      default: '',
      require: true,
    },
    itemUrl: {
      type: String,
      default: NO_IMAGE_URL,
      require: true,
    },
    inputItemName: {
      type: Function as PropType<InputText>,
      default: () => {},
      require: true,
    },
    inputItemsName: {
      type: Function as PropType<InputItemsName>,
      default: () => {},
      require: true,
    },
    clickOutSideItemDialog: {
      type: [Function, Promise] as PropType<ClickOutsideDialog>,
      default: () => {},
      require: true,
    },
    clickOutSideItemsDialog: {
      type: [Function, Promise] as PropType<ClickOutSideItemsDialog>,
      default: () => {},
      require: true,
    },
    addSortItem: {
      type: Function as PropType<Click>,
      default: () => {},
      require: true,
    },
    removeSortItem: {
      type: Function as PropType<RemoveSortItems>,
      default: () => {},
      require: true,
    },
    items: {
      type: Array as PropType<Items>,
      default: () => [],
      requrie: true,
    },
    itemValid: {
      type: Boolean,
      default: false,
      require: true,
    },
    inputItemValid: {
      type: Function as PropType<InputItemValid>,
      default: () => {},
      require: true,
    },
  },
})
</script>
