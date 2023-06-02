import { $axios } from '@/utils/api/axios'

type BaseRes<Data> = {
  code: number
  data: Data
  message: string
}

export declare type Sort = {
  id: number
  name: string
  description: string
  image: string
  play_count: number
  create_date: string
  update_date: string
  user_id: string
  user_name: string
}

type NoUserIdSort = {
  id: number
  name: string
  description: string
  image: string
  play_count: number
  create_date: string
  update_date: string
  user_name: string
}

export declare type SortItem = {
  id: number
  name: string
  image: string
  create_date: string
  update_date: string
}

// ========================================
// ユーザーの登録
// =========================================

type RegisterUserPostData = {
  id: string
  name: string
  access_token: string
  secret: string
}

type RegisterUserResData = BaseRes<number>

export const registerUser = async (postData: RegisterUserPostData) => {
  return await $axios
    .$post('/register-user', postData)
    .then((res: RegisterUserResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('ユーザーの登録に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

// ========================================
// ソートの登録
// =========================================

type RegisterSortPostData = {
  user_id: string
  name: string
  description: string
  item_names: string[]
}

type RegisterSortResData = BaseRes<{
  sort_id: number
  sort_item_ids: number[]
}>

export const registerSort = async (postData: RegisterSortPostData) => {
  return await $axios
    .$post('/register-sort', postData)
    .then((res: RegisterSortResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('ソートの登録に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

// ========================================
// ソート画像の登録
// =========================================

type RegisterSortImagePostData = {
  user_id: string
  image: string
  item_images: string[]
  sort_id: number
  sort_item_ids: number[]
}

type RegisterSortImageResData = BaseRes<number>

export const registerSortImage = async (
  postData: RegisterSortImagePostData
) => {
  return await $axios
    .$post('/register-sort-image', postData)
    .then((res: RegisterSortImageResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('ソート画像の登録に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

// ========================================
// ソートの編集
// =========================================

type EditSortPostData = {
  user_id: string
  sort_id: number
  name: string
  description: string
  item_names: string[]
}

type EditSortResData = BaseRes<{
  sort_id: number
  sort_item_ids: number[]
}>

export const editSort = async (postData: EditSortPostData) => {
  return await $axios
    .$post('/edit-sort', postData)
    .then((res: EditSortResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('ソートの編集に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

// ========================================
// ソートの検索
// =========================================

type SearchSortPostData = {
  id: number
  user_id?: string
}

type SearchSortResData = BaseRes<Sort>

export const searchSort = async (postData: SearchSortPostData) => {
  return await $axios
    .$post('/search-sort', postData)
    .then((res: SearchSortResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('ソートの検索に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

// ========================================
// 複数個のソートの検索
// =========================================

type SearchMultipleSortsPostData = {
  user_id?: string
  part_of_sort_name?: string
  is_sort_by_popularity?: boolean
  is_sort_by_time?: boolean
}

type SearchMultipleSortsResData = BaseRes<{
  sorts: Sort[]
}>

export const searchMultipleSorts = async (
  postData: SearchMultipleSortsPostData = {}
) => {
  return await $axios
    .$post('/search-multiple-sorts', postData)
    .then((res: SearchMultipleSortsResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('ソートの検索に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

// ========================================
// 複数個の登録したソートの検索
// =========================================

type SearchMultipleRegisterSortsPostData = {
  user_id: string
}

type SearchMultipleRegisterSortsResData = BaseRes<{
  sorts: NoUserIdSort[]
}>

export const searchMultipleRegisterSorts = async (
  postData: SearchMultipleRegisterSortsPostData
) => {
  return await $axios
    .$post('/search-multiple-register-sorts', postData)
    .then((res: SearchMultipleRegisterSortsResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('ソートの検索に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}
// ========================================
// ソートの削除
// =========================================

type DeleteSortPostData = {
  user_id: string
  sort_id: number
}

type DeleteSortResData = BaseRes<Number>

export const deleteSort = async (postData: DeleteSortPostData) => {
  return await $axios
    .$post('/delete-sort', postData)
    .then((res: DeleteSortResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('ソートの削除に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

// ========================================
// 複数個のソートアイテムの検索
// =========================================

type SearchMultipleSortItemsPostData = {
  id: number
}

type SearchMultipleSortItemsResData = BaseRes<{
  sort_items: SortItem[]
}>

export const searchMultipleSortItems = async (
  postData: SearchMultipleSortItemsPostData
) => {
  return await $axios
    .$post('/search-multiple-sort-items', postData)
    .then((res: SearchMultipleSortItemsResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('ソートアイテムの検索に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

// ========================================
// ソートが遊ばれた回数の更新
// =========================================

type UpdatePlayCountPostData = {
  sort_id: number
}

type UpdatePlayCountResData = BaseRes<number>

export const updatePlayCount = async (postData: UpdatePlayCountPostData) => {
  return await $axios
    .$post('/update-play-count', postData)
    .then((res: UpdatePlayCountResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('ソートが遊ばれた回数の更新に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

// ========================================
// お気に入りの検索
// =========================================

type SearchLikePostData = {
  user_id: string
  sort_id: number
}

type SearchLikeResData = BaseRes<{
  id?: number
  sort_id?: number
  user_name?: string
  delete_flg: boolean
  create_date?: string
  update_date?: string
}>

export const searchLike = async (postData: SearchLikePostData) => {
  return await $axios
    .$post('/search-like', postData)
    .then((res: SearchLikeResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('お気に入りの検索に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

// ========================================
// 複数個のお気に入りの検索
// =========================================

type SearchMultipleLikeSortsPostData = {
  user_id: string
}

type SearchMultipleLikeSortsResData = BaseRes<{
  like_sorts: NoUserIdSort[]
}>

export const searchMultipleLikeSorts = async (
  postData: SearchMultipleLikeSortsPostData
) => {
  return await $axios
    .$post('/search-multiple-like-sorts', postData)
    .then((res: SearchMultipleLikeSortsResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('お気に入りの検索に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

// ========================================
// お気に入りの削除
// =========================================
type DeleteLikePostData = {
  user_id: string
  sort_id: number
}

type DeleteLikeResData = BaseRes<number>

export const deleteLike = async (postData: DeleteLikePostData) => {
  return await $axios
    .$post('/delete-like', postData)
    .then((res: DeleteLikeResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('お気に入りの削除に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

// ========================================
// お気に入りの登録
// =========================================
type RegisterLikePostData = {
  user_id: string
  sort_id: number
}

type RegisterLikeResData = BaseRes<number>

export const registerLike = async (postData: RegisterLikePostData) => {
  return await $axios
    .$post('/register-like', postData)
    .then((res: RegisterLikeResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('お気に入りの登録に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

// ========================================
// ツイッターの投稿
// =========================================
type PostTweetPostData = {
  user_id: string
  text: string
}

type PostTweetResData = BaseRes<number>

export const postTweet = async (postData: PostTweetPostData) => {
  return await $axios
    .$post('/post-tweet', postData)
    .then((res: PostTweetResData) => {
      if (!res.code) {
        return res.data
      } else {
        throw new Error('ツイッターへの投稿に失敗しました')
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
}
