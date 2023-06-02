<template>
  <div :class="classoverride(classNames, 'flex flex-wrap gap-2')">
    <SortCard
      v-for="(sort, i) in sorts"
      :id="sort.id"
      :key="`${name}-card-list-card-${i}`"
      :name="sort.name"
      :description="sort.description"
      :src="sort.image"
      class-names="w-[calc(25%-6px)] sm:w-[calc(50%-6px)]"
      :click="() => clickCard(sort.id)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { SortCard } from '@/components/Views'
import { classoverride } from '@/utils/tailwindcss'
import type { Click } from '@/types/event'

type Sorts = {
  id: number
  name: string
  description: string
  image: string
}[]

type ClickCard = (sortId: number) => void | Click

export default defineComponent({
  components: { SortCard },
  props: {
    name: {
      type: String,
      default: '',
      require: true,
    },
    sorts: {
      type: Array as PropType<Sorts>,
      default: () => [],
      require: true,
    },
    classNames: {
      type: String,
      default: '',
      require: false,
    },
    clickCard: {
      type: [Function, Promise] as PropType<ClickCard>,
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
