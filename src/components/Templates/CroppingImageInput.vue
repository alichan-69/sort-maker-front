<template>
  <VDialog width="500" @click:outside="clickOutsideDialog">
    <template #activator="{ on, attrs }">
      <DefaultImage
        class-names="hover:opacity-50"
        :src="previewImageUrl"
        alt="ソートタイトルの画像"
        :v-bind="attrs"
        :v-on="on"
      />
    </template>
    <VCard class="children:mx-auto children:w-[300px]">
      <VCardTitle class="block text-center">画像編集</VCardTitle>
      <VFileInput
        class="mb-5"
        label="画像ファイル"
        prepend-icon="mdi-file-image"
        color="secondary"
        :rules="rules"
        :value="file"
        @change="changeImage"
        @click:clear="clearImage"
      />
      <vue-cropper
        ref="cropper"
        alt="トリミング画像"
        :src="imageUrl"
        :guides="false"
        :center="false"
        :view-mode="2"
        :auto-crop-area="0.5"
        :background="false"
        :rotatable="false"
        :aspect-ratio="1"
        class="mb-5"
        :wheel-zoom-ratio="zoomRatio"
        @zoom="zoomOnCropper"
        @ready="getInitialRatio"
      />
      <VSlider
        color="secondary"
        :step="zoomRatio"
        :min="minRatio"
        :max="maxRatio"
        track-color="secondary"
        :value="sliderRatio"
        @change="zoomOnSlider"
      >
        <template #prepend>
          <DefaultIcon color="secondary"> mdi-minus-circle </DefaultIcon>
        </template>
        <template #append>
          <DefaultIcon color="secondary"> mdi-plus-circle </DefaultIcon>
        </template>
      </VSlider>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
  watch,
  toRefs,
} from '@nuxtjs/composition-api'
import { DefaultImage, DefaultIcon } from '@/components/Parts'
import { classoverride } from '@/utils/tailwindcss'
import { fileSize, fileType } from '@/utils/rules'
import type { ClickOutsideDialog } from '@/types/event'
import type { Cropper } from '@/types/vueCropperJs'
import { useRefs } from '@/composables'
import { NO_IMAGE_URL } from '@/utils/image'

type ZoomEvent = Event & {
  detail: { originalEvent: Event; oldRatio: number; ratio: number }
}

export default defineComponent({
  components: {
    DefaultIcon,
    DefaultImage,
  },
  props: {
    clickOutsideDialog: {
      type: [Function, Promise] as PropType<ClickOutsideDialog>,
      default: () => {},
      require: true,
    },
    imageUrl: {
      type: String,
      default: NO_IMAGE_URL,
      require: true,
    },
  },
  setup(props) {
    const rules = ref([fileSize, fileType])
    const file = ref<File | null>(null)
    const { imageUrl } = toRefs(props)
    const previewImageUrl = ref(imageUrl.value)
    const maxRatio = ref<number>(3)
    const minRatio = ref<number>(1)
    const zoomRatio = ref<number>(0.125)
    const sliderRatio = ref<number>(0)
    const { refs } = useRefs()

    // ratioに関する変数の初期値の設定
    const getInitialRatio = () => {
      const canvas = cropper()!.getCanvasData()

      minRatio.value = canvas.width / canvas.naturalWidth
      maxRatio.value = minRatio.value * 3
      zoomRatio.value = (maxRatio.value - minRatio.value) / 8
      sliderRatio.value = minRatio.value
    }

    // 画像変更時の処理
    watch(imageUrl, (newImageUrl) => {
      // newImageUrlがNO_IMAGE_URLだった時previewImageUrlをNO_IMAGE_URLにする
      if (newImageUrl === NO_IMAGE_URL) previewImageUrl.value = NO_IMAGE_URL
      previewImageUrl.value = newImageUrl
    })

    // cropperのrefを取得する
    const cropper = () => refs?.cropper as unknown as Cropper

    const changeImage = (value: File) => {
      // fileが入力されてなかったら以降は実行しない
      if (!value) return
      file.value = value
      cropper()!.replace(URL.createObjectURL(value))
    }

    const clearImage = () => {
      cropper()!.replace(NO_IMAGE_URL)
    }

    const zoomOnCropper = (event: ZoomEvent) => {
      const ratio = event.detail.ratio

      // zoomの拡大率が最大値以上または最小値以下にならないようにする処理
      if (ratio > maxRatio.value) {
        event.preventDefault()
        // cropperの拡大率を新しい拡大率に反映
        cropper()!.zoomTo(maxRatio.value)
        // sliderの値にcropperの拡大率を反映
        sliderRatio.value = maxRatio.value
      } else if (ratio < minRatio.value) {
        event.preventDefault()
        // cropperの拡大率を新しい拡大率に反映
        cropper()!.zoomTo(minRatio.value)
        // sliderの値にcropperの拡大率を反映
        sliderRatio.value = minRatio.value
      } else {
        // sliderの値にcropperの拡大率を反映
        sliderRatio.value = ratio
      }
    }

    const zoomOnSlider = (ratio: number) => {
      cropper()!.zoomTo(ratio)
    }

    return {
      file,
      cropper,
      classoverride,
      changeImage,
      clearImage,
      rules,
      zoomOnCropper,
      zoomOnSlider,
      maxRatio,
      minRatio,
      zoomRatio,
      sliderRatio,
      previewImageUrl,
      getInitialRatio,
    }
  },
})
</script>
