<template>
    <Layout subTitle="ログイン">
        <CustomAlert :text="errorMessage" color="warning" v-model="alert" />
        <CustomButton
            :block="true"
            color="twitter"
            class="white--text"
            icon="fab fa-twitter"
            text="ツイッターでログインする"
            textColor="white"
            @click="login"
        />
        <CustomCard
            title="ソートメーカーでツイッターログインすると下記のことができます"
            text="・ソートを作成する
            ・ソートのお気に入り登録をする"
        />
    </Layout>
</template>

<script>
import { mapActions } from 'vuex'
import { createHash } from 'crypto'
import crypto from 'crypto-js'
import { CustomAlert, CustomButton, CustomCard, Layout } from '../components'
import {
    showAlert,
    transitionPage,
    initializeApp,
} from '../common_functions/common'
import { registerUser } from '../common_functions/request'

export default {
    components: {
        CustomAlert,
        CustomButton,
        CustomCard,
        Layout,
    },
    data() {
        return {
            alert: false,
            errorMessage: '',
        }
    },
    methods: {
        login() {
            // firebaseの初期設定
            const firebase = initializeApp()
            // 初期設定ができていなかったらエラーメッセージを出す
            if (!firebase) {
                showAlert('ツイッターでのログインに失敗しました')
                return
            }

            // ツイッターでログイン処理
            const provider = new firebase.auth.TwitterAuthProvider()
            // ログイン処理が終了したらvuexに認証情報を保管後、Homeに画面遷移
            firebase
                .auth()
                .signInWithPopup(provider)
                .then(async (res) => {
                    // uidをハッシュ化
                    const hash = createHash('sha256')
                    hash.update(res.user.uid)
                    const hashedUid = hash.digest('hex')

                    // accesToken,secretを暗号化
                    const credential = res.credential
                    const key = process.env.VUE_APP_TWITTER_ENCRYPT_KEY

                    const encryptedOfAccessToken = crypto.AES.encrypt(
                        credential.accessToken,
                        key
                    ).toString()

                    const encryptedOfSecret = crypto.AES.encrypt(
                        credential.secret,
                        key
                    ).toString()

                    // ユーザーを登録
                    const postData = {
                        id: hashedUid,
                        name: res.user.displayName,
                        access_token: encryptedOfAccessToken,
                        secret: encryptedOfSecret,
                    }
                    const resOfRegisterUser = await registerUser(postData)
                    if (!resOfRegisterUser) {
                        showAlert('ツイッターでのログインに失敗しました')
                        return
                    }

                    // vuexに認証情報を保管
                    this.updateUid(hashedUid)
                    this.updateDisplayName(res.user.displayName)
                    this.updatePhotoURL(res.user.photoURL)
                    // home画面に遷移
                    transitionPage(this, 'home')
                })
                .catch(() => {
                    showAlert('ツイッターでのログインに失敗しました')
                })
        },
        ...mapActions(['updateUid', 'updateDisplayName', 'updatePhotoURL']),
    },
    name: 'Login',
}
</script>
