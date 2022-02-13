// ======================
// firebase認証の初期設定
// ======================
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import { store } from '../store'

export const initializeApp = function () {
    const config = {
        apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
        authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.VUE_APP_FIREBASE_APP_ID,
        measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
    }

    if (firebase.apps.length === 0) {
        firebase.initializeApp(config)
        return firebase
    } else {
        return firebase
    }
}

// =====================================
// firebasecloudstorageからの画像URL取得
// =====================================
export const getDownloadURL = async (path) => {
    // firebaseの初期設定
    const firebase = initializeApp()

    // 初期設定ができていなかったらエラーメッセージを出す
    if (!firebase) {
        showAlert('画像を表示できませんでした')
        return
    }

    const storageRef = firebase.storage().ref()

    return await storageRef
        .child(path)
        .getDownloadURL()
        .then((url) => {
            return url
        })
        .catch(() => {
            showAlert('画像を表示できませんでした')
        })
}

// ===========
// ページ遷移
// ===========
export const transitionPage = (component, name, params = {}) => {
    if (name === component.$router.currentRoute.name) {
        // 同じページに遷移する場合はリロード
        component.$router.go({
            name: component.$router.currentRoute.name,
            params: params,
        })
    } else {
        // 違うページに遷移する場合はページ遷移
        component.$router.push({ name: name, params: params })
    }
}

// =======================
// アラートの表示
// =======================
export const showAlert = (message, color = 'warning') => {
    store.dispatch('updateMessage', message)
    store.dispatch('updateColor', color)
    store.dispatch('updateIsShowAlert', true)
}
