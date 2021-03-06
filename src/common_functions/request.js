import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL

// =======================================
// 関数名に対応するパスの格納および共通関数
// =======================================

const apiEndPath = {
    'delete-like': 'delete-like',
    'delete-sort': 'delete-sort',
    'edit-sort': 'edit-sort',
    'register-like': '/register-like',
    'register-sort': '/register-sort',
    'register-sort-image': '/register-sort-image',
    'register-user': '/register-user',
    'search-sort': '/search-sort',
    'search-multiple-sorts': 'search-multiple-sorts',
    'search-multiple-sort-items': 'search-multiple-sort-items',
    'search-like': '/search-like',
    'search-multiple-like-sorts': '/search-multiple-like-sorts',
    'search-multiple-register-sorts': '/search-multiple-register-sorts',
    'update-play-count': '/update-play-count',
    'post-tweet': '/post-tweet',
}

const apiRequest = async (functionKey, postData) => {
    const endPath = apiEndPath[functionKey]
    return await axios.post(endPath, postData)
}

// ========================================
// お気に入りの登録
//=========================================

export const registerLike = async (postData) => {
    return await apiRequest('register-like', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return true
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// ソートの登録
//=========================================

export const registerSort = async (postData) => {
    return await apiRequest('register-sort', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return res.data.data
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// ソート画像の登録
//=========================================

export const registerSortImage = async (postData) => {
    return await apiRequest('register-sort-image', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return true
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// ユーザーの登録
//=========================================

export const registerUser = async (postData) => {
    return await apiRequest('register-user', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return true
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// お気に入りの検索
//=========================================

export const searchLike = async (postData) => {
    return await apiRequest('search-like', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return res.data.data
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// 複数個のお気に入りのソートの検索
//=========================================

export const searchMultipleLikeSorts = async (postData) => {
    return await apiRequest('search-multiple-like-sorts', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return res.data.data
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// ソートの検索
//=========================================

export const searchSort = async (postData) => {
    return await apiRequest('search-sort', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return res.data.data
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// 複数個のソートの検索
//=========================================

export const searchMultipleSorts = async (postData) => {
    return await apiRequest('search-multiple-sorts', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return res.data.data
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// 複数個の作成したソートの検索
//=========================================

export const searchMultipleRegisterSorts = async (postData) => {
    return await apiRequest('search-multiple-register-sorts', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return res.data.data
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// ソートアイテムの検索
//=========================================

export const searchMultipleSortItems = async (postData) => {
    return await apiRequest('search-multiple-sort-items', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return res.data.data
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// ソートの編集
//=========================================

export const editSort = async (postData) => {
    return await apiRequest('edit-sort', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return res.data.data
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// 遊ばれた回数の更新
//=========================================

export const updatePlayCount = async (postData) => {
    return await apiRequest('update-play-count', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return true
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// お気に入りの削除
//=========================================

export const deleteLike = async (postData) => {
    return await apiRequest('delete-like', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return true
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// ソートの削除
//=========================================

export const deleteSort = async (postData) => {
    return await apiRequest('delete-sort', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return true
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

// ========================================
// ツイッターの投稿
//=========================================

export const postTweet = async (postData) => {
    return await apiRequest('post-tweet', postData)
        .then((res) => {
            if (res.data.code === 0) {
                return true
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}
