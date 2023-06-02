import type { VueCropperMethods } from 'vue-cropperjs'
import type VueCropper from 'vue-cropperjs'

export type Cropper =
  | (VueCropperMethods & InstanceType<typeof VueCropper>)
  | null
export type CroppingImageInput = HTMLElement
