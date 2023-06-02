import { ref } from '@nuxtjs/composition-api'
import type { VForm } from 'vuetify/lib'
import type {
  SortTitleInput,
  SortItemInputList,
  CroppingImageInput,
  SortItemInput,
} from '@/components/Templates'
import type { Items } from '@/types/sort'
import type { Cropper } from '@/types/vueCropperJs'
import { useToast, useRefs, useFirebase } from '@/composables'
import { getCanvasBlob, NO_IMAGE_URL } from '@/utils/image'

const useChangeSort = () => {
  const { refs } = useRefs()
  const { errorToast } = useToast()
  const { fireModule } = useFirebase()
  const titleName = ref('')
  const titleDescription = ref('')
  const titleBlob = ref<Blob | null>(null)
  const titleUrl = ref(NO_IMAGE_URL)
  const itemValid = ref(false)
  const itemName = ref('')
  const itemBlob = ref<Blob | null>(null)
  const itemUrl = ref(NO_IMAGE_URL)
  const items = ref<Items>([])

  // ========================================
  // sortTitleInputのcropperのrefの取得処理
  // ========================================
  const titleCropper = () => {
    const sortTitleInput = refs?.sortTitleInput as unknown as InstanceType<
      typeof SortTitleInput
    >
    const croppingImageInput = sortTitleInput?.$refs
      ?.croppingImageInput as unknown as InstanceType<typeof CroppingImageInput>
    return croppingImageInput?.$refs?.cropper as Cropper
  }

  // =======================================================
  // sortItemInputListのsortItemInputのcropperのrefの取得処理
  // =======================================================
  const itemCropper = () => {
    const sortItemInputList =
      refs?.sortItemInputList as unknown as InstanceType<
        typeof SortItemInputList
      >
    const sortItemInput = sortItemInputList?.$refs
      ?.sortItemInput as unknown as InstanceType<typeof SortItemInput>
    const croppingImageInput = sortItemInput?.$refs
      ?.croppingImageInput as unknown as InstanceType<typeof CroppingImageInput>
    return croppingImageInput?.$refs?.cropper as Cropper
  }

  // =======================================================
  // sortItemInputListのsortItemsInputのcropperのrefの取得処理
  // =======================================================
  const itemsCropper = (index: number) => {
    const sortItemInputList =
      refs?.sortItemInputList as unknown as InstanceType<
        typeof SortItemInputList
      >
    const sortItemsInputs = sortItemInputList?.$refs
      ?.sortItemsInput as unknown as InstanceType<typeof SortItemInput>[]
    const sortItemInput = sortItemsInputs?.[index]
    const croppingImageInput = sortItemInput?.$refs
      ?.croppingImageInput as unknown as InstanceType<typeof CroppingImageInput>
    return croppingImageInput?.$refs?.cropper as Cropper
  }

  // ==============================
  // sortFormのrefの取得処理
  // ==============================
  const sortForm = () =>
    refs?.sortForm as unknown as InstanceType<typeof VForm> & {
      validate: () => boolean
    }

  // ==============================
  // itemFormのrefの取得処理
  // ==============================
  const itemForm = () => {
    const sortItemInputList =
      refs?.sortItemInputList as unknown as InstanceType<
        typeof SortItemInputList
      >
    return sortItemInputList?.$refs?.itemForm as unknown as InstanceType<
      typeof VForm
    > & { validate: () => boolean }
  }

  // =============================================
  // ソートタイトルの画像編集ダイアログの外側押下時の処理
  // =============================================
  const clickOutSideTitleDialog = async () => {
    try {
      const canvas = titleCropper()!.getCroppedCanvas({
        width: 300,
        height: 300,
      })

      // blobオブジェクトを変更
      const newBlob = await getCanvasBlob(canvas)
      if (!newBlob) throw new Error('blobオブジェクトが取得できませんでした')
      titleBlob.value = newBlob

      // urlを変更
      titleUrl.value = canvas.toDataURL()
    } catch {
      errorToast('画像を入力できませんでした')
    }
  }

  // =============================================
  // ソートアイテムの画像編集ダイアログの外側押下時の処理
  // =============================================
  const clickOutSideItemDialog = async () => {
    try {
      const canvas = itemCropper()!.getCroppedCanvas({
        width: 300,
        height: 300,
      })

      // blobオブジェクトを変更
      const newBlob = await getCanvasBlob(canvas)
      if (!newBlob) throw new Error('blobオブジェクトが取得できませんでした')
      itemBlob.value = newBlob

      // urlを変更
      itemUrl.value = canvas.toDataURL()
    } catch (error: any) {
      errorToast('画像を入力できませんでした')
    }
  }

  // =================================================
  // ソートアイテムリストの画像編集ダイアログの外側押下時の処理
  // =================================================
  const clickOutsideItemsDialog = (index: number) => async () => {
    try {
      const canvas = itemsCropper(index)!.getCroppedCanvas({
        width: 300,
        height: 300,
      })
      const item = items.value?.[index]

      if (item === undefined)
        throw new Error('ソートアイテムが存在しませんでした')

      // urlを変更
      item.url = canvas.toDataURL()

      // blobオブジェクトを変更
      const newBlob = await getCanvasBlob(canvas)
      if (!newBlob) throw new Error('blobオブジェクトが取得できませんでした')
      item.blob = newBlob
    } catch {
      errorToast('画像を入力できませんでした')
    }
  }

  // =============================================
  // ソートタイトルの名前の入力処理
  // =============================================
  const inputTitleName = (value: string) => {
    titleName.value = value
  }

  // =============================================
  // ソートタイトルの説明の入力処理
  // =============================================
  const inputTitleDescription = (value: string) => {
    titleDescription.value = value
  }

  // =============================================
  // ソートアイテムの名前の入力処理
  // =============================================
  const inputItemName = (value: string) => {
    itemName.value = value
  }

  // =============================================
  // ソートアイテムのバリデーションの入力処理
  // =============================================
  const inputItemValid = (value: boolean) => {
    itemValid.value = value
  }

  // =============================================
  // ソートアイテムリストの名前の入力処理
  // =============================================
  const inputItemsName = (index: number) => (value: string) => {
    const item = items.value?.[index]
    if (item !== undefined) item.name = value
  }

  // ===========================================================
  // ソートアイテムリストの要素の数が範囲外の時にエラーメッセージを出す処理
  // ===========================================================
  const validateSortItemsNumber = (
    mode: 'add' | 'remove' | 'default' = 'default'
  ) => {
    if (
      (mode === 'add' && items.value.length + 1 > 100) ||
      (mode === 'remove' && items.value.length - 1 < 2) ||
      (mode === 'default' &&
        (items.value.length > 100 || items.value.length < 2))
    ) {
      throw new Error('ソートアイテムの個数が範囲外です')
    }
  }

  // ========================
  // ソートアイテムを追加する処理
  // ========================
  const addSortItem = () => {
    try {
      // バリデーション
      itemForm()!.validate()
      if (!itemValid.value)
        throw new Error('ソートアイテムのバリデーションがエラーです')
      validateSortItemsNumber('add')

      // ソートアイテムの追加
      if (!itemBlob.value)
        throw new Error('blobオブジェクトが取得できませんでした')
      items.value.push({
        name: itemName.value,
        blob: itemBlob.value,
        url: itemUrl.value,
      })
    } catch (error: any) {
      if (error.message === 'ソートアイテムの個数が範囲外です')
        errorToast('2個以上100個以下で設定してください')
      if (error.message === 'blobオブジェクトが取得できませんでした')
        errorToast('画像を入力できませんでした')
    }
  }

  // ========================
  // ソートアイテムを削除する処理
  // ========================
  const removeSortItem = (index: number) => () => {
    try {
      // バリデーション
      validateSortItemsNumber('remove')

      items.value.splice(index, 1)
    } catch (error: any) {
      if (error.message === 'ソートアイテムの個数が範囲外です')
        errorToast('2個以上100個以下で設定してください')
    }
  }

  // ====================================
  // blobオブジェクトから拡張子を取得する処理
  // ====================================
  const getExtension = (blob: Blob) => {
    switch (blob.type) {
      case 'image/jpeg':
        return 'jpg'
      case 'image/png':
        return 'png'
      default:
        return false
    }
  }

  // ====================================
  // FirebaseCloudStorageへの画像登録処理
  // ====================================
  const registerImageFirebase = async (blob: Blob, path: string) => {
    const storageRef = fireModule.storage().ref()
    const metaData = {
      contentType: blob.type,
    }

    await storageRef
      .child(path)
      .put(blob, metaData)
      .catch(() => {
        throw new Error('firebaseへの画像登録に失敗しました')
      })
  }
  return {
    titleName,
    titleDescription,
    titleBlob,
    titleUrl,
    itemValid,
    itemName,
    itemBlob,
    itemUrl,
    items,
    titleCropper,
    itemCropper,
    itemsCropper,
    sortForm,
    itemForm,
    clickOutSideTitleDialog,
    clickOutSideItemDialog,
    clickOutsideItemsDialog,
    inputTitleName,
    inputTitleDescription,
    inputItemName,
    inputItemValid,
    inputItemsName,
    validateSortItemsNumber,
    addSortItem,
    removeSortItem,
    getExtension,
    registerImageFirebase,
  }
}

export default useChangeSort
